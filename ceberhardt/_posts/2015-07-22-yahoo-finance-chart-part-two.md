---
author: ceberhardt
title: Creating a Yahoo Finance chart with D3 and d3fc - Part Two
title-short: Charting with D3 and d3fc
layout: default_post
summary: "Most charting libraries are monoliths. The more features they support, the more unwieldy their APIs tend to become. With the d3fc project we have been exploring an alternative approach, constructing charts from a set of small components, using the D3 library."
summary-short: This post explores the d3fc component approach to building charts by re-implementing a complex Yahoo Finance chart.
image: ceberhardt/assets/featured/yahoo.png
categories:
  - D3
  - Charting
---


<style>
iframe {
  border: 0;
}
</style>

Most charting libraries are monoliths. The more features they support, the more unwieldy their APIs tend to become. With the [d3fc](http://scottlogic.github.io/d3fc/) project we have been exploring an alternative approach, constructing charts from a set of small components, that complement the popular D3 library.

In this two-part blog series I want to demonstrate the power of both d3fc and D3 by re-creating the [rather complex Yahoo Finance chart](http://finance.yahoo.com/echarts?s=yhoo+Interactive#{"showEma":true,"emaColors":"#cc0000","emaPeriods":"50","emaWidths":"1","emaGhosting":"0","range":"5d","allowChartStacking":true}).

<img src="{{ site.github.url }}/ceberhardt/assets/yahoo-finance.png" />

Creating a pixel-perfect recreation of this chart with any monolithic charting library would be a significant challenge (if not impossible). With d3fc it is surprisingly simple!

This post picks up [from where the first left off](http://blog.scottlogic.com/2015/07/08/yahoo-finance-chart.html), an area series with an exponential moving average, (EMA) together with an overlayed volume series:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/b46affe9af05aec55c67/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/b46affe9af05aec55c67) via D3 bl.ocks.</small>

This post completed the example by adding a legend, line annotations, crosshairs and a discontinuous date axis.

## Line annotations

Financial charts are often rendered with line annotations that indicate the current price of the instrument (e.g. a share) being charted. d3fc has a `fc.annotation.line` component that can be used to render horizontal or vertical lines and is ideal for this purpose.

In order to render a line annotation you need to supply a `value` accessor function and a `label` function which is used to set the annotation text:

{% highlight js %}
var lastClose = fc.annotation.line()
    .value(function(d) { return d.close; })
    .label(function(d) { return priceFormat(d.close); })
    .decorate(function(sel) {
      sel.enter().classed('close', true);
    });
{% endhighlight %}

The above code also uses `decorate` in order to add a class to the annotation 'container' element. The chart has a couple of these annotations, one for last-close and one for the last EMA value, this class helps style the two independently. The EMA annotation is much the same as the above, it just has uses a different datapoint property in the `value` accessor function.

Annotations can also be added to a chart via the multi-series component, however if you simply add it to the array of series this will result in an annotation being created for every single datapoint in the dataset!

In this case, the annotation data should be the last point in the series. This can be achieved by adding a `mapping` function to the multi-series:

{% highlight js %}
var multi = fc.series.multi()
      .series([gridlines, area, emaLine, line, emaClose, lastClose])
      .mapping(function(series) {
          switch (series) {
            case emaClose:
            case lastClose:
              return [data[data.length - 1]];
            default:
              return data;
          }
      });
{% endhighlight %}

With this in place, the annotations are now rendered:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/8f0fe81842c8e579818e/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/8f0fe81842c8e579818e) via D3 bl.ocks.</small>

## Line annotation customisation

If you refer back to the Yahoo Finance chart that this d3fc implementation is trying to mimic you will see that the annotation on the above chart look nothing like the original! The Yahoo annotations don't render a line, this is easily hidden in the above chart by CSS, however more challenging is the 'callouts' that indicate the annotation value. Within the Yahoo chart these are rendered as a pointer within the Y axis:

<img src="{{ site.github.url }}/ceberhardt/assets/yahoo-finance-annotation.png" />

Once again, 'decorate' comes to the rescue!

Because both the EMA and last close annotations need to be modified, this can be moved to a separate `addCallout` function which is invoked within `decorate`, passing the selection:

{% highlight js %}
var emaClose = fc.annotation.line()
  .value( ... )
  .label( ... )
  .decorate(function(sel) {
    addCallout(sel);
    sel.enter().classed('ema', true);
  });
{% endhighlight %}

The `addCallout` function needs to do a couple of things, firstly it needs to add a path to render the pointer, inserting this before the annotations `text` element so that it is rendered behind, secondly it needs to reposition the `text` element so that it is located within the y-axis.

The d3fc components have been designed with extensibility in mind, the line annotation has 'container' elements at either end, making it easy to add elements at either location.

The `addCallout` function below adds a path within the `right-handle` container, and moves the `text` element that has already been created by the line annotation:

{% highlight js %}
function addCallout(sel) {
    sel.enter()
        .select('.right-handle')
        .classed('callout', true)
        .insert('path', ':first-child')
        .attr('transform', 'translate(' + calloutLeftMargin + ', 0)')
        .attr('d', d3.svg.area()(calloutPathData(calloutWidth, calloutHeight)));

    sel.select('text')
        .attr('transform', 'translate(' + yAxisWidth + ', ' + (calloutHeight / 4) + ')')
        .attr('x', 0)
        .attr('y', 0);
}
{% endhighlight %}

The data for the SVG path is supplied by the following function:

{% highlight js %}
function calloutPathData(width, height) {
    var h2 = height / 2;
    return [
        [0, 0],
        [h2, -h2],
        [width, -h2],
        [width, h2],
        [h2, h2],
        [0, 0]
    ];
}
{% endhighlight %}

With the above code in place, and a little bit of CSS, the annotations now look exactly the same as those found on the Yahoo Finance chart:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/6999683652a81fa01e24/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/6999683652a81fa01e24) via D3 bl.ocks.</small>

## Adding a Legend

The legend for this chart displays the various properties (high, low, open, close, volume) of the last datapoint in the series. When the crosshair is visible (which will be added shortly), it is instead used to render the values for the datapoint which the crosshair is highlighting.

d3fc has a legend component which is rendered as a HTML table. The following code adds a container for the legend:

{% highlight html %}
<div id="legend"></div>
{% endhighlight %}

The code below creates the legend component and renders it:

{% highlight js %}
var legend = fc.chart.legend()
    .items([
        ['open', function(d) { return priceFormat(d.open); }],
        ['high', function(d) { return priceFormat(d.high); }],
        ['low', function(d) { return priceFormat(d.low); }],
        ['close', function(d) { return priceFormat(d.close); }],
        ['volume', function(d) { return volumeFormat(d.volume); }]
    ]);

function renderLegend(datapoint) {
    d3.select('#legend')
        .datum(datapoint)
        .call(legend);
}
{% endhighlight %}

The legend is configured via the `items` property where the legend rows are supplied as an array of tuples. In this case the first value in each tuple is a string literal and the second is a function of the datapoint, however these can be interchanged. The legend also supports decoration of each row.

Finally the legend is rendered by calling the above function with the last series datapoint:

{% highlight js %}
renderLegend(data[data.length - 1]);
{% endhighlight %}

This results in the following chart:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/d5e883c07afd33a08deb/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/d5e883c07afd33a08deb) via D3 bl.ocks.</small>

