class heatmap
  width: 600
  height: 400

  margin:
    top: 70
    right: 70
    bottom: 70
    left: 70

  nx: 0

  ny: 0


  plot: ->
    w = @width - @margin.left - @margin.right
    h = @height - @margin.top - @margin.bottom

    xScale = d3.scale.linear().range([0, w])
    yScale = d3.scale.linear().range([h, 0])
    #zScale = d3.scale.linear().range(["green","white", "blue"])

    xPoints = d3.range(0, 2*Math.PI, 0.40)
    heatmap::nx = xPoints.length

    yPoints = d3.range(0, 2*Math.PI, 0.40)
    heatmap::ny = yPoints.length

    data = heatmap::generate_data(xPoints, yPoints)
    minZ = data.min
    maxZ = data.max
    zHeight = data.z

    # Find max and min xy axis
    extX = d3.extent(xPoints)
    extY = d3.extent(yPoints)

    # Precompute size of the tiles
    width_tile = (extX[1]-extX[0]) / (@nx-1)
    height_tile = (extY[1]-extY[0]) / (@ny-1)

    # Set Domain of scales
    # Remember to leave extra space for the first and last tiles
    xScale.domain([extX[0]-width_tile/2, extX[1]+width_tile/2])
    yScale.domain([extY[0]-height_tile/2, extY[1]+height_tile/2])
    #zScale.domain([minZ, maxZ])


    color_brewer = [[33,102,172],[67,147,195],[146,197,222],[209,229,240],[247,247,247],[253,219,199],[244,165,130],[214,96,77],[178,24,43]]
    zScale = heatmap::colourScale([minZ, maxZ], color_brewer)

    width_tile_px = xScale(width_tile) - xScale(0)
    height_tile_px = yScale(0) - yScale(height_tile)

    # Creat svg and apply margin convention
    svg = d3.select("body").append("svg")
            .attr("width", w + @margin.left + @margin.right)
            .attr("height", h + @margin.top + @margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + @margin.left + "," + @margin.top + ")")

    # Paint squares
    svg.append("g")
       .attr("class", "tiling")
       .selectAll(".tile")
       .data(heatmap::flatten(zHeight))
       .enter().append("rect")
       .attr("class", "tile")
       .attr("x", (d, i) ->
                xScale(xPoints[heatmap::idx2row(i)]-width_tile/2))
       .attr("y", (d, i) ->
                yScale(yPoints[heatmap::idx2col(i)]+height_tile/2))
       .attr("width", width_tile_px)
       .attr("height", height_tile_px)
       .style("fill", (d) -> zScale(d))
       .style("stroke",(d) -> zScale(d))
       .style("stroke-width", "1px")
       .on("mouseover", (d, i) -> # this method is extremely inefficient
            # ON MOUSEOVER function
            xPosition = parseFloat(d3.select(this).attr("x"))
            yPosition = parseFloat(d3.select(this).attr("y"))
            svg.append("text")
               .attr("id", "tooltipX")
               .attr("x", xPosition)
               .attr("y", h+12)
               .attr("text-anchor", "middle")
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("font-weight", "bold")
               .attr("fill", "black")
               .text(xPoints[heatmap::idx2row(i)])

            svg.append("text")
               .attr("id", "tooltipY")
               .attr("x", -12)
               .attr("y", yPosition)
               .attr("text-anchor", "middle")
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("font-weight", "bold")
               .attr("fill", "black")
               .text(yPoints[heatmap::idx2col(i)])


            svg.append("line")
               .attr("id", "xLine")
               .attr("x1", xPosition + width_tile_px/2)
               .attr("y1", yPosition + height_tile_px/2)
               .attr("x2", 10)
               .attr("y2", yPosition + height_tile_px/2)
               .style("stroke", "white")
               .style("stroke-dasharray", ("3, 3"))
               .style("stroke-width", "1px")

            svg.append("line")
               .attr("id", "yLine")
               .attr("x1", xPosition + width_tile_px/2)
               .attr("y1", yPosition + height_tile_px/2)
               .attr("x2", xPosition + width_tile_px/2)
               .attr("y2", h+height_tile_px)
               .style("stroke", "white")
               .style("stroke-dasharray", ("3, 3"))
               .style("stroke-width", "1px"))
       .on("mouseout", ->
         d3.select("#xLine").remove()
         d3.select("#yLine").remove()
         d3.select("#tooltipX").remove()
         d3.select("#tooltipY").remove())

    return undefined

  func: (vx,vy) -> Math.cos(vx)*Math.cos(vy)

  idx2row: (idx) -> idx %% @nx

  idx2col: (idx) -> Math.floor(idx / @nx)

  flatten: (ar) -> [].concat.apply([], ar.valueOf())

  generate_data: (x, y) ->
    zHeight = math.zeros(@ny, @nx)
    minZ = @func x[0], y[0]
    maxZ = @func x[0], y[0]

    for vy, j in y
      for vx, i in x
        new_val = Math.cos(vy)*Math.cos(vx)
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


pl1 = new heatmap
pl1.plot()
