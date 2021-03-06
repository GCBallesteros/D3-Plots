// Generated by CoffeeScript 1.8.0
(function() {
  var heatmap, pl1,
    __modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  heatmap = (function() {
    function heatmap() {
      this.width = 1420;
      this.height = 920;
      this.margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      };
      this.xPoints = d3.range(0, 2 * Math.PI, 0.10);
      this.yPoints = d3.range(0, 2 * Math.PI, 0.10);
      this.nx = this.xPoints.length;
      this.ny = this.yPoints.length;
      this.data = heatmap.prototype.generate_data(this.xPoints, this.yPoints);
      this.minZ = this.data.min;
      this.maxZ = this.data.max;
      this.zHeight = this.data.z;
    }

    heatmap.prototype.main_plot = function() {
      var b_subplot, central_plot, cursor_element, h, h_b_subplot, scales, svg, w, w_b_subplot, xHeatMap, xScale_x_pos, xScale_y_pos, xSizeHeatMap, x_b_subplot, xfigScale, yHeatMap, yScale_x_pos, yScale_y_pos, ySizeHeatMap, y_b_subplot, yfigScale;
      w = this.width - this.margin.left - this.margin.right;
      h = this.height - this.margin.top - this.margin.bottom;
      svg = d3.select("body").append("svg").attr("width", w + this.margin.left + this.margin.right).attr("height", h + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      xfigScale = d3.scale.linear().domain([0, 1]).range([0, w]);
      yfigScale = d3.scale.linear().domain([0, 1]).range([0, h]);
      xHeatMap = xfigScale(0.3);
      yHeatMap = yfigScale(0);
      xSizeHeatMap = xfigScale(0.7);
      ySizeHeatMap = yfigScale(0.7);
      central_plot = svg.append("g").attr("class", "HeatMap").style("cursor", "none").attr("transform", "translate(" + xHeatMap + "," + yHeatMap + ")");
      this.heatmap_plot(central_plot, xSizeHeatMap, ySizeHeatMap);
      scales = svg.append("g").attr("class", "scales");
      xScale_y_pos = yfigScale(0.75);
      xScale_x_pos = xHeatMap;
      yScale_x_pos = xHeatMap - xfigScale(0.03);
      yScale_y_pos = yHeatMap;
      this.scales_plot(scales, xSizeHeatMap, ySizeHeatMap, xScale_x_pos, xScale_y_pos, yScale_x_pos, yScale_y_pos);
      cursor_element = svg.append("g").attr("id", "cursor").attr("transform", "translate(" + xHeatMap + "," + yHeatMap + ")");
      this.cursor_plot(cursor_element, xSizeHeatMap, ySizeHeatMap, yScale_x_pos - xHeatMap, xScale_y_pos);
      x_b_subplot = xHeatMap;
      y_b_subplot = yfigScale(0.8);
      w_b_subplot = xSizeHeatMap;
      h_b_subplot = yfigScale(0.2);
      b_subplot = svg.append("g").attr("class", "line_plot").style("cursor", "none").attr("transform", "translate(" + x_b_subplot + "," + y_b_subplot + ")");
      this.bottom_subplot(b_subplot, w_b_subplot, h_b_subplot);
      this.bottom_subplot_axis(b_subplot, h_b_subplot, 0, 0);
      return void 0;
    };

    heatmap.prototype.func = function(vx, vy) {
      return Math.cos(2 * vx) * Math.cos(vy);
    };

    heatmap.prototype.idx2row = function(idx) {
      return __modulo(idx, 13);
    };

    heatmap.prototype.idx2col = function(idx) {
      return Math.floor(idx / this.nx);
    };

    heatmap.prototype.flatten = function(ar) {
      return [].concat.apply([], ar.valueOf());
    };

    heatmap.prototype.generate_data = function(x, y) {
      var i, j, maxZ, minZ, new_val, vx, vy, zHeight, _i, _j, _len, _len1;
      zHeight = math.zeros(y.length, x.length);
      minZ = this.func(x[0], y[0]);
      maxZ = this.func(x[0], y[0]);
      for (j = _i = 0, _len = y.length; _i < _len; j = ++_i) {
        vy = y[j];
        for (i = _j = 0, _len1 = x.length; _j < _len1; i = ++_j) {
          vx = x[i];
          new_val = this.func(vx, vy);
          zHeight.valueOf()[j][i] = new_val;
          if (new_val > maxZ) {
            maxZ = new_val;
          }
          if (new_val < minZ) {
            minZ = new_val;
          }
        }
      }
      return {
        z: zHeight,
        min: minZ,
        max: maxZ
      };
    };

    heatmap.prototype.colourScale = function(domain, colors) {
      var cScale, deltaColor, extD, nColors;
      nColors = colors.length;
      deltaColor = 1 / (nColors - 1);
      extD = d3.extent(domain);
      cScale = function(d) {
        var c, color_end, color_start, cout, idx, r, _i;
        r = (extD[1] - d) / (extD[1] - extD[0]);
        idx = Math.floor(r * (nColors - 1));
        if (idx >= nColors - 1) {
          idx = nColors - 2;
        }
        r = (r - idx * deltaColor) * (nColors - 1);
        color_start = colors[idx];
        color_end = colors[idx + 1];
        cout = "rgb(";
        for (c = _i = 0; _i <= 2; c = ++_i) {
          cout = cout + Math.floor(color_start[c] + r * (color_end[c] - color_start[c])) + ",";
        }
        cout = cout.slice(0, cout.length - 1) + ")";
        return cout;
      };
      return cScale;
    };

    heatmap.prototype.heatmap_plot = function(svg, w, h) {
      var color_brewer, dy, extX, extY, format_nums, height_tile, height_tile_px, idx2col, idx2row, line, nx, width_tile, width_tile_px, xPoints, xScale, yPoints, yScale, zHeight, zScale, zScale_lower;
      xPoints = this.xPoints;
      yPoints = this.yPoints;
      dy = yPoints[1] - yPoints[0];
      extX = d3.extent(xPoints);
      extY = d3.extent(yPoints);
      width_tile = (extX[1] - extX[0]) / (this.nx - 1);
      height_tile = (extY[1] - extY[0]) / (this.ny - 1);
      xScale = d3.scale.linear().range([0, w]);
      yScale = d3.scale.linear().range([h, 0]);
      xScale.domain([extX[0] - width_tile / 2, extX[1] + width_tile / 2]);
      yScale.domain([extY[0] - height_tile / 2, extY[1] + height_tile / 2]);
      color_brewer = [[33, 102, 172], [67, 147, 195], [146, 197, 222], [209, 229, 240], [247, 247, 247], [253, 219, 199], [244, 165, 130], [214, 96, 77], [178, 24, 43]];
      zScale = heatmap.prototype.colourScale([this.minZ, this.maxZ], color_brewer);
      width_tile_px = xScale(width_tile) - xScale(0);
      height_tile_px = yScale(0) - yScale(height_tile);
      nx = this.nx;
      idx2row = function(i) {
        return __modulo(i, nx);
      };
      idx2col = function(i) {
        return Math.floor(i / nx);
      };
      zScale_lower = d3.scale.linear().domain([this.minZ, this.maxZ]).range([190, 0]);
      line = d3.svg.line().x(function(d) {
        return xScale(d[0]);
      }).y(function(d) {
        return zScale_lower(d[1]);
      });
      format_nums = d3.format(".4n");
      zHeight = this.zHeight.valueOf();
      return svg.append("g").attr("class", "tiling").selectAll(".tile").data(heatmap.prototype.flatten(this.zHeight)).enter().append("rect").attr("class", "tile").attr("x", function(d, i) {
        return xScale(xPoints[idx2row(i)] - width_tile / 2);
      }).attr("y", function(d, i) {
        return yScale(yPoints[idx2col(i)] + height_tile / 2);
      }).attr("width", width_tile_px).attr("height", height_tile_px).style("fill", function(d) {
        return zScale(d);
      }).style("stroke", function(d) {
        return zScale(d);
      }).style("stroke-width", "1px").on("mousemove", function() {
        var cursor, idx, lower_plot, mousePos, new_line_vals, real_y;
        mousePos = d3.mouse(this);
        cursor = d3.select("#cursor").style("display", "inline");
        cursor.select(".xLine").attr("x1", mousePos[0]).attr("y1", mousePos[1]).attr("y2", mousePos[1]);
        cursor.select(".yLine").attr("y1", mousePos[1]).attr("x1", mousePos[0]).attr("x2", mousePos[0]);
        cursor.select(".xPos").attr("x", mousePos[0]).text(format_nums(xScale.invert(mousePos[0])));
        cursor.select(".yPos").attr("y", mousePos[1]).text(format_nums(xScale.invert(mousePos[1])));
        cursor.select(".xMarker").attr("x", mousePos[0]);
        cursor.select(".yMarker").attr("y", mousePos[1]);
        lower_plot = d3.select("#lower_subline");
        real_y = yScale.invert(mousePos[1]);
        idx = Math.floor((real_y - extY[0]) / dy + 0.5);
        if (lower_plot.attr("idxY") !== idx.toString()) {
          new_line_vals = d3.transpose([xPoints, zHeight[idx]]);
          lower_plot.datum(new_line_vals).attr("d", line).attr("idxY", idx);
          console.log(lower_plot.attr("idxY"));
          return console.log(idx);
        }
      });
    };

    heatmap.prototype.cursor_plot = function(svg, w, h, x, y) {
      var cursor, marker_h, marker_w;
      cursor = svg.style("display", "none").style("cursor", "none");
      marker_h = 40;
      marker_w = 3;
      cursor.append("line").attr("class", "xLine").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 1).style("stroke", "rgb(40,40,40)").style("stroke-dasharray", "3, 3").style("stroke-width", "1px");
      cursor.append("text").attr("class", "yPos").attr("transform", "translate(" + 5 + "," + -marker_w * 2 + ")").attr("x", x).attr("y", 0).attr("text-anchor", "left").attr("font-family", "sans-serif").attr("font-size", "11px").attr("font-weight", "bold").attr("fill", "black");
      cursor.append("text").attr("class", "xPos").attr("transform", "translate(" + 5 + "," + -marker_h / 2 + ")").attr("x", 0).attr("y", y).attr("text-anchor", "left").attr("font-family", "sans-serif").attr("font-size", "11px").attr("font-weight", "bold").attr("fill", "black");
      cursor.append("line").attr("class", "yLine").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", h).style("stroke", "rgb(40,40,40)").style("stroke-dasharray", "3, 3").style("stroke-width", "1px");
      cursor.append("rect").attr("class", "xMarker").attr("width", marker_w).attr("height", marker_h).attr("transform", "translate(" + -marker_w / 2 + "," + -marker_h / 2 + ")").attr("x", 0).attr("y", y).style("fill", "black");
      return cursor.append("rect").attr("class", "yMarker").attr("width", marker_h).attr("height", marker_w).attr("transform", "translate(" + -marker_h / 2 + "," + -marker_w / 2 + ")").attr("x", x).attr("y", 0).style("fill", "black");
    };

    heatmap.prototype.scales_plot = function(svg, w, h, x_xScale, y_xScale, x_yScale, y_yScale) {
      var extX, extY, height_tile, width_tile, xAxis, xScale, yAxis, yScale;
      extX = d3.extent(this.xPoints);
      extY = d3.extent(this.yPoints);
      width_tile = (extX[1] - extX[0]) / (this.nx - 1);
      height_tile = (extY[1] - extY[0]) / (this.ny - 1);
      xScale = d3.scale.linear().range([0, w]);
      yScale = d3.scale.linear().range([h, 0]);
      xScale.domain([extX[0] - width_tile / 2, extX[1] + width_tile / 2]);
      yScale.domain([extY[0] - height_tile / 2, extY[1] + height_tile / 2]);
      xAxis = d3.svg.axis().scale(xScale).ticks(4).orient("bottom");
      yAxis = d3.svg.axis().scale(yScale).ticks(4).orient("left");
      svg.append("g").attr("class", "axisX").attr("transform", "translate(" + x_xScale + "," + y_xScale + ")").call(xAxis);
      svg.select(".axisX").selectAll(".tick").selectAll("line").attr("y1", "-6");
      svg.append("g").attr("class", "axisY").attr("transform", "translate(" + x_yScale + "," + 0 + ")").call(yAxis);
      return svg.select(".axisY").selectAll(".tick").selectAll("line").attr("x1", "6");
    };

    heatmap.prototype.bottom_subplot = function(el, w, h) {
      var data, extX, line, width_tile, xScale, zScale;
      data = this.generate_line();
      zScale = d3.scale.linear().domain([this.minZ, this.maxZ]).range([h, 0]);
      extX = d3.extent(this.xPoints);
      width_tile = (extX[1] - extX[0]) / (this.nx - 1);
      xScale = d3.scale.linear().range([0, w]);
      xScale.domain([extX[0] - width_tile / 2, extX[1] + width_tile / 2]);
      line = d3.svg.line().x(function(d) {
        return xScale(d[0]);
      }).y(function(d) {
        return zScale(d[1]);
      });
      return el.append("path").attr("id", "lower_subline").datum(data.valueOf()).attr("class", "curve").attr("d", line).attr("idxY", 0).style("opacity", "1").style("stroke", "steelblue").style("stroke-width", "5px").style("fill", "none");
    };

    heatmap.prototype.generate_line = function() {
      var data, i, vx, xP, _i, _len;
      xP = this.xPoints;
      data = math.zeros(xP.length, 2);
      for (i = _i = 0, _len = xP.length; _i < _len; i = ++_i) {
        vx = xP[i];
        data.valueOf()[i][0] = vx;
        data.valueOf()[i][1] = this.func(vx, 0);
      }
      return data;
    };

    heatmap.prototype.bottom_subplot_axis = function(el, h, x, y) {
      var axis, zScale;
      zScale = d3.scale.linear().domain([this.minZ, this.maxZ]).range([y + h, y]);
      axis = d3.svg.axis().scale(zScale).ticks(4).orient("left");
      return el.append("g").attr("class", "axisY").call(axis);
    };

    return heatmap;

  })();

  pl1 = new heatmap;

  pl1.main_plot();

}).call(this);
