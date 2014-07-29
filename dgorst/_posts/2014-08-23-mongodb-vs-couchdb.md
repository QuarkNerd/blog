---
author: dgorst
title: "MongoDB vs CouchDB"
categories: 
tags:

summary: "As part of a project I'm working on, I have a requirement for a NoSQL database. There are numerous offerings out there, of which MongoDB and CouchDB appear to be the most popular. So which system should I choose?"
layout: default_post
---
As part of a project I'm working on, I have a requirement for a NoSQL database. There are numerous offerings out there, of which [MongoDB](http://www.mongodb.org/) and [CouchDB](http://couchdb.apache.org/) appear to be the most popular. So which system should I choose?

First, a little more information about my use case. I am part of a team who will be sending a balloon up into near-space (If you're interested, you can find out about us on our [Wordpress page](http://projectlatex.wordpress.com/)). As it is in flight, the balloon will be sending telemetry information via radio back down to a ground station. Once we receive the data at the ground station, we shall store it in a database of some kind. The decoded data is not going to be particularly relational, hence why a NoSQL database seems like a good way of storing it. It will be handled as Javascript objects so either MongoDB or CouchDB would seem to be a fairly good fit, given that they work by storing JSON documents.

A few years ago, Nathan Hurst wrote a [blog post giving a visual guide to NoSQL systems](http://blog.nahurst.com/visual-guide-to-nosql-systems). I've shown the image from that blog post below.

<img src="{{ site.baseurl }}/dgorst/assets/mongodb-vs-couchdb/nosql-triangle.png"/>

As you can see, there are three primary concerns you must balance when choosing a data management system: consistency, availability, and partition tolerance.
* __Consistency__ means that each client always has the same view of the data.
* __Availability__ means that all clients can always read and write.
* __Partition tolerance__ means that the system works well across physical network partitions.

My use case is likely to only involve a single database node and I'm not expecting a particularly high rate of inserts or queries on the database. With these relatively flexible constraints, I would expect that either MongoDB or CouchDB would be able to meet my use case without any problems. In the rest of this post I'll look at how easy both systems were to use and I'll make my decision based on that. 

In your project, you are likely to be storing a larger amount of data and dealing with higher database traffic, so the CAP triangle shown above will be more relevant to you.

##The data to be stored

The snippet below shows an example of the type of telemetry information which we'll be storing.

{% highlight javascript %}
{ payload_name: '$$icarus',
  sentence_id: '724',
  time: '12:19:07',
  latitude: '52.071851',
  longitude: '0.253108',
  altitude: '27539',
  speed: '36.11',
  heading: '113.8',
  temp_internal: '17.7',
  temp_external: '-18.7' }
{% endhighlight %}

We'll be receiving data every few seconds. In this blog post, we'll be running a database server locally and our client code will be running in Node.js. In the next couple of sections, we'll look at how to store the data and how to make the kind of queries which we are likely to make on it. Let's look at MongoDB first.

##MongoDB

Once you've installed MongoDB, you can get the server up and running by calling **mongod** from the command line. Once the database server is up, we're in a position to add data to it and make queries on it. In this post, I'll run two separate Node.js processes. One will insert new data into the database when it becomes available, and the other will make queries on the database. To use MongoDB directly from Javascript, rather than using the Mongo shell, it is helpful to install a 3rd party module to do the translation from your business logic to the database layer. I've used [Mongoose](http://mongoosejs.com/index.html) in this work, but alternatives are available such as the [Monk](https://github.com/LearnBoost/monk) module.

Mongoose requires you to define a schema for your data. This is actually a departure from vanilla MongoDB, which doesn't require data in a collection to have a common schema. This will match my use case though, so it's no big deal in this case. I've created a module which defines the schema I'll be using and called it *telemetryDb.js*.

{% highlight javascript %}
'use strict';

var mongoose = require('mongoose');

module.exports = {
    url: 'mongodb://localhost/telemetryDb',
    telemetrySchema: function() {
        return new mongoose.Schema({
            payload_name: String, 
            sentence_id: String, 
            time: String,
            latitude: Number,
            longitude: Number,
            altitude: Number,
            speed: Number,
            heading: Number,
            temp_internal: Number,
            temp_external: Number
        });
    },
    telemetryModelClass: function() {
        return mongoose.model('TelemetryInfo', this.telemetrySchema());
    }
};
{% endhighlight %}

As well as defining the schema, we declare the URL to the database and a model class which is based on the schema. Mongoose uses this model to create new documents and to query the database.

###Writing to the database

Now let's add documents to the database when new telemetry data is received. In our Node app which is receiving the telemetry data, let's add a dependency on Mongoose and our schema module.

{% highlight javascript %}
var mongoose = require('mongoose');
var telemetryDb = require('./telemetryDb');
{% endhighlight %}

We can now create and open a connection to the database. We declare the model class as well - we'll use that to create new telemetry documents later on.

{% highlight javascript %}
var db = mongoose.connection;
mongoose.connect(telemetryDb.url);

db.on('error', console.error);
db.once('open', function() {
});

var TelemetryDbModel = telemetryDb.telemetryModelClass();
{% endhighlight %}

Now, every time we receive new telemetry information, we can write it to the datbase.

{% highlight javascript %}
// telemetryInfo is the Javascript object containing our new data.
// We create a Mongoose model object from it, then save that to 
// the database
var dbTelemetryInfo = new TelemetryDbModel(telemetryInfo);
    dbTelemetryInfo.save(function(err, dbTelemetryInfo) {
      if (err) {
          return console.error(err);
      }
      // We log to the console, just to show what we've saved
      console.log(dbTelemetryInfo);
    });
{% endhighlight %}

###Querying the database

In a seperate process, we'll query the data. In a real-world app we'd probably want to see a snapshot of the latest data, and we might want to display a graph of historical data, such as altitude over time. Let's write some queries to get this information. First, let's create and open a connection to the database.

{% highlight javascript %}
'use strict';

var mongoose = require('mongoose');
var telemetryDb = require('./telemetryDb');

var db = mongoose.connection;
mongoose.connect(telemetryDb.url);

db.on('error', console.error);
db.once('open', function() {
});

var TelemetryDbModel = telemetryDb.telemetryModelClass();
{% endhighlight %}

Now let's write our queries. First we'll want to get the latest data value. MongoDB provides a rich query interface which allows you to specify query criteria, projections, sort orders and limits. Mongoose provides a nice interface on top of this, which allows you to build up a query via their *QueryBuilder* interface.

{% highlight javascript %}
TelemetryDbModel
.find()
.sort('-time')
.limit(1)
.exec(function(err, data) {
    if (err) return console.error(err);
    console.log(data);
});
{% endhighlight %}

As you can see, we used the Mongoose model class we created earlier to build up our query on the data. We specify that we want to sort data in descending time, and we're only interested in the first result (the one with the latest time). Once the query has executed, we log it to the console. As well as the latest snapshot of the data, let's get the historical altitude values. In this case, we sort the data into ascending chronological order and select just the time and altitude fields.

{% highlight javascript %}
TelemetryDbModel
.find()
.sort('time')
.select('time altitude')
.exec(function(err, data) {
    if (err) return console.error(err);
    console.log(data);
});
{% endhighlight %}

Great, so now we have a system where we're saving telemetry information to the database when we receive it, and we're able to query it in order to display the information. I like the query interface that MongoDB offers, and the QueryBuilder interface which Mongoose builds on top of this also seems very powerful. Now that we have a working system with MongoDB, let's take a look at how to implement the same functionality in CouchDB.

## Acknowledgements
