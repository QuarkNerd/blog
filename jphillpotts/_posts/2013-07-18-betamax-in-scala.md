---
author: jphillpotts
title: Testing HTTP requests with Betamax in Scala
tags:
  - Scala
  - Web Services
  - Testing
categories:
  - jphillpotts
layout: default_post
source: site
summary: |
    [Betamax](http://freeside.co/betamax/) is a tool to help with testing applications 
    that consume web services by allowing the developer to record responses and then 
    replay them. In this post we look at how we can use it in Scala.
gistid: 6029082
---

I first saw [Betamax](http://freeside.co/betamax/) a couple of years ago when Rob 
Fletcher created it. More recently, I read about it being used with Scala in a 
[blog post by Rob Slifka at Sharethrough](http://www.sharethrough.com/2013/07/integration-testing-http-requests-with-scala-and-betamax/),
which got me thinking about how we might tidy up using it in various Scala test 
frameworks.

Betamax is originally written in Groovy, but as a JVM language, its compiled classes 
can be used with any application written in a JVM language. Its simplest use is in a 
[JUnit](http://junit.org/) test, or any test framework that supports features of the 
JUnit API, e.g. [Spock](https://code.google.com/p/spock/). However, for whatever reason, 
JUnit hasn't really gained as much traction in Scala as other test frameworks, with users 
often preferring to use [ScalaTest](http://www.scalatest.org/) or 
[specs2](http://etorreborre.github.io/specs2/).

# JUnit in Scala

Let's take a look at a simple Java example using JUnit first (ruthlessly pinched from the
Betamax homepage):

	import co.freeside.betamax.Betamax;
	import co.freeside.betamax.Recorder;
	import org.junit.*;
	
	public class MyTest {
	
	    @Rule public Recorder recorder = new Recorder();
	
	    @Betamax(tape="my tape")
	    @Test
	    public void testMethodThatAccessesExternalWebService() {
	      // test me
	    }
	}

What this is doing is registering a `Recorder` as a JUnit `@Rule` - this is a JUnit
feature that basically registers the instance as an object that's going to interact with
each test, in this case a `MethodRule` that interacts with each test, rather than the
class as a whole. JUnit will call the implemented `MethodRule.apply` method on the rule
object before each test is run. The Betamax recorder then checks the test method that is
about to be run to see whether it has a `@Betamax` annotation, and if so, handles the
test using the specified tape name.

Well that seems pretty simple, doesn't it, so let's try the same thing in a Scala JUnit
test (I'm using the [OpenWeatherMap API](http://openweathermap.org/API) as a simple XML
webservice - you can see the source 
[here](http://gist.github.com/{{ gistid }}#file-WeatherClient-scala)):

{% gist gistid WeatherTest.scala %}

At first glance, this seems simple enough - we can pack up and go home. Unfortunately,
when we try and run this test we get an error from JUnit saying that an object with a 
`@Rule` annotation must be public. Obviously there's something odd about the way Scala
processes annotations on a value (all values are public unless declared otherwise), or
the value itself, that JUnit's reflection can't pick it up. Fortunately, a change was
made in JUnit for this very problem, and we can instead annotate a function that returns
the value:

{% gist gistid annotated-function.scala %}

JUnit is happy with this, but when we run the test the Betamax recorder still doesn't
get used. It turns out this is because of a 
[bug](https://github.com/junit-team/junit/issues/589) with methods annotated with `@Rule`
that return a `MethodRule` - hopefully this will get fixed, and then JUnit + Betamax
should work fine.

# specs2

So now let's look at the library that Rob Slifka was having problems with - specs2. If
you read Rob's [blog post](http://www.sharethrough.com/2013/07/integration-testing-http-requests-with-scala-and-betamax/)
you'll remember that he had a test that is fetching JSON from Twitter:

	".apply" should {
	  "fetch and parse JSON from the Twitter endpoint" in {
	    val url = "http://www.buzzfeed.com/despicableme2/15-reasons-we-wish-we-were-steve-carell/"
	
	    var tw = Twitter(url)
	
	    tw.url    must_== url
	    tw.tweets must_== 29
	  }
	}
	
To use Betamax around his `var tw = Twitter(url)` he ended up with a helper class:

	def withTape(tapeName:String, functionUnderTest:() => Any) = {
	  synchronized {
	    val recorder = new Recorder
	    val proxyServer = new ProxyServer(recorder)
	
	    recorder.insertTape(tapeName)
	    proxyServer.start()
	
	    try {
	      functionUnderTest()
	    } finally {
	      recorder.ejectTape()
	      proxyServer.stop()
	    }
	  }
	}	

He could then use the helper in the middle of his test:

	var tw:Twitter = null
	BetamaxHelper.withTape("Twitter.apply", () => {
	  tw = Twitter(url)
	})

This works fine, but for me it's a bit distracting in the middle of the test to have
the `BetamaxHelper` getting involved. Also, using `null` in Scala is a bit of a code
smell if you ask me, so I thought I'd see if we could do it in a slightly tidier way.

Here's my simple specs2 test:

{% gist gistid WeatherSpec.scala %}

One thing to notice about specs2 tests is that there are no explicit function 
definitions, so there's nowhere to put our `@Betamax` annotation - I believe this was
the reason for Rob's findings in the last paragraph of *The Journey* in his blog. The
reason for there being no function to annotate is because, for the sake of 
readability, the tests are just created on construction by having an implicit 
function that turns your string into a test fragment and allows you to join it to
other fragments using functions like `should` and `in`. The test fragments are then
filtered and run after the class has been initialised (and your code has been stored
as a partially applied function for execution when needed). 

Looking through the [specs2 documentation](http://etorreborre.github.io/specs2/guide/org.specs2.guide.Structure.html#Around)
we discover that there's a trait for wrapping around a test specification, `Around`.
We can implement that to do the Betamax jiggery-pokery without interfering with the
readability of the test:

{% gist gistid Specs2Betamax.scala %}

We can then use this in our test spec:

{% gist gistid specs2-using-around.scala %}

I think this looks a bit tidier, and closer to the Betamax examples using annotations.
However, there is one small disadvantage of doing it this way - having the `Around`
implementation in the companion object with the body wrapped in a synchronized
statement means that tests can be run in parallel, but it means that the whole test
runs in parallel rather than just the section of the test that's actually doing the
HTTP request. For me, that's a price worth paying (at least you can still run all your
non-HTTP tests in parallel) in return for more readable tests, but I'll admit it's a
matter of personal preference.

# ScalaTest

Now onto our last test framework. Here's a simple ScalaTest test:

{% gist gistid SimpleWeatherSuite.scala %}

As with specs2, we see that ScalaTest has gone down a similar route of not using
explicit function definitions for defining tests, and instead using the `test`
function to allow a partially applied anonymous function that implements the test
to be stored against a test name string.

Unfortunately, I couldn't find any way to hook into the test specification. What I
would have liked is to be able to do something like:

	test("weather for london") with Betamax("tape name") {
	  assert(WeatherClient.weatherFor("london,gb").location === "London, GB")
	}

I just couldn't work out a way to get this to work - I'd be very happy for someone
to point me in the right direction. Anyway, instead I implemented a `Betamax` trait 
that allows me to use a `testWithBetamax` function:

{% gist gistid ScalaTestBetamax.scala %}

This allows us to use Betamax in our test as follows:

{% gist gistid WeatherSuite.scala %}

# Conclusion

So there we go, using Betamax to record and replay HTTP requests in Scala tests is
definitely possible, and without having to compromise much in the way of test
readability.

If you'd like the full source code that I worked on, it's available 
[on GitHub](https://github.com/mrpotes/betamax-scala).




