## Crosshairs

So far the relationship between the d3fc components and the data they render has been pretty straightforward; an array of datapoints is supplied to each component (or in the case of annotations the last datapoint), and each renders themselves based on this data. These components do not modify the source data, they are instead a transformation of the data. This provides a clear separation between the model (the array of data) and the view (the components and the SVG they construct).

Crosshairs are a little different, the current crosshair location belongs in the model, however the model state is something which the view needs to be able to mutate.

With d3fc the crosshair is supplied with an empty array which it populates with a datapoint when the cursor enters the chart, updates as the cursor moves and removes from the array when the cursor exits the chart.

A convenient location to store the crosshair data is as a property on the `data` array:

{% highlight js %}
data.crosshair = [];
{% endhighlight %}

The crosshair component for this example is show below:

{% highlight js %}
var crosshair = fc.tool.crosshair()
    .snap(fc.util.seriesPointSnapXOnly(line, data))
    .xLabel(function(d) { return dateFormat(d.datum.date); })
    .yLabel(function(d) { return priceFormat(d.datum.close); })
    .decorate(function(sel) {
        // reduce the radius of the circle created by the crosshair
        sel.enter().select('circle').attr('r', 3);
        addCallout(sel);
        addXCallout(sel);
    })
    .on('trackingmove', function(crosshairData) {
        renderLegend(crosshairData[0].datum);
    })
    .on('trackingend', function() {
        renderLegend(data[data.length - 1]);
    });
{% endhighlight %}

