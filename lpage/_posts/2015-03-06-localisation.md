---
author: lpage
title: "State of localisation on the web"
featured-overlay-inverted: true
categories:
 - lpage
tags: 
layout: default_post
---

Localising a web application to a high standard is difficult. Why is that? Consider the following differently formatted numbers...

  -1,23,45,678.99
  12.345.678,99-
  (12 345 678.99)
  HEBREW
  
There are several differences between them 

  - the location and type of the negative sign - it can be brackets (though this is only the norm in smaller less supported cultures TODO), the - can be on either side and in addition it may or may not have a space between it and the number.
  - the grouping of the numbers - in most cultures it is every 3 characters, but in some(TODO) it is at the thousand marker, then hundred thousand, then 10 million etc.
  - Then you have the obvious difference between the group seperators and decimal seperator.
  - Lastly you get languages which do not represent numbers using the latin characters - and these might also be read right to left.
  
With datetimes you get a whole new set of problems

 - Do you allow language and locale to be set seperately or do you disallow e.g. french language to be used with american style dates.
 - How do you configure date formats for each locale and yet still be configurable for different parts of your app (e.g. date only, long date, with time, with time and seconds etc.)
 - Do you need to cope with other calendar systems?

# The Old

## Native

Natively, older browsers did not have any support for different number formats and the dates don't support changing the timezone- meaning that if you ever want a timezone that isn't the one the browser thinks the user is in currently, the timezone is useless.

# The Current

## Microsoft Ajax

## momentjs

## numeraljs

Other libraries? angular? dojo?

# The New

## jquery globalisation

# The Native

## Intl Support

## Polyfill for Intl

# The Problems

datepicker. number input.
