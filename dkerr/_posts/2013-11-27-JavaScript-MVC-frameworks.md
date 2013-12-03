---
author: dkerr
title: An introduction to MVC frameworks
layout: default_post
categories:
 - JavaScript
 - MVC
 - Frameworks
 - Backbone
 - KnockoutJS
 - Angular
 - EmberJS
summary: “The recent rise of web applications that have all the functionality of their desktop counterparts has highlighted the fact that JavaScript MVC Frameworks are now an essential part of any modern web developers toolkit.“
---
Web development has changed significantly in the past few years, it hasn't been too long since deploying a web project was simply uploading static HTML, CSS and JavaScript files to a http server. The growing popularity with providing software as a service has meant that applications that traditionally have resided on the desktop are being transferred to the browser.

Some of these web applications are large scale and very complex, JavaScript alone cannot be used to provide a stable foundation to write quality, maintainable code. As a result, lots of new MVC frameworks have been appearing that offer to provide some structure and guidance when developing these applications. 

## What are they?

MVC frameworks are libraries that can be included alongside JavaScript to provide a layer of abstraction on top of the core language. Their goal is to help structure the code base and separate the various concerns of an application into three parts:

* **Model** - Represents the data of the application. This usually matches up with the type of data a web application is dealing with, such as a user, video, picture or comment. Any changes made to the model typically notify any subscribed parties within the application.
* **View** - This is the user interface of the application. Most frameworks treat views as a thin adapter that sits just on top of the DOM. Typically the view observes a model and updates itself should it change in any way.
* **Controller** - Used to handle any form of input such as clicks or browser events. It's the controllers job to update the model when necessary (i.e. if a user changes their name). 

**Note:** not all frameworks strictly follow the MVC pattern. You may see some frameworks utilize a variation of the MVC pattern such as MVVM or MVP.

## Why are they needed?

A DOM manipulation library such as jQuery coupled alongside a few utilities libraries (underscore, modernizr) can make building webpages much easier. However, these libraries begin to lose their usefulness when you transfer them over to build single page web applications. 

Web applications are unlike a normal web page, they tend to have much more user interaction as well as needing to communicate with a backend server in real time asynchronously without page reloads. Typically, if you were to handle these sort of interactions without a MVC framework you'll end up writing [messy](http://tritarget.org/blog/2012/11/28/the-pyramid-of-doom-a-javascript-style-trap/), unstructured, unmaintainable and untestable code.

## When should you use them?

You should consider utilizing a MVC framework if you are building a web application with enough heavy-lifting on the client-side to highlight how it would be difficult to manage with JavaScript alone. Fail to do so and it is likely that eventually you'll find yourself re-inventing the functionality many parts that are already provided to you through the use of an MVC framework. 

Be aware, if you're just building a simple application that still has a lot of the heavy lifting on the server side (view generation) and there is little interaction on the client side, you might find that using a MVC framework might be overkill. In that case, it would be preferable just to use a simpler setup such as a DOM manipulation library with a few utility add-ons. 

The following checklist is not exhaustive but should provide enough context to help you decide whether a MVC framework is suitable or not for what you're building:

1. My application needs an asynchronous connection to the backend
2. My application has a lot of functionality that shouldn't result in a full page reload (i.e adding a comment to a post, infinite scrolling)
3. A lot of the viewing or manipulation of data will be within the browser rather than on the server
4. The same data is being rendered in different ways on the page 
5. My application has many trivial interactions that modify data (buttons, switches)

Good examples of web applications that fulfil this criteria are Google Docs, Gmail or Spotify.

## Introduction to the most popular frameworks

Arguably the four most popular frameworks available today are Backbone.js, Angular.js, EmberJS and KnockoutJS. This section aims to provide a high level comparison of these frameworks. 

The reason why it's essential to concentrate on just four frameworks is that each of these frameworks have been used extensively in both small and large projects in the wild and have a great amount of documentation and community support behind themselves. This means you can be confident that no matter framework is picked it will be able to fulfill any requirements as well as having help and support available along the way. Additionally, there is very little difference in terms of the quantity of features provided by each framework. However, their opinion and implementation differ on what approach you should take when building a web application.

These differences in approach mean that each framework has its own individual advantages and disadvantages that make them suitable in certain scenarios. Focusing on providing a comparison between these framework's philosophies ensures that you can pick a framework that is compatible with the requirements of the web application or just one that suits your personal taste.



##<img src="{{ site.baseurl }}/dkerr/assets/backbone.png"/>

Backbone.js offers a highly flexible, minimalist solution to separating concerns in your application. As a consequence of its minimal solution, Backbone.js used without its own plugins can be considered more of a utility library than a fully-fledged MVC framework.

This means that out of the box it may appear that Backbone isn't as fully featured as the other popular MVC frameworks available. This isn't quite the case, pairing Backbone with one of its add-ons like Marionette or Chaplin ensures that Backbone is as feature complete as other frameworks available.

Backbone.js has a vast library of plugins and add-ons that can be used to provide any sort of functionality that your application could require. Its modular approach means you can fine tune Backbone.js to use a different custom-made templating engine should your application require it. Furthermore, the flexibility that the modular approach provides makes Backbone.js incrediblely attractive when developing a web application with requirements that could change from day to day.

