---
author: cprice
title: "ELK - 3 things I wish I'd known"
categories:
 - cprice
tags:
layout: default_post
suppress-careers-add: true
---

I’ve recently completed an ELK (Elasticsearch, Logstash & Kibana) real-time log processing implementation for an HTML5 FX trading platform. Along the way I’ve learnt a few things I wish I’d known beforehand. This post shares some more details of the project and hopefully some time saving tips.

#ELK

<img src="{{ site.baseurl }}/cprice/assets/ELKOverview.png" title="ELK Overview"/>

The ELK stack is made up of 3 components -

* Logstash - An agent which normally runs on each server you wish to harvest logs from. Its job is to read the logs (e.g. from the filesystem), normalise them (e.g. common timestamp format), optionally extract structured data from them (e.g. session IDs, resource paths, etc.) and finally push them into elasticsearch.

* Elasticsearch - A distributed indexed datastore which normally runs in a single cluster. It's job is to reliably store the incomming log data across the nodes in the cluster and to service queries from Kibana.

* Kibana - A browser-based interface served up from a web server. It's job is to allow you to build tabular and graphical visualisations of the log data based on elasticsearch queries. Typically these are based on simple text queries, time-ranges or even far more complex aggregations.

<img src="{{ site.baseurl }}/cprice/assets/Kibana4beta3.png" title="Kibana 4 beta 3 (taken from the release blog post)"/>

#A brief case study

The platform in question was a real-time FX trading system supporting 100s of concurrent client connections. Supporting this were 10s of multiply redundant services spread across 10s of Windows and Linux servers straddling a DMZ and internal network. As is typical of such systems, there were strict security policies governing communication between these services.

The existing system used a batch process to harvest the logs from all of the servers to a file share every 30mins. Alongside the huge latency, analysing these logs was a laborious and slow process. As a result, the logs were either overlooked as a valuable source of data and decisions were made based on subjective rather than objective measures.

The ELK implementation greatly simplified the aggregation and searching of data across these servers. Tracing problems across services or collecting metrics on bug fixes and infrastructure upgrades can all easily done in real-time through a simple web interface. It was found that log messages including correlation keys, for example session or transaction IDs were especially ripe for analysis.

Simple examples of this were unique session counts over time, live concurrent session lifecycle overiews and even breakdowns of the session load by service. A particularly valuable example was a real-time conversion rate of FX quotes, showing not only how many quotes were being requested over time but the ratio of those which were eventually traded.

<img src="{{ site.baseurl }}/cprice/assets/ELKSessionLifecycle.png" title="An example chart showing the concurrent session lifecyle overview in Kibana"/>

Over time the ELK stack will allow for the replacement of bespoke components, for example those collecting usage data for audit purposes. Using Kibana, these statistics are now easily made available in a real-time dashboard. Similarly, valuable business statistics which were previously judged too costly to extract from the logs can now be made available at a greatly reduced cost.

# 3 things I wish I’d known...

Now that the system is implemented it’s easy to forget some of the tricks I’ve learnt along the way. Here's my top 3 -

## Logstash 1.4.2 file input doesn’t work on Windows

The short version is that it can be painfully massaged to work but you’ll be much better off finding an alternative way of reading logs on Windows.

Wildcards don’t work. Well actually they do, you’ve just got to make sure you use the right syntax e.g. ```C:/folder/*``` or ```C:/**/log```. However, they still won’t really work…

To be useful, the file input plugin needs to store it’s current location in the file. It does this in a sincedb file (stored in ```%SINCEDB_PATH%/.sincedb_<MD5>```, ```%HOME%/.sincedb_<MD5>``` or the path specified). Within the file is a simple mapping of file identifier (major/minor device id and inode id) to byte offset. Unfortunately the implementation always returns an inode id of ```0``` on Windows. As you can no doubt imagine this causes a few problems if your wildcard matches more than one file.

The workaround is to specify each potential match of the wildcard as a separate file section each with its own unique ```sincedb_path```. Just specifying multiple paths doesn’t work because only one sincedb file will be created.

One final sting in the tail is the file locking. If your log appender attempts to rename the log file or anything of the sort then the lock retained by the plugin will prevent it from doing so with *fun* consequences. Not all log appenders have this behaviour so you might not suffer from this.

This is the sample snippet of a *working* configuration (with the above disclaimers) -

{% highlight ruby %}
  input {
  	file {
  		path => "c:/elk/logs/sample.log"
  		start_position => beginning
  		sincedb_path => "c:/elk/logs/sample.log.sincedb"
  	}
  	file {
  		path => "c:/elk/logs/error.log"
  		start_position => beginning
  		sincedb_path => "c:/elk/logs/error.log.sincedb"
  	}
  }
{% endhighlight %}
