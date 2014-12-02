var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Produce the data
// Default value is in dollars
var xdata = d3.range(0,6,0.05);
var ydata = xdata.map(function (d) {
    return Math.cos(d) + Math.random()*0.1;
});
var dataset = d3.transpose([xdata, ydata]);

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var dollars_to_euros_conversion = function (d) {
    return d * 0.5;
};

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

var mouseover = function () {
    d3.select("#lolline")
      .style("opacity", "1");
};

var mouseout = function () {
    d3.select("#lolline")
      .style("opacity", "0.3");
};



//var clicky = function () {
    //if clicked == 0
        //d3.select(this)
          //.style("opacity", "1")
          //.clicked -> 1
    //else
        //d3.select(this)
          //.style("opacity", "0.3")
          //.clicked -> 0
//}
//How to select all elements of a class


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var changeLabel = function () {
    selection = d3.select(this);

    if (d3.select(this.parentNode).attr("units") === "dollars") {
        selection.text("Price euros");
        d3.select(this.parentNode).attr("units", "euros");
        y.domain(d3.extent(dataset,
                           function(d) {return dollars_to_euros_conversion(d[1]); }));
        d3.select(this.parentNode)
            .call(yAxis);

    } else {
        selection.text("Price dollars");
        d3.select(this.parentNode).attr("units", "dollars");
        y.domain(d3.extent(dataset, function(d) {return d[1];}));
        d3.select(this.parentNode)
          .call(yAxis);
    }
};

  x.domain(d3.extent(dataset, function(d) { return d[0]; }));
  y.domain(d3.extent(dataset, function(d) { return d[1]; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
     .attr("class", "axis")
     .attr("units", "dollars") // default units are dollars
     .call(yAxis)
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", -margin.left/2 - 3)
     .attr("x", -height/2)
     .style("text-anchor", "middle")
     .text("Price ($)")
     .on("click", changeLabel);

      //.on("mouseover", mouseover)
      //.on("mouseout", mouseout)
      //.on("click", clicky);

// Line have to be drawn twice to give them a bigger clickable area
  svg.append("path")
      .datum(dataset)
      .attr("class", "line")
      .attr("d", line)
      .attr("id", "lolline")
      .style("opacity", "0.3")
      .style("stroke", "steelblue");

  svg.append("path")
      .datum(dataset)
      .attr("class", "line")
      .attr("d", line)
      .style("opacity", "0.0")
      .style("stroke-width", "25px")
      .style("stroke", "black")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

