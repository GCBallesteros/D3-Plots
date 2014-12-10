// Generated by CoffeeScript 1.8.0
(function() {
  var Controls, FinalPlot, LinePlot, plot;

  LinePlot = (function() {
    function LinePlot(x, y, w, h, id) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.id = id;
    }

    LinePlot.prototype.plot_line = function(eq_param) {
      var data, line, svg, xAxis, xScale, yAxis, yScale;
      svg = d3.select('#' + this.id).append("g").attr("id", "line_" + this.id).attr("class", "eqn_plot").attr("transform", "translate(" + this.x + "," + this.y + ")");
      data = this.generate_data(eq_param);
      xScale = d3.scale.linear().domain(d3.extent(data.x)).range([0, this.w]);
      yScale = d3.scale.linear().domain(d3.extent(data.y)).range([this.h, 0]);
      line = d3.svg.line().x(function(d) {
        return xScale(d[0]);
      }).y(function(d) {
        return yScale(d[1]);
      });
      xAxis = d3.svg.axis().scale(xScale).ticks(4).orient("bottom");
      yAxis = d3.svg.axis().scale(yScale).ticks(4).orient("left");
      svg.append("g").attr("class", "axisX").attr("transform", "translate(" + 0 + "," + 0 + ")").call(yAxis);
      svg.append("g").attr("class", "axisY").attr("transform", "translate(" + 0 + "," + this.h + ")").call(xAxis);
      return svg.append("path").attr("class", "linePlot").datum(d3.transpose([data.x, data.y])).attr("d", line).style("opacity", "1").style("stroke", "steelblue").style("stroke-width", "2.5px").style("fill", "none");
    };

    LinePlot.prototype.update_line = function(eq_param) {
      var data, line, svg, xAxis, xScale, yAxis, yScale;
      svg = d3.select('#line_' + this.id);
      data = this.generate_data(eq_param);
      xScale = d3.scale.linear().domain(d3.extent(data.x)).range([0, this.w]);
      yScale = d3.scale.linear().domain(d3.extent(data.y)).range([this.h, 0]);
      line = d3.svg.line().x(function(d) {
        return xScale(d[0]);
      }).y(function(d) {
        return yScale(d[1]);
      });
      xAxis = d3.svg.axis().scale(xScale).ticks(4).orient("bottom");
      yAxis = d3.svg.axis().scale(yScale).ticks(4).orient("left");
      svg.select(".axisX").call(yAxis);
      svg.select(".axisY").call(xAxis);
      return svg.selectAll(".linePlot").datum(d3.transpose([data.x, data.y])).attr("d", line).style("opacity", "1").style("stroke", "steelblue").style("stroke-width", "2.5px").style("fill", "none");
    };

    LinePlot.prototype.generate_data = function(params) {
      var data, xPoints, yPoints;
      xPoints = d3.range(0, 2 * Math.PI, 0.1);
      yPoints = xPoints.map(function(d) {
        return params.amp * Math.cos(d + Number(params.phase));
      });
      return data = {
        x: xPoints,
        y: yPoints
      };
    };

    return LinePlot;

  })();

  Controls = (function() {
    function Controls(id, ctrs) {
      this.id = id;
      this.ctrs = ctrs;
    }

    Controls.prototype.plot = function() {
      var control, id, sel, _i, _len, _ref, _results;
      id = this.id;
      sel = d3.select("#" + id).select(function() {
        return this.parentNode;
      }).select(function() {
        return this.parentNode;
      }).append("div").attr("class", "controls").style("margin-left", "1300px").style("margin-top", "-420px");
      _ref = this.ctrs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        control = _ref[_i];
        _results.push((function() {
          return sel.append("p").text(control.name).style("font-family", "sans-serif").append("p").append("input").attr("id", "control_" + control.name + "_" + id).attr("type", "range").attr("min", control.min).attr("max", control.max).attr("step", 0.2);
        })());
      }
      return _results;
    };

    return Controls;

  })();

  FinalPlot = (function() {
    function FinalPlot() {
      this.width = 1200;
      this.height = 470;
      this.margin = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
      };
      this.id = "wavy";
    }

    FinalPlot.prototype.plot = function() {
      var controls, ctrs, eq_param, h, id, line_h, line_plot, line_w, line_x, line_y, svg, w, xfigScale, yfigScale;
      id = this.id;
      w = this.width - this.margin.left - this.margin.right;
      h = this.height - this.margin.top - this.margin.bottom;
      xfigScale = d3.scale.linear().domain([0, 1]).range([0, w]);
      yfigScale = d3.scale.linear().domain([0, 1]).range([0, h]);
      svg = d3.select("body").append("div").append("svg").attr("width", this.width).attr("height", this.height).append("g").attr("id", id).attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      line_x = xfigScale(0);
      line_y = yfigScale(0);
      line_w = xfigScale(1);
      line_h = yfigScale(1);
      line_plot = new LinePlot(line_x, line_y, line_w, line_h, id);
      eq_param = {
        amp: 1,
        phase: 1.2
      };
      line_plot.plot_line(eq_param);
      ctrs = [
        {
          name: "phase",
          min: 0,
          max: Math.PI
        }, {
          name: "amp",
          min: 1,
          max: 2
        }
      ];
      controls = new Controls(id, ctrs);
      controls.plot();
      d3.select("#control_" + "phase" + "_" + id).on("input", function() {
        eq_param.phase = this.value;
        return line_plot.update_line(eq_param);
      });
      return d3.select("#control_" + "amp" + "_" + id).on("input", function() {
        eq_param.amp = this.value;
        return line_plot.update_line(eq_param);
      });
    };

    return FinalPlot;

  })();

  plot = new FinalPlot;

  plot.plot();

}).call(this);
