---
author: labs
title: XAML Finance
oldlink: "/labs/xaml-finance/"
tags: 
techs:
 - silverlight
 - windows
 - wp7
layout: default_post
source: scottlogic
summary: XAML Finance is a cross-platform application for viewing and analysing FTSE 100 equities. The application is available on the desktop, web and mobile as a demonstration of cross-platform .NET development..
---
##Motivation
It is becoming increasingly common for investment banks to deliver their research and trading applications across a range of platforms, from desktop, to web, to mobile. Ideally, a single codebase would be developed to cater for each platform, but due to differing development technologies this is infeasible.

XAML Finance was developed as a demonstration project in code-sharing with Microsoft technologies. The end result was an application which shared 75% of its code across the desktop, web and mobile.

You can view the [web-based Silverlight version](http://www.scottlogic.co.uk/blog/colin/xaml-finance/) of XAML Finance, watch a [video of the Windows Phone 7 version](http://www.youtube.com/watch?v=ISWu2VOKIyc) and read the (more technical) [accompanying CodeProject article](http://www.codeproject.com/KB/windows-phone-7/XAMLFinance.aspx).

You can watch a [video of the Windows Phone 7 version](http://www.youtube.com/watch?v=ISWu2VOKIyc) and read the (more technical) [accompanying CodeProject article](http://www.codeproject.com/KB/windows-phone-7/XAMLFinance.aspx).

##Overview

XAML Finance is a .NET cross-platform application that provides access to FTSE 100 data and analytics on the desktop, web and mobile devices. The same content and functionality is provided across all the form factors, but in each case their respective capabilities, such as multi-touch and orientation-awareness, and constraints, such as screen size, have been taken into consideration.

The application presents a Price List for the entire FTSE 100 from which individual entries can be selected to open a corresponding Company Overview that provides more detailed information for a specific stock with an accompanying interactive chart. The Heatmap is a combined [treemap](http://en.wikipedia.org/wiki/Treemapping) and [heatmap](http://en.wikipedia.org/wiki/Heatmap), based on the concept implemented in our Market Map project, from which Company Overviews can also be opened.

The web-based version of XAML Finance uses the Microsoft Silverlight plug-in technology. The price list, company overviews and heatmap are presented as a tabbed user interface, allowing the user to switch rapidly between the pages of interest.

![XAML Finance]({{ site.baseurl }}/labs/assets/xaml3.jpg)

The desktop version of the application uses WPF and presents the functionality as a multi-window interface, making best use of desktop application capabilities.

![XAML Finance]({{ site.baseurl }}/labs/assets/xaml2.jpg)

The Windows Phone 7 version is the most distinct, closely following the Metro theme that defines the platform both in terms of look and behaviour. A video of this version in action can be viewed here.

![XAML Finance]({{ site.baseurl }}/labs/assets/xaml4.jpg)

For a more technical discussion of the project, please read the [accompanying CodeProject article](http://www.codeproject.com/KB/windows-phone-7/XAMLFinance.aspx).


