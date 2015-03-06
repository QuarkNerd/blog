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

  - -1,23,45,678.99
  - 12.345.678,99-
  - (12 345 678.99)
  - HEBREW
  
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

## Microsoft ASP.net Ajax (v2)

In the begining, Microsoft tried with ASP.net Ajax to simulate a .net winforms environment in JavaScript. This means that you had shimmed classes, inheritance and the javascript patterns mirrored the server. [They also did that with the globalisation](https://msdn.microsoft.com/en-us/library/bb386581%28v=vs.140%29.aspx), meaning you set the culture of the page when the server was rendering the html and the culture info was then serialised into the page and used by the JavaScript. This gave very good localisation and allowed web apps to have as good localisation support as windows.

I've been unable to find out whats happened to this code - I know Microsoft has allowed jQuery to use it as the basis for globalise (more on that later), but I can't find any references to it in modern versions of ASP.net.

# The Current

## momentjs

Two libraries that are very popular at the moment are the open source [momentjs](http://momentjs.com/) and [numeraljs](http://numeraljs.com/).

Moment came first and covers date-time manipulation, formatting and through a [plugin, timezones](http://momentjs.com/timezone/). It has a nice API, but for use in complex web applications it has a few issues:

 * The locales are user contributed, meaning there may be some missing and the data may not be perfect.
 * [It does not support other calendars](https://github.com/moment/moment/issues/1454)
 * The date formats are built into the locales, so unless you fork and edit the locales, you must keep your own date formats to [the ones moment supports](https://github.com/moment/moment/blob/develop/locale/en-gb.js#L20).
 * It doesn't support the [genitive form of the month name](http://stackoverflow.com/questions/19675155/what-is-difference-between-monthgenitivenames-and-monthnames-why-there-is-blank)
 
Regarding locale information, the alternative to having open source contributed locale information for each library is using [CLDR](http://cldr.unicode.org/) - a Unicode run database used by Microsoft, Apple, Google, IBM. Moment has an [issue to use this information](https://github.com/moment/moment/issues/1241) and there is a repo where someone has [made a start at converting between CLDR and momentjs](https://github.com/ichernev/moment-cldr), but currently neither seems to be getting much traction.

To elaborate on the problems for date formats - moment has its own code for date formats so that an app specifies `L` and this gets converted to a short date format. Its formats are:

 * LT   05:34
 * LTS  05:34:22
 * L    06/03/2015
 * LL   6 March 2015
 * LLL  6 March 2015 05:34
 * LLLL Friday, 6 March 2015 05:34

You can combine, so `LL LTS` gives you the same as `LL` but with seconds, however, notice there is no format for a 3 letter month name or a time with milli-seconds. This means that if you want formats not above, you have to create them yourself or else decide that cultures are not going to get a culture specific date format - just translations.

However it does have support for relative time (e.g. 3 minutes ago), which is a nice feature.

## numeraljs

numeraljs suffers from the same problem, it has user contributed locales and it doesn't support the breadth of configurations that you need. I found quite a few problems with it, [even just using it for locale in a few european countries](https://github.com/adamwdraper/Numeral-js/issues/created_by/lukeapage).

Other libraries? angular? dojo?

# The New

## jquery globalisation

# The Native

## Intl Support

## Polyfill for Intl

# The Problems

datepicker. number input.
