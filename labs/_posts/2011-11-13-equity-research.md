---
author: labs
title: Equity Research
oldlink: "http://www.scottlogic.co.uk/labs/market-overview/"
tags: 
techs:
 - flex
 - html5
layout: default_post
source: scottlogic
summary: Equity Research is a research portal web application providing intra-day and end-of-day UK equity data for companies, sectors and indices.
---
##Motivation

Most investment banks provide research portals as an incentive for customers to trade with them. Scott Logic has developed research portals for several of our investment banking clients. This demo does not feature as much content (for example, analyst research) as applications developed for our clients, but gives an indication of some of their features.

Clear and efficient navigation is essential in a well-designed research portal, together with the appropriate technology choices. For example, where limited interaction is needed, a light-weight JavaScript chart is use for speed of loading. Where more complex, application-like interaction is required, a plug-in based solution (in this case, Flash) has been used.

##Overview

Equity Research is a web-based research portal providing intra-day and end-of-day UK equity data for companies, sectors and indices. It also includes analytical functionality such as charting. The application is made up of a summary screen and different screens for viewing indices, sectors and companies. Navigation through the application is designed to be intuitive, with companies, sectors and indices all clickable wherever their names appear and an auto-completing search facility available throughout.

The Summary screen provides an overview of the market, including the latest news articles of relevance to the market, a scrolling stock ticker and the Large Cap and Small Cap biggest gainers and losers. Intraday performance for the three main indices in the UK equity market is shown using an HTML/JavaScript chart (using the Closure Charts library), and historic performance is shown using sparklines. Performance within the sector is shown by a graphic giving the proportion of stocks gaining or losing more or less than 2%.

![Summary Screen]({{ site.github.url }}/labs/assets/market_overview.png)

The Index screen provides market data for a single index, including current index value and performance data, the biggest constituents with the biggest gains and losses, and an overview of change within the index by sector using the same approach adopted on the Summary screen. An interactive time series chart (developed using Flex) allows users to plot additional instruments against the index for analytical comparison.

![Index Screen]({{ site.github.url }}/labs/assets/index_page.png)

The Sector screen presents an overview of a particular sector, including a summary of the biggest gainers and losers, and a sortable table of market information for sector constituents. An interactive chart (developed using Flex) shows the three largest constituent companies by market capitalisation, but users can add and remove instruments as required, as well as zoom and pan.

![Sector Screen]({{ site.github.url }}/labs/assets/sector_page.png)

The Company screen provides information and market data relating to a particular company, such as the current value, performance and fundamentals of the stock, and a company profile. An interactive research chart shows historical stock prices; users can add and remove other instruments for analytical comparison. Market information for companies in the same sector is summarised in a sortable table.

![Company Page]({{ site.github.url }}/labs/assets/company_page.png)

An auto-completing quick-search facility can be found on every screen in the Market Overview application to enable users to navigate directly to any company in the application. The auto-complete prompt shows tickers and names for the matching companies, and also some performance data, so the auto-complete can also be used as a mechanism for quickly looking up basic performance information if desired.

![Autocomplete]({{ site.github.url }}/labs/assets/autocomplete.png)

##Sparklines

Throughout the application we have made extensive use of [Edward Tufte's](http://www.edwardtufte.com/tufte/) [sparkline](http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001OR) concept because of their ability to convey significantly more contextual information than the traditional up-down trend arrows in a similar amount of screen space. As well as showing current performance, they highlight recent highs and lows and allow for 'at a glance' comparison of trends between stocks without the need for charting.

![Sparklines]({{ site.github.url }}/labs/assets/sparklines.png)


