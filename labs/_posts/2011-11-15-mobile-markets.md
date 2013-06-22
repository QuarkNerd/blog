---
author: labs
title: Mobile Markets
oldlink: "/labs/mobile-markets/"
tags: 
techs:
 - html5
 - ios
 - android
layout: default_post
source: scottlogic
summary: Mobile Markets brings intra-day and end-of-day UK equity data to your mobile. It supports browsing and searching as well as analytical functionality such as time-series charting.
---
##Motivation

Financial institutions are increasingly becoming interested in mobile devices, particularly for research applications. Scott Logic has developed innovative applications for many of our investment banking clients, across a variety of mobile platforms.

This demo shows an example of an equity research portal for mobile devices, developed completely in HTML5 to offer both a small foot-print and maximum device independence. The application demonstrates the innovative Closure Charts JavaScript charting component developed by Scott Logic.

##Overview

Mobile Markets is an HTML5 web portal application that provides access to UK equity data and analytics on mobile devices, either through the browser or as a native application, with a particular focus on the speed and reliability required for such devices. By designing it as a web-based application, it was possible to develop a service targeting a wide range of platforms, from regular desktop browsers to smartphones and tablets, without any platform-specific code.

![Fund Screener]({{ site.baseurl }}/labs/assets/mobile_markets1.png)

Since Mobile Markets is intended to primarily target mobile platforms, it has been designed to have the look and feel of a typical native mobile application, while maintaining the flexibility and portability of a web application. Furthermore, Mobile Markets has been turned into a genuine native application with 100% code re-use by embedding it in "wrapper applications" for various platforms using PhoneGap, thereby allowing its release in the relevant app marketplaces.

To further improve the application feel of Mobile Markets, it makes use of the HTML5 Application Cache to allow it to work in an offline mode using resources cached when the user first visited the home page of the application with an active internet connection. The HTML5 Application Cache enables more explicit control than standard HTTP caching by allowing the application to fetch and cache resources based on a manifest file.

A major feature of the Mobile Markets application is the use of the Scott Logic developed Closure Charts, a JavaScript charting component built on top of the Closure Library with an emphasis on cross-browser performance (including IE and mobile browsers). Closure Charts provides fully interactive charts with mouse and touch gesture interaction through optional modular plugins. For example, on devices running iOS, multi-touch gestures enable support for features such as pinch zooming.

![Fund Screener]({{ site.baseurl }}/labs/assets/mobile_markets2.png)
