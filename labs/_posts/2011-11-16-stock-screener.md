---
author: labs
title: Stock Screener
oldlink: "http://www.scottlogic.co.uk/labs/stock-screener/"
tags: 
techs:
 - html5
layout: default_post
source: scottlogic
summary: Stock Screener provides dynamic filtering of real-time UK equity data for both analytical and portfolio-building purposes.
---
##Motivation

Screeners are commonly used in research, to allow users to sift through the large number of financial instruments that there may be in a particular domain. Scott Logic has developed screeners for several of our investment banking clients. This demo shows an example of screening UK equities.

The application is implemented entirely in HTML and JavaScript to provide a small download footprint and seamless integration with other web content. Distribution and funnel charts are used to show the stocks matching the selected filters, and are updated in real-time as the user updates their criteria.

##Overview

Stock Screener is an HTML5 application that allows users to filter and analyse our UK equity data based on key metrics. By default the full data set is used for filtering, but this can be limited to particular sectors if required. The filter criteria are set either by entering explicit values or by using the sliders on the criterion's distribution chart. The distribution charts are simple histograms of the criterion values for the entire data set, thereby presenting additional contextual information to aid analysis.

![Stock Screener]({{ site.github.url }}/labs/assets/stock_screener.png)

Criteria can be added, removed and re-ordered, using drag and drop when supported by the browser, to ensure users can choose the exact filter configuration they require. An annotated funnel chart beside the filter criteria inputs shows the effect successive criteria have on the size of the filtered data set.

![Stock Screener]({{ site.github.url }}/labs/assets/stock_screener_criteria.png)

The screener results are presented in a sortable table, which if required can be exported to Excel for further manipulation and analysis. The application also allows users to convert results into custom portfolios which can subsequently be revisited and monitored. Stocks can be added and removed from portfolios, using drag and drop when supported by the browser and portfolios can easily be created and deleted.

