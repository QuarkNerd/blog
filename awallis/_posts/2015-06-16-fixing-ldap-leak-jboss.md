---
author: awallis
title: "Fixing an LDAP PermGen leak in JBoss"
layout: default_post
summary: "The standard LDAP JNDI implementation that ships with Java leaks a classloader reference when used from a 
web-application hosted in a web container. While Tomcat and Jetty both include factory-fitted workarounds, JBoss  does 
not. This post describes a JBoss-specific fix."
---
I recently devoted some time to tracking down a couple of PermGen errors in a web-application hosted on JBoss. After 
fixing the first leak I came up against a leak from the JNDI/LDAP implementation included in Oracle's JVM. Both the 
Tomcat and Jetty web application containers provide factory-fitted workarounds, but unfortunately not so with JBoss. 
Since I struggled to find anything online, I had to come up with my own workaround. I've described it in this post in 
the hopes it may help someone else.

## Leak Background

At some point during Java EE development it is likely you will encounter a dreaded 
`java.lang.OutOfMemoryError: PermGen space`. [This article](http://java.dzone.com/articles/what-permgen-leak 
"What is a PermGen Leak?") published on DZone provides a good background to PermGen leaks. All the leaks I encountered 
were due to long-running threads that continue after the web-application has been undeployed.

When a thread is started it holds a reference to a classloader. If the thread is started either directly or indirectly
(typically through a third-party dependency) by a web-application, this classloader will be the web-application's 
classloader. If the thread is not cleanly stopped when the web-application is undeployed, the thread continues running
and the strong reference to the classloader will prevent the web-application's classes from being garbage-collected.
After a few redeploys typical of a development environment the application server will run out of permanent generation
memory, generating the PermGen OutOfMemoryError. It should be noted that it makes no difference if a thread is marked
as a daemon thread - this will only influence the lifetime of the JVM (when all non-daemon threads complete the JVM
will exit). Since the application server itself continues running even after all web-applications are undeployed, any
daemon threads started by any web-applications will continue running.

It is very easy for such leaks to be introduced into your web-application through the use of third-party or system 
libraries. A library may have a justified reason for starting a long-running background thread but since it cannot know 
the context in which it is used it is up to the web-application to ensure it is cleanly stopped. This is typically done 
by calling a suitable close method provided by the library from a servlet context listener's `contextDestroyed` method.

## JNDI/LDAP Leak

The JNDI/LDAP leak occurs when Oracle's JNDI/LDAP service provider is configured to use connection pooling with a 
non-zero idle timeout. Under these conditions the JNDI/LDAP provider starts a daemon "PoolCleaner" thread responsible 
for closing idle connections, however this thread is long-running and there is no clean way of requesting it to stop.
The PoolCleaner thread is started when the `com.sun.jndi.ldap.LdapPoolManager` class is first loaded which may happen
if using the JNDI API directly, or indirectly for example through using the `spring-security` library configured for 
LDAP authentication. In either of these cases the `LdapPoolManager` class is loaded while the web-application's 
classloader is in context and is consequently set as the PoolCleaner thread's `contextClassLoader` thereby leaking the
web-application's classloader.

At this point it should be noted this leak only occurs the first time the `LdapPoolManager` class is loaded. Because 
this class is a system class it is only loaded once by the system classloader. Subsequent redeploys of the 
web-application will not be leaked in this fashion, but the PoolCleaner thread will continue to reference the 
classloader of the first-deployed web-application. While this makes the impact of this leak less critical in that the
memory consumed by the leak will be finite, it will still impact the overall memory available to subsequent deployments.

Tomcat and Jetty both provide workarounds for this leak - see Tomcat's [JRE Memory Leak Prevention Listener](https://tomcat.apache.org/tomcat-7.0-doc/config/listeners.html#JRE%20Memory%20Leak%20Prevention%20Listener%20-%20org.apache.catalina.core.JreMemoryLeakPreventionListener)
and Jetty's [LDAPLeakPreventer](http://www.eclipse.org/jetty/documentation/current/preventing-memory-leaks.html). Both
these workarounds function by ensuring the `LdapPoolManager` class is loaded up front by the application server itself
which ensures the PoolCleaner thread's context classloader will be initialised to the application server's classloader.
Unfortunately JBoss does not include this workaround. The most I've been able to find is [this thread](https://developer.jboss.org/thread/164760?_sscc=t) 
which seems to indicate there was no plan to add the workaround.

## JBoss Workaround

The workaround is misleadingly simple - invoke `Class.forName("com.sun.jndi.ldap.LdapPoolManager")`, however this must
only be called when we know the context classloader is the system classloader. For this reason we cannot implement the
workaround from within our web-application - it needs to be done from within the application server. 

