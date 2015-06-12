---
author: awallis
title: "Fixing an LDAP PermGen leak in JBoss"
layout: default_post
summary: "The standard LDAP JNDI implementation that ships with Java leaks a classloader reference when used from a web-application hosted in a web container. While Tomcat and Jetty both include factory-fitted workarounds, JBoss  does not. This post describes a JBoss-specific fix."
---
I recently devoted some time to tracking down a couple of PermGen errors in a web-application hosted on JBoss. After fixing the first leak I came up against a leak from the LDAP JNDI implementation included in Oracle's JVM. Both the Tomcat and Jetty web application containers provide factory-fitted workarounds, but unfortunately not so with JBoss. Since I struggled to find anything online, I had to come up with my own workaround. I've described it in this post in the hopes it may help someone else.
