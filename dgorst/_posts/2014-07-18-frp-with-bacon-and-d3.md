---
author: dgorst
title: "Functional Reactive Programming with Bacon.js and D3"
categories: 
tags:

summary: "One of my colleagues, Sam Davies, recently gave a presentaion on functional reactive programming in iOS. This blog post takes the concepts introduced in that presentation and translates them into the Javascript world."
layout: default_post
---

One of my colleagues, Sam Davies, recently gave a presentaion on functional reactive programming in iOS (For those of you who are interested, a recording of the talk is available from the BrisTech YouTube channel, [here](https://www.youtube.com/watch?v=1-YhrLIyRXs).). The concepts introduced in that talk were very interesting, so I was inspired to investigate how you might go about implementing them in the Javascript world. This blog post describes the results of that investigation.

So what is functional reactive programming (FRP)? Reactive programming has been described as a paradigm orientated around data flows and the propagation of change. The aim of this concept is to make it easier to express dynamic data flows. As one part of your data model changes, that change should automatically propagate through your model, potentially changing other parts of it.

An example of this would be a modern spreadsheet program. Spreadsheet cells can contain both literal values, or formulas such as "=B1+C1" that are evaluated based on other cells. Whenever the value of the other cells change, the value of the formula is automatically updated.

Functional programming is a paradigm where computation in a program is treated as the evaluation of mathematical functions, and where state and mutable data are avoided. The output value of a function depends only on the arguments which are input to the function, so calling a function f twice with the same arguments will produce the same result f(x, y) both times. Javascript is a language suited to functional programming as it treats functions as first-class objects within the language.

So, now that we've introduced some of the core concepts, let's write some code!

## Reactive programming with Bacon.js

I've worked with the [Bacon.js](http://baconjs.github.io/) library for this blog post, but there are others available such as [Elm](http://elm-lang.org/) or [RxJS](https://github.com/Reactive-Extensions/RxJS). Feel free to try them out if you want to compare how they work. I picked Bacon.js as it was relatively simple to learn and powerful to use.

### Event streams

The first and probably the most important building block of FRP is the event stream. An event stream is a representation of a time-based series of discrete events. You could think of it as a channel that you subscribe to in order to be notified about events in your program. Events in the stream can happen at any time. Unlike traditional events (such as those provided by the browser or jQuery), the power of event streams is that they can be merged, filtered or transformed in any number of ways before you handle the events they convey.

So let's create our first event stream. I'm going to shamelessly borrow the idea used by Sam in his presentation, of listening to update events in Wikipedia. Sam has very kindly deployed a web socket to the Heroku dev center which publishes Wikipedia update events. We shall connect to this web socket, then build an event stream on top of it.

{% highlight javascript %}
// Create our websocket to get wiki updates
var ws = new WebSocket("ws://wiki-update-sockets.herokuapp.com/");
ws.onopen = function () {
    console.log("Connection opened");
};

ws.onclose = function () {
    console.log("Connection is closed...");
};

var updateStream = Bacon.fromEventTarget(ws, "message").map(function(event) {
    var dataString = event.data;
    return JSON.parse(dataString);
});
{% endhighlight %}

Let's look at the last part of that snippet more closely. First, we create an event stream for any messages which are sent from the web socket. When we receive a message event, we take the data string it contains and parse that into a JSON object (the string is a valid JSON string, we just need to convert it into an object to more easily access its properties). We do this using the *map* function, which takes an event stream and returns a new event stream, containing the transformed events rather than the original ones. Bacon.js provides us with several methods to create event streams, I would recommend taking a look at the [docs](https://github.com/baconjs/bacon.js#intro) for more information on the kind of things you can do.

### Filtering and sampling event streams

Now that we have a stream of update events from Wikipedia, let's look at pulling out the events which are of interest to us. The schema used for updates in Wikipedia isn't the clearest, but it seems that updates with type "unspecified" mainly refer to edits. Let's filter our event stream so that we just pull out edits.

{% highlight javascript %}
// Filter the update stream for unspecified events, which we're taking to mean edits in this case
var editStream = updateStream.filter(function(update) {
    return update.type === "unspecified";
});
editStream.onValue(function(results) {
    console.log(JSON.stringify(results));
});
{% endhighlight %}

To do this, we've used the *filter* method provided by Bacon. This takes in an event stream, and returns a filtered one which only emits events when the given predicate is satisfied. We use the *onValue* method to subscribe a handler function to the filtered stream. Any time we receive an edit event, we log it to the console. Not very exciting, but we'll get onto visualisations later!

Another type of event we can subscribe to is new user events. These have the type "newuser" within the Wikipedia schema. We do that in a very similar way.

{% highlight javascript %}
// Filter the update stream for newuser events
var newUserStream = updateStream.filter(function(update) {
    return update.type === "newuser";
});
newUserStream.onValue(function(results) {
    console.log(JSON.stringify(results));
});
{% endhighlight %}

Finally, we're going to collate some stats about the rate at which Wikipedia is being updated. We shall keep a count of the number of update events we receive, and we shall calculate how many updates we see every 5 seconds. This will allow us to come the rate of updates which are being made per second.

First we use the *scan* method provided by Bacon. This takes a seed value and an accumulator function, and results in a property. A property in Bacon is like an event stream, except that it also contains a current value, which is updated each time an event occurs. We shall use the *scan* method to keep a running count of the number of events we have received.

{% highlight javascript %}
var updateCount = updateStream.scan(0, function(value) {
    return ++value;
});
{% endhighlight %}

We shall sample this count every 5 seconds. Bacon provides a method, *sample*, which facilitates this.

{% highlight javascript %}
var sampledUpdates = updateCount.sample(5000);
{% endhighlight %}

Now that we are sampling the number of updates received every 5 seconds, we can calculate the number of updates received since the last sample, and hence the rate at which Wikipedia is being updated.

{% highlight javascript %}
var totalUpdatesBeforeLastSample = 0;
var updatesOverTime = [];
sampledUpdates.onValue(function(value) {
    updatesOverTime.push((value - totalUpdatesBeforeLastSample) / 5.0);
    console.log(updatesOverTime);
    totalUpdatesBeforeLastSample = value;
    return value;
});
{% endhighlight %}


{% highlight javascript %}
{% endhighlight %}

## Acknowledgements

A lot of the concepts in this post were new to me before I started writing it, so I made heavy use of other blogs and tutorials online while I was learning. Thanks go to:

- [Sean Voisen's introduction to FRP](http://sean.voisen.org/blog/2013/09/intro-to-functional-reactive-programming/)
- [The excellent docs available on the Bacon.js GitHub page](https://github.com/baconjs/bacon.js#intro)