**Pros**: minimalist, flexible, great add-on / plugin support, un-opinionated, great [track record](http://backbonejs.org/#examples) of being used in complex web applications (Wordpress, Rdio, Hulu), source code extremely simple to read in its entirety, easy to pick up and learn

**Cons**: Requires external dependencies (underscore), memory management can trip beginners up, no built in two way binding, un-opinionated, requires plugins (Marionette, Chaplin) to become as feature complete as other MVC frameworks.




## <img src="{{ site.baseurl }}/dkerr/assets/angular.png"/>

Angular.js is designed and built by Google and is quickly gaining popularity. The stand out feature of Angular is its use of custom HTML tags and components to specify the intentions of your application. 

Angular also provides a HTML compiler that allows users to create their own Domain specific language in HTML, if used in the correct scenarios it can be an extremely powerful tool. This is in marked contrast to other frameworks which seek to deal with HTML's shortcomings by abstracting away the HTML, CSS and JavaScript by providing alternative ways to manipulate the DOM. 

**Pros**: Dependency injection, backed by Google, feature rich without plugins, testing framework built in, built-in form validation, directives, extremely easy to debug, 

**Cons**: Steep learning curve, [data-binding can be problematic for pages with large amounts of information](http://stackoverflow.com/questions/9682092/databinding-in-angularjs), hard to implement transitions when showing / hiding views




## <img src="{{ site.baseurl }}/dkerr/assets/ember.png"/>

EmberJS is an opinionated, modular framework that can be extremely simple and easy to work with should you follow its guidelines on how an application is built the Ember way.

EmberJS's convention over configuration approach means that out of the box it provides a good starting point to begin construction when compared to other frameworks.

If you've had experience working with Ruby on Rails you'll find familiarities when working with EmberJS. The creators of EmberJS are also members of the core Ruby team!

**Pros**: Fast development and prototyping, little configuration required, convention over configuration approach, Ember Data makes syncing with JSON API's much easier

**Cons**: Lacks extensive testing tools, hard to integrate 3rd party libraries due to its opinionated approach, initially has a large learning curve, unstable API




## <img src="{{ site.baseurl }}/dkerr/assets/knockout.png"/>

KnockoutJS aims to simplify dynamic JavaScript UIs with a MVVM (Model - View - View - Model) pattern.

It provides declarative bindings that make it extremely easy to build even the most complex and dynamic UIs while ensuring that the underlying data model is left clean. 

Custom behaviours [such as sorting a table](http://knockoutjs.com/examples/grid.html) can be easily implemented via bindings in just a few lines of code.

KnockoutJS also has fantastic compatibility support; it works on all modern browsers as well as legacy browsers such as Internet Explorer 6!

**Pros**: Inter-application dependencies handled via dependency graph allow good performance even for data-heavy applications, data binding is intuitive and easy to learn, custom events allow for easy implementation of custom behaviour, great browser compatibility

**Cons**: HTML templates / views can get messy if lots of bindings are used, end to end functionality (url-routing, data-access) not available out of the box, no third-party dependencies



## Which one to choose?

It's vital that due diligence is paid before selecting a framework to use for your web application. The framework you choose may be used to implement complex uncommon functionality as well as being used to maintain the application for years ahead.

Here are some high level summaries to try and steer your thought process to which ones to try out.

**Use Backbone.js if:**
1. Your Web application has uncertain requirements and as a result flexibility is vital. 
2. You need to be able to easily swap and change parts of my web application out if necessary (i.e templating engine). 
3. You'd like to start with a minimalist solution to help understand the fundamentals of MVC frameworks.

**Use Angular.js if:**
1. You want your MVC framework to be backed by a large reputable company to ensure its reliability and stability. 
2. The use of a domain-specific language could help reduce the complexity of my web application.
3. The web application will have extensive testing to verify its functionality. You need a testing framework that has been built from the ground up to work with the MVC framework rather than against it.

**Use EmberJS if:**
1. You've previously had experience with Ruby and enjoyed using its convetion over configuration approach.
2. You need a framework that helps me to develop solutions and prototypes quickly.
3. Your web application needs a framework to handle the interaction with a JSON API with very little effort required.

**Use KnockoutJS if:**
1. The MVVM pattern provided by Knockout is much more suitable for the structure of my application.
2. The framework and application need to support legacy browsers such as IE6.
3. Your application has a complex dynamic UI and as a result my framework should help support creating these as cleanly as possible.

## Conclusion

In conclusion, the discussion above illustrates how there isn't a one size-fits-all ideal framework to pick for all scenarios. Each framework has its own advantages and disadvantages that make it suitable in different cases, depending on the application being built. It is reccomended to try out each of the frameworks for just a short while to get a feel for each one. 

Another good idea is to build some proof of concept prototypes in each framework and compare the implementation. This is similar to what the authors behind [TodoMVC](http://www.todomvc.com) started which highlights the differences between a huge number of MVC frameworks by implementing a simple TODO application in each one.

It is also important to note that we've only scratched the surface in looking at four of the numerous MVC frameworks available to use today. Each one has their own unique viewpoint and subtleties on how MVC should be implemented for a web application.