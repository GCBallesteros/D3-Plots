# TODO
# 1) Introduce number on side to report current value with background color
# 2) Extend lines to cover all plot
# 2) Introduce clickable points
# 3) Introduce ball that follows the points
# 3) Major Refactoring
# 4) Left Plot
# 5) Zoom
class heatmap
  constructor: ->
    @width = 1420

    @height = 920

    @margin =
      top: 10
      right: 10
      bottom: 10
      left: 10

    @xPoints = d3.range(0, 2*Math.PI, 0.10)
    @yPoints = d3.range(0, 2*Math.PI, 0.10)
    @nx = @xPoints.length
    @ny = @yPoints.length

    @data = heatmap::generate_data(@xPoints, @yPoints)
    @minZ = @data.min
    @maxZ = @data.max
    @zHeight = @data.z


  main_plot: ->
    w = @width - @margin.left - @margin.right
    h = @height - @margin.top - @margin.bottom

    svg = d3.select("body").append("svg")
            .attr("width", w + @margin.left + @margin.right)
            .attr("height", h + @margin.top + @margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + @margin.left + "," + @margin.top + ")")

    # Define scales to position elements inside the whole subfigure
    xfigScale = d3.scale.linear().domain([0, 1]).range([0, w])
    yfigScale = d3.scale.linear().domain([0, 1]).range([0, h])

    # Heatmap main plot
    xHeatMap = xfigScale(0.3)
    yHeatMap = yfigScale(0)
    xSizeHeatMap = xfigScale(0.7)
    ySizeHeatMap = yfigScale(0.7)
    central_plot = svg.append("g")
                      .attr("class", "HeatMap")
                      .style("cursor", "none")
                      .attr("transform",
                            "translate(" + xHeatMap + "," + yHeatMap + ")")

    @heatmap_plot(central_plot, xSizeHeatMap, ySizeHeatMap)

    # Plot the scales
    scales = svg.append("g")
                .attr("class", "scales")
    xScale_y_pos = yfigScale(0.75)
    xScale_x_pos = xHeatMap
    yScale_x_pos = xHeatMap - xfigScale(0.03)
    yScale_y_pos = yHeatMap
    @scales_plot(scales, xSizeHeatMap, ySizeHeatMap,
                 xScale_x_pos, xScale_y_pos, yScale_x_pos, yScale_y_pos)


    # Plot the cursor
    cursor_element = svg.append("g")
                        .attr("id", "cursor")
                        .attr("transform",
                            "translate(" + xHeatMap + "," + yHeatMap + ")")
    @cursor_plot(cursor_element, xSizeHeatMap, ySizeHeatMap, yScale_x_pos - xHeatMap, xScale_y_pos)

    x_b_subplot = xHeatMap
    y_b_subplot = yfigScale(0.8)
    w_b_subplot = xSizeHeatMap
    h_b_subplot = yfigScale(0.2)

    b_subplot = svg.append("g")
                   .attr("class", "line_plot")
                   .style("cursor", "none")
                   .attr("transform",
                         "translate(" + x_b_subplot + "," + y_b_subplot + ")")

    @bottom_subplot(b_subplot, w_b_subplot, h_b_subplot)

    @bottom_subplot_axis(b_subplot, h_b_subplot, 0, 0)

    return undefined

  func: (vx,vy) -> Math.cos(2*vx)*Math.cos(vy)

  idx2row: (idx) ->
    idx %% 13

  idx2col: (idx) -> Math.floor(idx / @nx)

  flatten: (ar) -> [].concat.apply([], ar.valueOf())

  generate_data: (x, y) ->
    zHeight = math.zeros(y.length, x.length)
    minZ = @func x[0], y[0]
    maxZ = @func x[0], y[0]

    for vy, j in y
      for vx, i in x
        new_val = @func vx, vy
        zHeight.valueOf()[j][i] = new_val
        if new_val > maxZ
          maxZ = new_val
        if new_val < minZ
          minZ = new_val

    return {z: zHeight, min: minZ, max: maxZ}

  colourScale: (domain, colors) ->
    nColors = colors.length
    deltaColor = 1 / (nColors - 1)
    extD = d3.extent(domain)
    cScale = (d) ->
      r = (extD[1] - d)/(extD[1]-extD[0])
      idx = Math.floor(r * (nColors-1))
      if idx >= nColors - 1
        idx = nColors - 2
      # Find value to interpolate between to relevant colors
      r = (r - idx*deltaColor)*(nColors-1)
      # interpolate r in between colors[idx] and colors[idx+1]
      # assume a color is in 3 array
      color_start = colors[idx]
      color_end   = colors[idx + 1]
      cout = "rgb("
      for c in [0..2]
        cout = cout + Math.floor(color_start[c] + r * (color_end[c] - color_start[c])) + ","
      cout = cout.slice(0,cout.length-1) + ")"

      return cout

    return cScale

  heatmap_plot: (svg, w, h) ->
    xPoints = @xPoints
    yPoints = @yPoints
    dy = yPoints[1] - yPoints[0]
    # Find max and min xy axis
    extX = d3.extent(xPoints)
    extY = d3.extent(yPoints)

    # Precompute size of the tiles
    width_tile = (extX[1]-extX[0]) / (@nx-1)
    height_tile = (extY[1]-extY[0]) / (@ny-1)

    # Set Domain of scales
    # Remember to leave extra space for the first and last tiles
    xScale = d3.scale.linear().range([0, w])
    yScale = d3.scale.linear().range([h, 0])

    xScale.domain([extX[0]-width_tile/2, extX[1]+width_tile/2])
    yScale.domain([extY[0]-height_tile/2, extY[1]+height_tile/2])

    color_brewer = [[33,102,172],
                    [67,147,195],
                    [146,197,222],
                    [209,229,240],
                    [247,247,247],
                    [253,219,199],
                    [244,165,130],
                    [214,96,77],
                    [178,24,43]]
    zScale = heatmap::colourScale([@minZ, @maxZ], color_brewer)

    width_tile_px = xScale(width_tile) - xScale(0)
    height_tile_px = yScale(0) - yScale(height_tile)
    nx = @nx
    idx2row = (i) -> i %% nx
    idx2col = (i) -> Math.floor(i / nx)

    zScale_lower = d3.scale.linear()
                     .domain([@minZ, @maxZ])
                     .range([190,0])
    line = d3.svg.line()
      .x((d) -> xScale(d[0]))
      .y((d) ->
        zScale_lower(d[1])) # BUG zScale is wrong because it refers to color BUG

    format_nums = d3.format(".4n")

    zHeight = @zHeight.valueOf()
    svg.append("g")
      .attr("class", "tiling")
      .selectAll(".tile")
      .data(heatmap::flatten(@zHeight))
      .enter().append("rect")
      .attr("class", "tile")
      .attr("x", (d, i)  ->
          xScale(xPoints[idx2row(i)]-width_tile/2))
      .attr("y", (d, i) ->
          yScale(yPoints[idx2col(i)]+height_tile/2))
      .attr("width", width_tile_px)
      .attr("height", height_tile_px)
      .style("fill", (d) -> zScale(d))
      .style("stroke",(d) -> zScale(d))
      .style("stroke-width", "1px")
      .on("mousemove", ->
            mousePos = d3.mouse(this)
            cursor = d3.select("#cursor").style("display", "inline")
            cursor.select(".xLine")
                  .attr("x1", mousePos[0])
                  .attr("y1", mousePos[1])
                  .attr("y2", mousePos[1])
            cursor.select(".yLine")
                  .attr("y1", mousePos[1])
                  .attr("x1", mousePos[0])
                  .attr("x2", mousePos[0])
            cursor.select(".xPos")
                  .attr("x", mousePos[0])
                  .text(format_nums(xScale.invert(mousePos[0])))
            cursor.select(".yPos")
                  .attr("y", mousePos[1])
                  .text(format_nums(xScale.invert(mousePos[1])))
            cursor.select(".xMarker")
                  .attr("x", mousePos[0])
            cursor.select(".yMarker")
                  .attr("y", mousePos[1])

            # Recall data for lower plot
            # Only replot if line has change to save
            # computation
            lower_plot = d3.select("#lower_subline")
            real_y = yScale.invert(mousePos[1])
            idx = Math.floor((real_y - extY[0])/dy + 0.5)
            if lower_plot.attr("idxY") isnt idx.toString()
              new_line_vals = d3.transpose([xPoints,zHeight[idx]])
              lower_plot.datum(new_line_vals)
                           .attr("d", line)
                           .attr("idxY", idx)
              console.log lower_plot.attr("idxY")
              console.log idx
      )

  cursor_plot: (svg, w, h, x, y) ->
    cursor = svg.style("display", "none")
                .style("cursor", "none")
    marker_h = 40
    marker_w = 3

    cursor.append("line")
          .attr("class", "xLine")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 0)
          .attr("y2", 1)
          .style("stroke", "rgb(40,40,40)")
          .style("stroke-dasharray", ("3, 3"))
          .style("stroke-width", "1px")

    cursor.append("text")
          .attr("class", "yPos")
          .attr("transform",
          "translate(" + 5 + "," + -marker_w*2 + ")")
          .attr("x", x)
          .attr("y", 0)
          .attr("text-anchor", "left")
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("font-weight", "bold")
          .attr("fill", "black")

    cursor.append("text")
          .attr("class", "xPos")
          .attr("transform",
          "translate(" + 5 + "," + -marker_h/2 + ")")
          .attr("x", 0)
          .attr("y", y)
          .attr("text-anchor", "left")
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("font-weight", "bold")
          .attr("fill", "black")

    cursor.append("line")
          .attr("class", "yLine")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 0)
          .attr("y2", h)
          .style("stroke", "rgb(40,40,40)")
          .style("stroke-dasharray", ("3, 3"))
          .style("stroke-width", "1px")

    cursor.append("rect")
          .attr("class", "xMarker")
          .attr("width", marker_w)
          .attr("height", marker_h)
          .attr("transform",
          "translate(" + -marker_w/2 + "," + -marker_h/2 + ")")
          .attr("x",0)
          .attr("y", y)
          .style("fill", "black")

    cursor.append("rect")
          .attr("class", "yMarker")
          .attr("width", marker_h)
          .attr("height", marker_w)
          .attr("transform",
          "translate(" + -marker_h/2 + "," + -marker_w/2 + ")")
          .attr("x",x)
          .attr("y", 0)
          .style("fill", "black")


  scales_plot: (svg, w, h, x_xScale, y_xScale, x_yScale, y_yScale) ->
    # Find max and min xy axis
    extX = d3.extent(@xPoints)
    extY = d3.extent(@yPoints)

    # Precompute size of the tiles
    width_tile = (extX[1]-extX[0]) / (@nx-1)
    height_tile = (extY[1]-extY[0]) / (@ny-1)

    # Set Domain of scales
    # Remember to leave extra space for the first and last tiles
    xScale = d3.scale.linear().range([0, w])
    yScale = d3.scale.linear().range([h, 0])

    xScale.domain([extX[0]-width_tile/2, extX[1]+width_tile/2])
    yScale.domain([extY[0]-height_tile/2, extY[1]+height_tile/2])

    xAxis = d3.svg.axis()
                  .scale(xScale)
                  .ticks(4)
                  .orient("bottom")

    yAxis = d3.svg.axis()
                  .scale(yScale)
                  .ticks(4)
                  .orient("left")

    svg.append("g")
       .attr("class", "axisX")
       .attr("transform", "translate(" + x_xScale + "," + y_xScale + ")")
       .call(xAxis)
    svg.select(".axisX").selectAll(".tick").selectAll("line").attr("y1", "-6")

    svg.append("g")
       .attr("class", "axisY")
       .attr("transform", "translate(" + x_yScale + "," + 0 + ")")
       .call(yAxis)

    svg.select(".axisY").selectAll(".tick").selectAll("line").attr("x1", "6")

  bottom_subplot: (el, w, h) ->
    data = @generate_line()
    zScale = d3.scale.linear().domain([@minZ, @maxZ]).range([h, 0])

    extX = d3.extent(@xPoints)
    width_tile = (extX[1]-extX[0]) / (@nx-1)
    # Set Domain of scales
    # Remember to leave extra space for the first and last tiles
    xScale = d3.scale.linear().range([0, w])
    xScale.domain([extX[0]-width_tile/2, extX[1]+width_tile/2])

    line = d3.svg.line()
      .x((d) -> xScale(d[0]))
      .y((d) -> zScale(d[1]))

    el.append("path")
      .attr("id", "lower_subline")
      .datum(data.valueOf())
      .attr("class", "curve")
      .attr("d", line)
      .attr("idxY", 0)
      .style("opacity", "1")
      .style("stroke", "steelblue")
      .style("stroke-width", "5px")
      .style("fill", "none")


  generate_line: ->
    xP = @xPoints
    data = math.zeros(xP.length, 2)
    for vx, i in xP
      data.valueOf()[i][0] = vx
      data.valueOf()[i][1] = @func vx, 0

    return data

  bottom_subplot_axis: (el, h, x, y) ->
    zScale = d3.scale.linear().domain([@minZ, @maxZ]).range([y+h, y])

    axis = d3.svg.axis()
                 .scale(zScale)
                 .ticks(4)
                 .orient("left")

    el.append("g")
      .attr("class", "axisY")
      .call(axis)

pl1 = new heatmap
pl1.main_plot()
