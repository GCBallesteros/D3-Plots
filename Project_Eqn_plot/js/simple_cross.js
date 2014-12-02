// Generated by CoffeeScript 1.8.0
(function() {
  var SimpleCross, pl1;

  SimpleCross = (function() {
    function SimpleCross() {}

    SimpleCross.prototype.width = 600;

    SimpleCross.prototype.height = 400;

    SimpleCross.prototype.margin = {
      top: 70,
      right: 70,
      bottom: 70,
      left: 70
    };

    SimpleCross.prototype.nx = 0;

    SimpleCross.prototype.ny = 0;

    SimpleCross.prototype.plot = function() {
      var h, svg, w, xScale, yScale;
      w = this.width - this.margin.left - this.margin.right;
      h = this.height - this.margin.top - this.margin.bottom;
      xScale = d3.scale.linear().range([0, w]);
      yScale = d3.scale.linear().range([h, 0]);
      svg = d3.select("body").append("svg").attr("width", w + this.margin.left + this.margin.right).attr("height", h + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      svg.append("rect").attr("x", 0).attr("y", 0).attr("width", w).attr("height", h).style("fill", "green").on('mousemove', function() {
        var mousePos;
        mousePos = d3.mouse(this);
        return d3.select("#cursor").style("display", "inline").attr("x", mousePos[0]).attr("y", mousePos[1]);
      });
      return svg.append("rect").attr("id", "cursor").attr("x", 0).attr("y", 0).attr("height", 10).attr("width", 10).style("fill", "white").style("display", "none");
    };

    return SimpleCross;

  })();

  pl1 = new SimpleCross;

  pl1.plot();

}).call(this);
