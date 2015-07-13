---
author: labs
title: Fund Screener
oldlink: "http://www.scottlogic.co.uk/labs/fund-screener/"
tags: null
techs:
  - html5
layout: default_post
source: scottlogic
summary: Fund Screener is a dynamic search and filter tool for the selection and analysis of open-ended funds.
disqus-id: /labs/fund-screener/
categories: []
---
##Motivation

Screeners are commonly used in research, to allow users to sift through the large number of financial instruments that there may be in a particular domain. Scott Logic has developed screeners for several of our investment banking clients. This demo illustrates screening for UK closed funds.

The fund screener is an example of Scott Logic's innovative application of visualisation research to the financial domain, being based on [Elastic Lists](http://moritz.stefaner.eu/projects/elastic-lists/). The application is implemented entirely in HTML and JavaScript to provide a small download footprint and seamless integration with other web content.

##Overview

The Fund Screener is a dynamic filtering tool intended to facilitate the selection and analysis of funds. It is based around an adaptation of Moritz Stefaner's Elastic Lists concept, implemented entirely in HTML and JavaScript.

![Fund Screener]({{ site.github.url }}/labs/assets/fund_screener.png)

The fundamental concept behind Elastic Lists is that the filter criteria always reflect the current result set; whenever selections are made, all the criteria update to reflect the new result set. Each criterion is divided into categories. The count on the right-hand side of each category shows how many funds fall into that category. Furthermore the size of a category represents the proportion of funds that fall in a category, so that distributions across categories become immediately apparent.

Another way in which the current result set is reflected in the filter criteria is through category shading. Categories can be anywhere from a dark grey to white, with lighter shades indicating that the category contains a higher proportion of funds in the result set compared to the complete set of funds. For example, if 10% of all funds have a 5-star rating but 50% of the funds in the Corporate Bonds sector have a 5-star rating, then the 5-star rating category would be very light when the Corporate Bonds filter is selected, to indicate that a Corporate Bonds fund is more likely to have a 5-star rating than a randomly selected fund.

As well as providing a powerful filtering mechanism, the shading aspect of the Elastic Lists concept enables some higher level analysis of the fund market. As explained above, category shading can be used to indicate correlation between categories. For example, by selecting a particular sector or fund manager it might become apparent that funds in that selection tend to have a particular rating level, and the whiteness of that rating category will indicate how strong this tendency is.

Scott Logic has made two additions to the original Elastic Lists concept to tailor it to the financial domain and so to provide an even more useful tool for the user. Firstly, individual criteria can be added, reordered, and removed from the overall criteria set so that users can configure the tool to their own needs. Secondly users are able to create custom categories for numeric criteria by specifying appropriate value ranges.