Fortunately JBoss provides the concept of global modules - these are basically libraries that you can pre-install into
your JBoss installation and which can then be accessed by web-applications. This can allow for commonly used frameworks
and libraries such as spring or hibernate to be installed and effectively shared across multiple web-applications, 
avoiding the need for packaging these hefty frameworks with each web-application. The JBoss documentation on 
classloading provides some limited information on [global modules](https://docs.jboss.org/author/display/AS71/Class+Loading+in+AS7#ClassLoadinginAS7-GlobalModules "Global Modules").

Our JBoss workaround will therefore involve implementing a global module from which the `LdapPoolManager` class will 
be loaded. However it is not as simple as this because global modules are passive libraries with no notion of 
lifecycle - they are not loaded automatically by JBoss but instead are loaded as required by web-applications. 
A web-application declares a dependency on a module using the jboss-specific `jboss-deployment-structure.xml` file,
and then only when the web-application actually accesses one of the module's classes will the module class be loaded. 

The JBoss workaround is therefore a combination of a global module that performs the actual load of the 
`LdapPoolManager` class, and a web-application that triggers the global module. This unfortunately makes the workaround 
rather unwieldy however I have not found a better solution.

### Global Module

Our module will consist of a single class named `com.scottlogic.ldapleakpreventer.LDAPLeakPreventer`. It looks like this:
```
public class LDAPLeakPreventer {
    static {
        loadLdapPoolManagerClass();
    }

    private static void loadLdapPoolManagerClass() {
        ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        Thread.currentThread().setContextClassLoader(null);
        try {
            ldapPoolClass = AccessController.doPrivileged(new PrivilegedAction<Class<?>>() {
                @Override
                public Class<?> run() {
                    try {
                        return Class.forName("com.sun.jndi.ldap.LdapPoolManager");
                    } catch (ClassNotFoundException e) {
                        e.printStackTrace();
                        return null;
                    }
                }
            });
        } finally {
            Thread.currentThread().setContextClassLoader(contextClassLoader);
        }
    }
}
```
It loads the LdapPoolManager class from a static block because I do not want the web-application to have a compile-time
dependency on this class. We need to still be careful with the context loader even though the LdapPoolManager class is
being loaded from within a module. The calling thread has our web-application classloader set as the context classloader
because it is our web-application loading the module class. We simply set the context class loader to null while loading
the LdapPoolManager class so that the PoolCleaner will not inherit the context class loader, and we ensure that we set
it back when complete. Another catch I discovered is the `Thread.inheritedAccessControlContext` will also keep a 
reference to the classloader. Loading the LdapPoolManager class from within `doPrivileged` prevents the classloader 
being leaked.

To package this class as a JBoss module, the .class files are added to a jar file named `ldapleakpreventer.jar`. JBoss 
modules are installed under `<JBOSS_HOME>/modules`, ours will have the following structure:
```
modules 
  - com/scottlogic/ldapleakpreventer/main
    - ldapleakpreventer.jar
	- module.xml
```
The `module.xml` file contains the following:
```
<?xml version="1.0" encoding="UTF-8"?>
<module xmlns="urn:jboss:module:1.0" name="com.scottlogic.ldapleakpreventer">
    <resources>
        <resource-root path="ldapleakpreventer.jar"/>
    </resources>
    <dependencies>
        <module name="sun.jdk"/>
    </dependencies>
</module>
```
The resources element simply references the jars that should be included with the module. The dependencies element 
lists the modules that this module depends on. The module name should correspond to a module definition already in the 
JBoss modules folder. JBoss has modularised the com.sun.* classes making it necessary to explicitly specify this 
dependency otherwise our module will not be able to load the LdapPoolManager class.

Lastly we need to register our module as a global module to make it available to web-applications. This is done by 
editing the JBoss `standalone.xml` configuration file, and adding the following:
```
<subsystem xmlns="urn:jboss:domain:ee:1.0" >            
  <global-modules>
    <module name="com.scottlogic.ldapleakpreventer" slot="main" />            
  </global-modules> 
</subsystem>
```

### Web Application

The ldapleakpreventer module must be loaded explicitly from a web-application. The web-application registers a 
`ServletContextListener` which calls `Class.forName("com.scottlogic.ldapleakpreventer.LDAPLeakPreventer")` from its 
`contextInitialized()` method.

While there is no compile-time dependency between the web-application and the module, there is a runtime dependency. 
This must be declared in the `WEB-INF/jboss-deployment-structure.xml` file which looks like this:
```
<?xml version="1.0" encoding="UTF-8"?>  
<jboss-deployment-structure>  
    <deployment>  
        <dependencies>  
            <module name="com.scottlogic.ldapleakpreventer" />  
        </dependencies>  
    </deployment>
</jboss-deployment-structure>
```

### Last Thoughts

This workaround is cumbersome. I do not like the web-application - module interaction. I know JBoss also supports
extensions or subsystems which should remove the need for the web-application to trigger the module however I found the 
information on subsystems even more sparse than modules. There is also a gotcha associated with the way the 
LdapPoolManager starts the PoolCleaner thread. I mentioned that the PoolCleaner thread is only started if the idle 
timeout is set to a non-zero value. This timeout is configured via a system property 
`com.sun.jndi.ldap.connect.pool.timeout` which LdapPoolManager reads once when the class is loaded. This means that if
this property is only set by the web-application, then loading the LdapPoolManager class before the web-application will
not result in the PoolCleaner thread starting, and in fact the PoolCleaner thread will never be started. Similarly, if
there are multiple web-applications, the first web-application to be deployed will control how the LdapPoolManager is
loaded and whether the PoolCleaner thread is started.
