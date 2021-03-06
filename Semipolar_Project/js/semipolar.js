// Generated by CoffeeScript 1.8.0
(function() {
  var FinalPlot, LinePlot, SemiPolar, plot;

  SemiPolar = (function() {
    function SemiPolar(radius, cx, cy, id) {
      this.radius = radius;
      this.cx = cx;
      this.cy = cy;
      this.n_r_ticks = 4;
      this.n_ang_ticks = 6;
      this.id = id;
    }

    SemiPolar.prototype.plot_grid = function() {
      var arc, ga, gr, line, r, radius, svg;
      radius = this.radius;
      svg = d3.select('#' + this.id).append("g").attr("class", "semipolar_grid").attr("transform", "translate(" + this.cx + "," + this.cy + ")");
      r = d3.scale.linear().domain([0, 1]).range([0, this.radius]);
      arc = d3.svg.arc().startAngle(Math.PI / 2).endAngle(-Math.PI / 2).innerRadius(0).outerRadius(function(d) {
        return r(d);
      });
      line = d3.svg.line.radial().radius(function(d) {
        return r(d[1]);
      }).angle(function(d) {
        return d[0];
      });
      gr = svg.append("g").attr("class", "r axis").selectAll("g").data(r.ticks(this.n_r_ticks).slice(1)).enter().append("g");
      gr.append("path").attr("d", arc).style("fill", "none").style("stroke", "rgb(85, 85, 85)").style("stroke-dasharray", "3, 3").style("stroke-width", "1px").style("shape-rendering", "none");
      svg.append("path").attr("d", arc(1)).style("stroke", "rgb(45, 45, 45)").style("fill", "none").style("stroke-width", "1px").style("shape-rendering", "none");
      ga = svg.append("g").attr("class", "a axis").selectAll("g").data([-3, -2, -1, 0, 1, 2, 3].map(function(d) {
        return d * 30;
      })).enter().append("g").attr("transform", function(d) {
        var ang;
        ang = d - 90;
        return "rotate(" + ang + ")";
      });
      ga.append("line").attr("x2", this.radius).style("stroke", "rgb(85, 85, 85)").style("stroke-dasharray", "3, 3").style("stroke-width", "1px").style("shape-rendering", "none");
      ga.append("text").attr("x", this.radius + 6).attr("dx", ".35em").attr("dy", ".35em").style("text-anchor", "middle").attr("transform", function(d) {
        var r_aux, turn;
        turn = 90;
        r_aux = radius + 10;
        return "rotate(" + turn + ", " + r_aux + ",0)";
      }).text(function(d) {
        return Math.abs(d) + "°";
      });
      return svg.append("path").attr("id", this.id + '_' + "polar_path").datum(this.generate_data()).attr("class", "line").attr("d", line).style("stroke", "red").style("stroke-width", "2px").style("fill", "none");
    };

    SemiPolar.prototype.generate_data = function() {
      var angle, r2;
      angle = d3.range(-Math.PI / 2, Math.PI / 2, Math.PI / 101);
      r2 = angle.map(function(d) {
        return Math.abs(Math.sin(d));
      });
      return d3.transpose([angle, r2]);
    };

    return SemiPolar;

  })();

  LinePlot = (function() {
    function LinePlot(h, w, x, y, polar_radius, id) {
      this.h = h;
      this.w = w;
      this.x = x;
      this.y = y;
      this.polar_radius = polar_radius;
      this.n_x_ticks = 4;
      this.n_y_ticks = 4;
      this.id = id;
      this.data = this.generate_data();
    }

    LinePlot.prototype.plot_line = function() {
      var data, id, line, svg, xAxis, xScale, yAxis, yScale;
      id = this.id;
      svg = d3.select('#' + id).append("g").attr("class", "line_plot").attr("transform", "translate(" + this.x + "," + this.y + ")");
      data = this.data;
      xScale = d3.scale.linear().domain(d3.extent(data.x)).range([0, this.w]);
      yScale = d3.scale.linear().domain(d3.extent(data.y)).range([this.h, 0]);
      line = d3.svg.line().x(function(d) {
        return xScale(d[0]);
      }).y(function(d) {
        return yScale(d[1]);
      });
      svg.append("path").datum(d3.transpose([data.x, data.y])).attr("d", line).style("opacity", "1").style("stroke", "steelblue").style("stroke-width", "2.5px").style("fill", "none");
      xAxis = d3.svg.axis().scale(xScale).ticks(4).orient("bottom");
      yAxis = d3.svg.axis().scale(yScale).ticks(4).orient("left");
      svg.append("g").attr("class", "axisX").attr("transform", "translate(" + 0 + "," + 0 + ")").call(yAxis);
      svg.append("g").attr("class", "axisY").attr("transform", "translate(" + 0 + "," + this.h + ")").call(xAxis);
      svg.append("rect").attr("class", "click_surface").attr("x", this.x).attr("y", this.y).attr("width", this.w).attr("height", this.h).style("fill", "none").style("fill", "rgba(0,0,0,0)");
      return this.plot_cursor(svg);
    };

    LinePlot.prototype.plot_cursor = function(svg) {
      var cr, cursor;
      cursor = svg.append("g").attr("id", this.id + "_cursor");
      cursor.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 8).style("fill", "lawngreen");
      cr = cursor.append("text").attr("y", this.h - 100).attr("text-anchor", "left").attr("font-family", "sans-serif").attr("font-size", "41px").attr("font-weight", "bold").attr("fill", "black");
      cr.append("tspan").attr("x", this.w + 130).attr("id", this.id + "_line_1_span").text("hola");
      cr.append("tspan").attr("x", this.w + 130).attr("id", this.id + "_line_2_span").attr("dy", 40).text("hola");
      return cursor;
    };

    LinePlot.prototype.generate_data = function() {
      var xPoints, yPoints;
      xPoints = d3.range(0, 6, 0.01);
      yPoints = xPoints.map(function(d) {
        return Math.cos(d) + 0.3 * Math.cos(2 * d) + 0.4 * Math.cos(3 * d);
      });
      return this.data = {
        x: xPoints,
        y: yPoints
      };
    };

    return LinePlot;

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
      this.id = "fantastic_id";
    }

    FinalPlot.prototype.plot = function() {
      var extX, format_nums, grid, h, id, line, line_data, line_x_pos, line_y_pos, lineplot_h, lineplot_w, n_x_points, polar_line, polar_radius, polar_x_pos, polar_y_pos, rScale, sc, svg, w, xScale, xfigScale, yScale, yfigScale;
      id = this.id;
      w = this.width - this.margin.left - this.margin.right;
      h = this.height - this.margin.top - this.margin.bottom;
      xfigScale = d3.scale.linear().domain([0, 1]).range([0, w]);
      yfigScale = d3.scale.linear().domain([0, 1]).range([0, h]);
      svg = d3.select("body").append("svg").attr("width", this.width).attr("height", this.height).append("g").attr("id", id).attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      polar_x_pos = xfigScale(0.75);
      polar_y_pos = yfigScale(0.5);
      polar_radius = xfigScale(0.15);
      line_x_pos = xfigScale(0);
      line_y_pos = yfigScale(0);
      lineplot_w = xfigScale(0.55);
      lineplot_h = yfigScale(1);
      grid = new SemiPolar(polar_radius, polar_x_pos, polar_y_pos, id);
      grid.plot_grid();
      line = new LinePlot(lineplot_h, lineplot_w, line_x_pos, line_y_pos, polar_radius, id);
      line.plot_line();
      line_data = line.data;
      xScale = d3.scale.linear().domain(d3.extent(line_data.x)).range([0, lineplot_w]);
      extX = d3.extent(line_data.x);
      yScale = d3.scale.linear().domain(d3.extent(line_data.y)).range([lineplot_h, 0]);
      n_x_points = line_data.x.length;
      format_nums = d3.format(".4n");
      rScale = d3.scale.linear().domain([0, 1]).range([0, polar_radius]);
      polar_line = d3.svg.line.radial().radius(function(d) {
        return rScale(d[1]);
      }).angle(function(d) {
        return d[0];
      });
      return sc = d3.select('#' + id).select(".line_plot").select(".click_surface").on("mousemove", function() {
        var cursor, cursor_id, idx, mousePos, new_angle, new_r, path_id, r, x_pos;
        mousePos = d3.mouse(this);
        cursor_id = '#' + id + "_cursor";
        cursor = d3.select(cursor_id);
        x_pos = xScale.invert(mousePos[0]);
        r = (x_pos - extX[0]) / (extX[1] - extX[0]);
        idx = Math.floor(r * n_x_points);
        cursor.select("circle").attr("cx", xScale(line_data.x[idx])).attr("cy", yScale(line_data.y[idx]));
        cursor.select('#' + id + "_line_1_span").text("η: " + format_nums(line_data.x[idx]));
        cursor.select('#' + id + "_line_2_span").text("Fp: " + format_nums(line_data.y[idx]));
        new_angle = d3.range(-Math.PI / 2, Math.PI / 2, Math.PI / 101);
        new_r = new_angle.map(function(d) {
          return Math.sin(d + xScale.invert(mousePos[0]));
        });
        path_id = '#' + id + "_polar_path";
        return d3.select(path_id).datum(d3.transpose([new_angle, new_r])).attr("class", "line").attr("d", polar_line);
      });
    };

    return FinalPlot;

  })();

  plot = new FinalPlot;

  plot.plot();

}).call(this);
