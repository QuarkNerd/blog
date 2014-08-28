---
author: aaiken
title: "A Bollinger Bands Component for D3 Charts"
summary: "In my last article (on line annotation components for D3 charts), I created a D3 component which calculated and displayed a moving average. As promised, I'm now turning my attention to Bollinger Bands."
image: "aaiken/assets/featured/bollinger.png"
tags: 
  - d3
categories: 
  - aaiken
layout: default_post
---
In my last article (on [line annotation components](http://www.scottlogic.com/blog/2014/08/26/two-line-components-for-d3-charts.html) for D3 charts), I created a component which calculated and displayed a moving average. As promised, I'm now turning my attention to [Bollinger Bands](http://en.wikipedia.org/wiki/Bollinger_Bands).

The component I'm going to create is going to look like this:

<img src="{{ site.baseurl }}/aaiken/assets/bollinger.png"/>

As before, I'm going to cheat by taking the chart Tom's developed in his article on [OHLC and candlestick components](http://www.scottlogic.com/blog/2014/08/19/an-ohlc-chart-component-for-d3.html), and I'm creating the component following [Mike Bostock's convention](http://bost.ocks.org/mike/chart/).

## What are Bollinger Bands?

Glad you asked. In a nutshell, Bollinger Bands are used on financial charts to indicate price volatility. As you can see from the chart above, they consist of three components:

* A **moving average**
* An **upper band**
* A **lower band**

The upper and lower bands are some number of standard deviations away from the moving average - and note that here we're talking about a *moving* standard deviation. From this definition we can see that we need two parameters for our calculations - the **moving average period**, for which a value of 20 is typically used, and the **number of standard deviations**, which is typically 2.

## Bollinger Bands Component

Here's the complete code for the Bollinger Bands component - I'll go through it below and explain what's going on.

{% highlight javascript %}
sl.series.bollinger = function () {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var yValue = 0,
        movingAverage = 20,
        standardDeviations = 2;

    var cssBandArea = '',
        cssBandUpper = '',
        cssBandLower = '',
        cssAverage = '';

    var bollinger = function (selection) {

        var areaBands = d3.svg.area(),
            lineUpper = d3.svg.line(),
            lineLower = d3.svg.line(),
            lineAverage = d3.svg.line();

        areaBands.x(function (d) { return xScale(d.date); });
        lineUpper.x(function (d) { return xScale(d.date); });
        lineLower.x(function (d) { return xScale(d.date); });
        lineAverage.x(function (d) { return xScale(d.date); });

        var calculateMovingAverage = function (data, i) {

            var count = Math.min(movingAverage, i + 1),
                first = i + 1 - count;

            var sum = 0;
            for (var index = first; index <= i; ++index) {
                var x = data[index][yValue];
                sum += x;
            }

            return sum / count;
        };

        var calculateMovingStandardDeviation = function (data, i, avg) {

            var count = Math.min(movingAverage, i + 1),
                first = i + 1 - count;

            var sum = 0;
            for (var index = first; index <= i; ++index) {
                var x = data[index][yValue];
                var dx = x - avg;
                sum += (dx * dx);
            }

            var variance = sum / count;
            return Math.sqrt(variance);
        };

        var bollingerData = null;

        selection.each(function (data) {

            if (!bollingerData) {
                bollingerData = {};
                for (var index = 0; index < data.length; ++index) {
                    var date = data[index].date;
                    var avg = calculateMovingAverage(data, index);
                    var sd = calculateMovingStandardDeviation(data, index, avg);
                    bollingerData[date] = {avg: avg, sd: sd};
                }
            }

            if (!isNaN(parseFloat(yValue))) {

                areaBands.y(yScale(yValue));
                lineUpper.y(yScale(yValue));
                lineLower.y(yScale(yValue));
                lineAverage.y(yScale(yValue));
            }
            else {

                if (movingAverage === 0) {

                    areaBands.y(function (d) { return yScale(d[yValue]); });
                    lineUpper.y(function (d) { return yScale(d[yValue]); });
                    lineLower.y(function (d) { return yScale(d[yValue]); });
                    lineAverage.y(function (d) { return yScale(d[yValue]); });
                }
                else {

                    areaBands.y0(function (d, i) {

                        var avg = bollingerData[d.date].avg;
                        var sd = bollingerData[d.date].sd;

                        return yScale(avg + (sd * standardDeviations));
                    });

                    areaBands.y1(function (d, i) {

                        var avg = bollingerData[d.date].avg;
                        var sd = bollingerData[d.date].sd;

                        return yScale(avg - (sd * standardDeviations));
                    });

                    lineUpper.y(function (d, i) {

                        var avg = bollingerData[d.date].avg;
                        var sd = bollingerData[d.date].sd;

                        return yScale(avg + (sd * standardDeviations));
                    });

                    lineLower.y(function (d, i) {

                        var avg = bollingerData[d.date].avg;
                        var sd = bollingerData[d.date].sd;

                        return yScale(avg - (sd * standardDeviations));
                    });

                    lineAverage.y(function (d, i) {

                        var avg = bollingerData[d.date].avg;

                        return yScale(avg);
                    });
                }
            }

            var pathArea = d3.select(this).selectAll('.area')
                .data([data]);
            var pathUpper = d3.select(this).selectAll('.upper')
                .data([data]);
            var pathLower = d3.select(this).selectAll('.lower')
                .data([data]);
            var pathAverage = d3.select(this).selectAll('.average')
                .data([data]);

            pathArea.enter().append('path');
            pathUpper.enter().append('path');
            pathLower.enter().append('path');
            pathAverage.enter().append('path');

            pathArea.attr('d', areaBands)
                .classed('area', true)
                .classed(cssBandArea, true);
            pathUpper.attr('d', lineUpper)
                .classed('upper', true)
                .classed(cssBandUpper, true);
            pathLower.attr('d', lineLower)
                .classed('lower', true)
                .classed(cssBandLower, true);
            pathAverage.attr('d', lineAverage)
                .classed('average', true)
                .classed(cssAverage, true);

            pathArea.exit().remove();
            pathUpper.exit().remove();
            pathLower.exit().remove();
            pathAverage.exit().remove();
        });
    };

    bollinger.xScale = function (value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return bollinger;
    };

    bollinger.yScale = function (value) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = value;
        return bollinger;
    };

    bollinger.yValue = function (value) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = value;
        return bollinger;
    };

    bollinger.movingAverage = function (value) {
        if (!arguments.length) {
            return movingAverage;
        }
        movingAverage = value;
        return bollinger;
    };

    bollinger.standardDeviations = function (value) {
        if (!arguments.length) {
            return standardDeviations;
        }
        standardDeviations = value;
        return bollinger;
    };

    bollinger.cssBandUpper = function (value) {
        if (!arguments.length) {
            return cssBandUpper;
        }
        cssBandUpper = value;
        return bollinger;
    };

    bollinger.cssBandLower = function (value) {
        if (!arguments.length) {
            return cssBandLower;
        }
        cssBandLower = value;
        return bollinger;
    };

    bollinger.cssBandArea = function (value) {
        if (!arguments.length) {
            return cssBandArea;
        }
        cssBandArea = value;
        return bollinger;
    };

    bollinger.cssAverage = function (value) {
        if (!arguments.length) {
            return cssAverage;
        }
        cssAverage = value;
        return bollinger;
    };

    return bollinger;
};
{% endhighlight %}

That's a decent amount of code, so let's start at the top by looking at the properties I've defined on this component - you'll see that I've broken them down into sections so we don't have a monolithic block of declarations at the top of the file.

* First we have the X and Y scales, which the component needs when it's working out where to draw things.
* Next we have the fields we need to perform our calculations - the field to use on the data model, the moving average period, and the number of standard deviations to use. Note that we're defaulting the moving average period to 20 and the number of standard deviations to 2, the typical values for these fields.
* Finally we have a number of properties which define CSS classes for the various parts of the component. This provides the user with a lot of customisability when it comes to styling.

We then create a `d3.svg.area` to represent the area between the upper and lower bands, and three `d3.svg.line` objects to represent the upper band, lower band, and moving average line, setting their X-values appropriately. I'm using the area element because that's a really nice, built-in way to show the area between two lines. The best part is, it's really simple to use - where a line element requires you to set its Y-value, an area element has two Y-values - and I'm very much in favour of making life easy for myself.

The next section is where we do our heavy lifting - we define two functions to calculate the moving average and the moving standard deviation, and we declare an empty variable, `bollingerData`, which will hold the result of these calculations. Inside the `selection.each` block we populate this variable with data - it's a map of date to `avg` (moving average) and `sd` (standard deviation) for each data item. We do this once, which is massively more efficient than it would be if we did all these calculations on the fly! The remainder of the `selection.each` block is lengthy but pretty simple - we're just setting the Y-values for our area and line elements based on the data in the `bollingerData` map.

Finally we add the `areaBands`, `lineUpper`, `lineLower` and `lineAverage` SVG elements to the path.

## Adding the component to the chart

OK, that's the tricky bit out of the way, so now let's use this new Bollinger Bands component.

First we create and configure our component:

{% highlight javascript %}
var bollinger = sl.series.bollinger()
    .xScale(xScale)
    .yScale(yScale)
    .yValue('close')
    .movingAverage(20)
    .standardDeviations(2)
    .cssBandArea('bollingerBandArea')
    .cssBandUpper('bollingerBandUpper')
    .cssBandLower('bollingerBandLower')
    .cssAverage('bollingerAverage');
{% endhighlight %}

This looks like a lot, but really we're just telling the component about the X and Y scales, and telling it to use the 'close' property on the data model. The `movingAverage` and `standardDeviations` properties are optional (we're just setting them to their default values here, but you'd need to include them if you wanted anything non-standard), and the final four properties are just for styling purposes.

With that done, we add the component to the chart:

{% highlight javascript %}
plotArea.append('g')
    .attr('class', 'bollinger')
    .datum(data)
    .call(bollinger);
{% endhighlight %}

Pro tip: I'm putting this code just in front of the code to display the chart data itself, so that the Bollinger Bands will be in the background and the chart data will be in the foreground.

## Styling

Obviously, the last step is to style the various sections of the component.

{% highlight css %}
.chart .bollingerBandArea {
    fill: lightgrey;
    stroke-width: 0;
}

.chart .bollingerBandUpper {
    fill: none;
    stroke: darkgrey;
    stroke-width: 2;
}

.chart .bollingerBandLower {
    fill: none;
    stroke: darkgrey;
    stroke-width: 2;
}

.chart .bollingerAverage {
    fill: none;
    stroke: darkgrey;
    stroke-width: 1;
    stroke-dasharray: 4, 1;
}
{% endhighlight %}

I've chosen to display the Bollinger Bands in grey, so I'm using a light grey for the area between the upper and lower bands and a darker grey for the bands themselves (you could instead use transparency to make the area lighter).

As an aside, note that I've set `stroke-width: 0` on the area so that it doesn't show any borders. I've done this for two reasons. firstly, we're drawing over the top and bottom borders anyway, and secondly we don't want a left or right border to be shown - try removing this line and you'll see what I mean.

Putting it all together, this is the result:

<img src="{{ site.baseurl }}/aaiken/assets/bollinger.png"/>

## Enhancements

I'm pretty happy with this component - it works really well and it's quite efficient, programmatically. There are still a few enhancements we could do though. If you read through [the Wikipedia entry on Bollinger Bands](http://en.wikipedia.org/wiki/Bollinger_Bands) you'll see that we're using a simple moving average calculation, but that other types of calculation are sometimes used; we could extend our component to allow the user to choose by providing an additional property like `.movingAverageType('exponential')`.

## Conclusion

In this article I've taken the moving average component I developed in [my previous article](http://www.scottlogic.com/blog/2014/08/26/two-line-components-for-d3-charts.html) and used it as the basis for a Bollinger Bands component. The new component is very easy to configure and style.