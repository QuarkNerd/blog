---
author: lpage
title: "Six More JavaScript 'Features'"
featured-overlay-inverted: true
categories:
 - lpage
tags: 
layout: default_post
summary: A look at some of the more unusual parts of JavaScript by examining six things I've learnt recently.
---

Over the last couple of months I've made a few enhancements to JSHint, mainly as a way of learning ES6
(I'm [most proud](https://github.com/lukeapage/jshint/commit/08eb4e25962eb71f94c09f79b3b08288b91a7bce) of re-implementing
variable scope detection) and during that process I've come across a few things that surprised me, mostly about ES6
but also about a ES3 feature I've never used, which is where I will start.

## Break from any block

You should be aware that you can break and continue from any loop - it is a fairly standard programming language conflict.
You might not be aware that you can label loops and jump out of any particular loop...

{% highlight js %}
outer: for(var i = 0; i < 4; i++) {
    while(true) {
        continue outer;
    }
}
{% endhighlight %}

The same applies to both break and continue. You will have definitely seen break used with switch statements...

{% highlight js %}
switch(i) {
   case 1:
       break;
}
{% endhighlight %}

Incidentally, this is why Crockford suggests your case should not be indented - the break jumps out of the switch, not the case, but I prefer the readability of indenting cases.
You can also label switch statements...

{% highlight js %}
myswitch: switch(i) {
   case 1:
       break myswitch;
}
{% endhighlight %}

Another thing you can do is create arbitrary blocks (I know you can do this in C#, I expect other languages too).

{% highlight js %}
{
  {
      console.log("I'm in an abritrary block");
  }
}
{% endhighlight %}

So, we can put this together and label and break from abritrary blocks.

{% highlight js %}
outer: {
  inner: {
      if (true) {
        break outer;
      }
  }
  console.log("I will never be executed");
}
{% endhighlight %}

Note that this only applies to break - you can only continuea loop block.
I've never seen labels being used in JavaScript and I wondered why - I think its because if I need to break two layers
of blocks, its a good sign that the block might be more readable inside a function and there I will use a single break
or an early return to achieve the same thing.

However, if I wanted to write code that had a single return in every function, which is not to my taste, then I could use block breaking. E.g. Take this multiple return function...

{% highlight js %}
function(a, b, c) {
  if (a) {
     if (b) {
       return true;
     }
     doSomething();
     if (c) {
       return c;
     }
  }
  return b;
}
{% endhighlight %}

and use labels...

{% highlight js %}
function(a, b, c) {
  var returnValue = b;
  myBlock: if (a) {
     if (b) {
       returnValue = true;
       break myBlock;
     }
     doSomething();
     if (c) {
       returnValue = c;
     }
  }
  return returnValue;
}
{% endhighlight %}

The alternative being more blocks...

{% highlight js %}
function(a, b, c) {
  var returnValue = b;
  if (a) {
     if (b) {
       returnValue = true;
     } else {
       doSomething();
       if (c) {
         returnValue = c;
       }
    }
  }
  return returnValue;
}
{% endhighlight %}

I prefer the original, then using elses and then block labels - but maybe its because thats what I'm used to?

## Destructuring an existing variable

## `class` is block scoped

## Same name parameters

## Template literal ad-infinitum

## Destructuring with numbers

## `typeof` is not safe