The `snap` and two label properties define the snapping behaviour and the X and Y value labels. The crosshair is implemented using a pair of line annotations, so the `addCallout` function can be re-used to match the Yahoo Finance styling. Finally, a couple of event handlers are added to ensure that the legend renders the crosshair datapoint whilst tracking.

The crosshair is added via the multi-series, with the `mapping` function providing the crosshair with its data:

{% highlight js %}
var multi = fc.series.multi()
    .series([gridlines, area, emaLine, line, emaClose, lastClose, crosshair])
    .mapping(function(series) {
        switch (series) {
          case emaClose:
          case lastClose:
            return [data[data.length - 1]];
          case crosshair:
            return data.crosshair;
          default:
            return data;
        }
    });
{% endhighlight %}

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/25999b42b6da077a0ef3/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/25999b42b6da077a0ef3) via D3 bl.ocks.</small>

## Intraday data

One significant difference between this example and the Yahoo Finance chart is the data. This example is using end-of-day data, meaning that there is a datapoint for each day, whereas the Yahoo chart is using intraday data, which shows how the price changes over a single day of trading activity.

By grabbing a copy of the json data used by the Yahoo Finance chart, it was possible to update this example to use a similar dataset. Although this reveals a pretty obvious problem:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/8daad554be70d3bba7b3/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/8daad554be70d3bba7b3) via D3 bl.ocks.</small>

Exchanges only trade within certain hours, for the London Stock Exchange this is from 8:00-16:30 during weekdays, although a small amount of activity does occur out-of-hours. This explains the big gaps in data in the above chart.

The d3fc date scale supports the concepts of 'discontinuities', which allow the specification of gaps in an otherwise continuous scale. These discontinuities are supplied to the scale via a provider and the d3fc library contains an example provider that skips weekends `fc.scale.discontinuity.skipWeekends`.

For this chart a more complex discontinuity provider is required, which determines the visible time range for each day based on the trading activity itself.

This is a relatively complex task and I'm not going to discuss the implementation in detail, if you're interested, [go and take a look!](https://gist.github.com/ColinEberhardt/1c2b4916fc13bbb7e99b#file-tradedhours-js).

This discontinuity provider depends on the series data:

{% highlight js %}
var discontinuity = fc.scale.discontinuity.tradedHours()
    .trades(data.map(function(d) { return d.date; }));
{% endhighlight %}

And is supplied to the x-axis as follows:

{% highlight js %}
var chart = fc.chart.linearTimeSeries()
      .xDomain( ... )
      .xDiscontinuityProvider(discontinuity)
      ...
{% endhighlight %}

With this discontinuity provider in place, the gaps between the days are removed:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/1c2b4916fc13bbb7e99b/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/1c2b4916fc13bbb7e99b) via D3 bl.ocks.</small>

## Out of hours bands

The final feature that needs to be added to this chart is the light grey vertical bands that indicate the out-of-hours trading activity.

The custom discontinuity provider that removes non-trading hours conveniently exposes the trading hours for each day within the dataset, so becomes a suitable source of data. d3fc has a band annotation component with properties that define the x and y range. Any values that are omitted are set to match the range of the associated scale.

With a bit of data transformation, the band annotation can be defined as follows:

{% highlight js %}
var verticalBands = fc.annotation.band()
    .x0(function(d) { return d[0][2].date; })
    .x1(function(d) { return d[1][1].date; });
{% endhighlight %}

Once again, this component is added to the multi-series and a suitable mapping applied to supply the correct data source. The chart also has vertical line annotations within 'icons' added via their decorate function.

Putting these together completes this example:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/875bb098218a94cad7f5/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/875bb098218a94cad7f5) via D3 bl.ocks.</small>

## Conclusions

This has been a bit of an epic two-part series, slowly building up the chart step-by-step. Personally I am very happy with the end result, a chart that is a faithful (almost pixel-perfect) recreation of the Yahoo Finance chart.

I think it is also a great demonstration of the approach we have adopted with d3fc, the lightweight components, which expose their datajoin via the `decorate` function is a very versatile way to assemble a chart. This example is roughly 300 lines of code, I think it would be a significant challenge to achieve the same with any other charting libraries!

If you are interested in finding out more about d3fc, pop over to the website, [d3fc.io](http://d3fc.io), its currently in its infancy, but we are very pleased with what has been achieved so far and are looking to grow it.

Regards, Colin E.
