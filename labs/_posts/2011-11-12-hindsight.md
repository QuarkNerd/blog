---
author: labs
title: Hindsight
oldlink: "/labs/hindsight/"
tags: 
techs:
 - flex
layout: default_post
source: scottlogic
summary: Hindsight is a time-series charting application for the analysis of historical end-of-day equity data, allowing users to plot time series, apply analytics, and annotate charts.
---
##Motivation

Time series charting is essential to pre-trade analytics, and we have developed interactive charting applications for many of our investment banking clients. This demo is not as complex as applications developed for clients, but it provides an indication of their capabilities.

Users typically perform many analyses, so responsiveness and ease of use are both critical success factors. For these reasons, we generally recommend the use of Flex or Silverlight for such web applications. This demo is written in Flex, though we have written similar applications in Silverlight.

##Overview

Hindsight is a time-series charting application for research into historical equity data. Users can easily select companies for which to plot time series. Zooming and panning allow users to choose the section of the chart on which they focus, and datatips allow users to drill down to specific values for any point in the time series. Additional features such as dynamically calculated statistical information and the ability to add analytical annotations provide support for more advanced analysis.

![Hindsight]({{ site.baseurl }}/labs/assets/hindsight.png)

Equity time series can be added to the chart through two different mechanisms. The auto-completing search box allows users to add series for companies by name, while the selector, located in the pullout tab on the right-hand side supports more general searching and filtering to find the desired series (see [Graham's blog post]({{ site.baseurl }}/2010/05/19/contextual-cues-in-ui-design.html) for a detailed UX analysis).

![Add Series Controls]({{ site.baseurl }}/labs/assets/hindsight2.png)

Hindsight's analytical features are all calculated client-side, both to reduce the load on the server and also to provide the immediacy and responsiveness normally only associated with desktop applications. For example, when multiple series are plotted, by default they are rebased on the date range currently being viewed. Client-side rebasing provides the user with immediate updates while panning or zooming the chart. Similarly, the statistical information for each series is kept updated no matter how quickly a user interacts with the chart. The immediacy of the client-side calculation is even more apparent when more advanced analytical annotations such as moving averages and Bollinger Bands are added to the chart.

![Hindsight]({{ site.baseurl }}/labs/assets/hindsight_rebasing.png)