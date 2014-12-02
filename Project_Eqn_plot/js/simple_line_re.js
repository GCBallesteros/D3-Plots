// to this thing we want to pass it
// data structure, set of xaxis labels
// {x,y}axis labels are [{label: string, conv_func: func}]
// TODO
// add multiaxes support
// make all of them clickable
// Add support to indicate position

function chart() {
    var width = 500,   //default width
        height = 300,  //default height
        margin = {top: 20, right: 20, bottom: 30, left: 80};
        default_colors = colorbrewer.Set2[8];


    function plot() {
        w = width - margin.left - margin.right;
        h = height - margin.top - margin.bottom;

        // Generate data for plot
        var datase = plot.generate_data();
        var dataset = datase[0].data;

        // Prepare scaling functions
        var xScale = d3.scale.linear()
                       //.domain(d3.extent(dataset,function(d) { return d[0]; }))
                       .range([0, width]);

            yScale = d3.scale.linear()
                       //.domain(d3.extent(dataset,function(d) { return d[1]; }))
                       .range([height, 0]);

        // Find maximum and minimum in all dataset
        var minmaxX = datase.map(function (d) {
                                return d3.extent(d.data,
                                              function(v) { return v[0]; });});

        xScale.domain(d3.extent([].concat.apply([],minmaxX)));

        var minmaxY = datase.map(function (d) {
                                return d3.extent(d.data,
                                              function(v) { return v[1]; });});

        yScale.domain(d3.extent([].concat.apply([],minmaxY)));

        // Define Axis
        var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom");

        var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left");

        // Function to generate lines
        var line = d3.svg.line()
              .x(function (d) { return xScale(d[0]); })
              .y(function (d) { return yScale(d[1]); });
        var line2 = d3.svg.line()
              .x(function (d) { return xScale(d[0]); })
              .y(function (d) { return yScale(d[1]); });

        var svg = d3.select("body").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                           "translate(" + margin.left + "," + margin.top + ")");

        // Set the axis
        svg.append("g")
           .attr("class", "axis")
           .attr("units", "s")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("units", "dollars")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left/2 - 3)
            .attr("x", -height/2)
            .style("text-anchor", "middle")
            .text("Price ($)");


         //I want to be able to pass to this function a datastructure
         //[{label: string, data: data}]
        for (var i = 0, len = datase.length; i < len; i++) {
            var curr_line = datase[i];

            // Assign default colors and opacity if not given
            //var line_color = "steelblue",
            var line_color = default_colors[i % 8];

                opacity = 1;
            if ( curr_line.hasOwnProperty('stroke') ) {
                line_color = curr_line.stroke;
            }

            if ( curr_line.hasOwnProperty('opacity') ) {
                opacity = curr_line.opacity;
            }

            
            svg.append("path")
               .datum(curr_line.data)
               .attr("class", "line")
               .attr("d", line)
               .style("opacity", opacity)
               .style("stroke", line_color);
        }
    };

    // Getter and setters for plots
    plot.width  = function (val) {
        if (!arguments.length) return width;
        width = val;
        return plot;
    }

    plot.height  = function (val) {
        if (!arguments.length) return height;
        height = val;
        return plot;
    }

    // Auxiliary functions
    plot.generate_data = function () {
        var xdata = d3.range(0, 6, 0.01),
            ydata2 = xdata.map(function (d) {return Math.sin(d);}),
            ydata = xdata.map(function (d) {
        return Math.cos(d) + Math.random()*0.01;
        });
        return [{label: "Cos", data: d3.transpose([xdata, ydata]), opacity: 0.5},
                {label: "Sin", data: d3.transpose([xdata, ydata2])}];
    }

    return plot;
};

line_plot = chart();
line_plot();
