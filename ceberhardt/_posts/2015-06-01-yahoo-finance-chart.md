---
author: ceberhardt
title: Creating a Yahoo Finance chart with D3 and d3fc
layout: default_post
---

<style>
iframe {
  border: 0;
}
</style>

Most charting libraries are monoliths. The more features they support, the more unwieldy their APIs tend to become. With the [d3fc](http://scottlogic.github.io/d3fc/) project we have been exploring an alternative approach, constructing charts from a set of small components, using the D3 library.

In this post I want to demonstrate the power of both d3fc and D3 by re-creating the [rather complex Yahoo Finance chart](http://finance.yahoo.com/echarts?s=yhoo+Interactive#{"showEma":true,"emaColors":"#cc0000","emaPeriods":"50","emaWidths":"1","emaGhosting":"0","range":"5d","allowChartStacking":true}). Creating a pixel-perfect recreation of this chart with any monolithic charting library would be a significant challenge (if not impossible). With d3fc it is surprisingly simple!

This post takes a step-by-step approach to recreating the Yahoo Finance chart.

## Rendering a simple chart

d3fc and its dependency are available via npm as detailed in the [installation instructions](https://github.com/ScottLogic/d3fc#installation).

d3fc creates charts using SVG, so the first step is to add an SVG element to the page:

{% highlight html %}
<svg id='time-series' style='height: 300px; width: 500px;'/>
{% endhighlight %}

The Yahoo Finance data is available as CSV data through an unsupported, [yet widely used](https://greenido.wordpress.com/2009/12/22/yahoo-finance-hidden-api/) API. D3 has a number of utility functions for fetching and parsing data, including CSV.

The following code performs an XHR request via `d3.csv`:

{% highlight js %}
d3.csv('yahoo.csv', function(error, data) {
  // convert timestamps from seconds-since-epoch to Date instances.
  data.forEach(function(d) {
    d.date = new Date(d.Timestamp * 1000);
  });

  renderChart(data);
});
{% endhighlight %}

Once the data has been fetched and parsed, the following `renderChart` function is called:

{% highlight js %}
function renderChart(data) {
  var chart = fc.chart.linearTimeSeries()
        .xDomain(fc.util.extent(data, 'date'))
        .yDomain(fc.util.extent(data, ['open', 'close']));

  var area = fc.series.area()
        .yValue(function(d) { return d.open; });

  chart.plotArea(area);

  d3.select('#time-series')
        .datum(data)
        .call(chart);
}
{% endhighlight %}

Looking at this code in detail, the first step constructs a `fc.chart.linearTimeSeries`. This is a relatively high-level d3fc component which renders a chart with a horizontal date axis and a vertical numeric axis. It's main responsibility is to construct an SVG layout that houses the various parts of the chart (axes, plot area, etc ...). The `fc.util.extent` utility function is used to compute the extents (max and min values) of various properties of the data.

Next a d3fc area series is constructed, where the `yValue` accessor property is used to select the `open` value from each datapoint. The default `xValue` accessor for most components expects a `date` property, which is the case in this example.

The chart's `plotArea` is set to the area series component, ensuring that the area series has the correct scales applied to it.

Finally, the SVG element is selected using `d3.select`, the data is bound, and the chart component called on the selection.

If you've already had some experience with D3, this construction pattern should be quite familiar to you. The d3fc components follow the [D3 component pattern](http://bost.ocks.org/mike/chart/).

The simple code above results in the following chart:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/8feaa6deaf7a5e276c49/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/8feaa6deaf7a5e276c49) via D3 bl.ocks.</small>

##Adding gridlines and line

Where other charting libraries might represent line, point and area as a single series type, d3fc prefers a 'micro component' approach where each are separate. For this chart an area and line component are required:

{% highlight js %}
var area = fc.series.area()
      .yValue(function(d) { return d.open; });

var line = fc.series.line()
      .yValue(function(d) { return d.open; });
{% endhighlight %}

Gridlines are another d3fc component:

{% highlight js %}
var gridlines = fc.annotation.gridline()
    .yTicks(5)
    .xTicks(0);
{% endhighlight %}

The chart plot area only accepts a single component, however multiple components (that have x and y scales) can be grouped together using a multi-series:

{% highlight js %}
var multi = fc.series.multi()
      .series([gridlines, area, line]);

chart.plotArea(multi);
{% endhighlight %}

The multi-series creates a containing `g` element for each of the supplied series, sets their x and y scales and propagates the data to each.

With gridlines, area and line series added, and some minor tweaks to the number of ticks, the chart looks like the following:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/5e4583d9177aaf348c39/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/5e4583d9177aaf348c39) via D3 bl.ocks.</small>


## Styling

d3fc components are styled via CSS. The easiest way to determine the suitable CSS selectors for styling a component is to just look at the rendered output.

The Yahoo chart has a subtle gradient which is applied to the line series. SVG gradients are (rather clumsily) defined in SVG as follows:

{% highlight html %}
<svg id='time-series' style='height: 300px; width: 500px;'>
  <defs>
    <linearGradient id="area-gradient"
                    x1="0%" y1="0%"
                    x2="0%" y2="100%">
      <stop offset="0%" stop-opacity="0.3" stop-color="#fff" />
      <stop offset="100%" stop-opacity="0" stop-color="#1a9af9" />
    </linearGradient>
  </defs>
</svg>
{% endhighlight %}

Notice that calling the `linearTimeSeries` component on the above SVG does not destroy the `defs` element. d3fc components are written in such as way that they identify their own elements via CSS class, allowing these elements to live alongside others within the same container.

With some simple CSS the gradient and line styles can be applied to the chart.

{% highlight css %}
<style>
path.area {
  fill: url(#area-gradient);
  fill-opacity: 1;
}

path.line {
  stroke: rgb(26, 154, 249);
}
</style>
{% endhighlight %}

Unfortunately it is not possible to re-position D3 axis labels via CSS. The only way to achieve this is to render the axis then use a D3 selection to locate the labels then move them directly:

{% highlight js %}
d3.selectAll('.y-axis text')
    .style('text-anchor', 'end')
    .attr('transform', 'translate(-3, -8)');

d3.selectAll('.x-axis text')
    .attr('dy', undefined)
    .style({'text-anchor': 'start', 'dominant-baseline': 'central'})
    .attr('transform', 'translate(3, -' + (xAxisHeight / 2 + 3) + ' )');
{% endhighlight %}

This is not ideal as the above code will be executed each time the charts is rendered, regardless of whether the axes require updates.


With this styling in place the chart looks like the following:

<iframe src='http://bl.ocks.org/ColinEberhardt/raw/b7584aa13ed53ab0cb0b/' width='100%' height='300px'></iframe>

<small>View the [full code for this example](http://bl.ocks.org/ColinEberhardt/b7584aa13ed53ab0cb0b) via D3 bl.ocks.</small>

# Adding a moving average

An EMA is an algorithm which is applied to the data ...

```
var movingAverage = fc.indicator.algorithm.exponentialMovingAverage()
      .value(function(d) { return d.close; })
      .windowSize(20);

movingAverage(data);
```

Default implementation mutates the data, but this can be configured.

An EMA line is just a line

```
var emaLine = fc.series.line()
  .yValue(function(d) { return d.exponentialMovingAverage; })
  .decorate(function(g) {
    g.enter().classed('ema', true);
  });
```

Decorate is passed the D3 selection / data-join allowing you to access the update / enter / exit selections.

# Adding a volume chart

We need to create a new scale with a range that occupies approximately half the plot area.
To do this, use the d3fc layout component to create anew `g` element to house the stuff ...

```
var volumeContainer = container.selectAll('g.volume')
      .data([data]);
volumeContainer.enter()
    .append('g')
    .attr({
        'class': 'volume',
    })
    .layout({
        position: 'absolute',
        top: 150,
        bottom: xAxisHeight,
        right: yAxisWidth,
        left: 0
    });

var layout = fc.layout();
d3.select('#time-series')
  .layout();
```

We are free to mix this in with the linear time series because the data-joins are 'scoped'.

Create a volume scale:

```
  var volumeScale = d3.scale.linear()
      .domain([0, d3.max(data, function (d) { return +d.volume; })])
      .range([volumeContainer.layout('height'), 0]);
```

  var volume = fc.series.bar()
        .xScale(chart.xScale())
        .yScale(volumeScale)
        .yValue(function(d) { return d.volume; });

  volumeContainer
      .datum(data)
      .call(volume);

```

# Coloring the volume bars

Just decorate

```
var volume = fc.series.bar()
        .xScale(chart.xScale())
        .yScale(volumeScale)
        .yValue(function(d) { return d.volume; })
        .decorate(function(sel) {
            sel.select('path')
                .style('stroke', function(d, i) {
                    return d.close > d.open ? 'red' : 'green';
                });
        });
```


