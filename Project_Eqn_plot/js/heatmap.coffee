class heatmap
  width: 1200
  height: 800

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
    zScale = d3.scale.linear().range(["red", "blue"])

    xPoints = d3.range(0, 2*Math.PI, 0.4)
    heatmap::nx = xPoints.length

    yPoints = d3.range(0, 2*Math.PI, 0.4)
    heatmap::ny = yPoints.length

    zHeight = math.zeros(@ny, @nx)
    # prepare the new array
    minZ = @func xPoints[0], yPoints[0]
    maxZ = @func xPoints[0], yPoints[0]

    for vy, j in yPoints
      for vx, i in xPoints
        new_val = Math.cos(vy)*Math.cos(vx)
        zHeight.valueOf()[j][i] = new_val
        if new_val > maxZ
          maxZ = new_val
        if new_val < minZ
          minZ = new_val

    # Find max and min xy axis
    extX = d3.extent(xPoints)
    extY = d3.extent(yPoints)

    # Precompute size of the tiles
    width_tile = (extX[1]-extX[0]) / (@nx-1)
    height_tile = (extY[1]-extY[0]) / (@ny-1)

    # Set Domain of scales
    xScale.domain([extX[0]-width_tile/2, extX[1]+width_tile/2])
    yScale.domain([extY[0]-height_tile/2, extY[1]+height_tile/2])
    zScale.domain([minZ, maxZ])

    # Creat svg and apply margin convention
    svg = d3.select("body").append("svg")
            .attr("width", w + @margin.left + @margin.right)
            .attr("height", h + @margin.top + @margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + @margin.left + "," + @margin.top + ")")

    # Start painting squares
    svg.selectAll(".tile")
       .data(heatmap::flatten(zHeight))
       .enter().append("rect")
       .attr("class", "tile")
       .attr("x", (d, i) ->
                xScale(xPoints[heatmap::idx2row(i)]-width_tile/2))
       .attr("y", (d, i) ->
                yScale(yPoints[heatmap::idx2col(i)]+height_tile/2))
       .attr("width", xScale(width_tile)-xScale(0))
       .attr("height", yScale(0)-yScale(height_tile))
       .style("fill", (d) -> zScale(d))
       .style("stroke",(d) -> zScale(d))
       .style("stroke-width", "1px")

    return undefined


  func: (vx,vy) -> Math.cos(vx)*Math.cos(vy)

  idx2row: (idx) -> idx %% @nx

  idx2col: (idx) -> Math.floor(idx / @nx)

  flatten: (ar) -> [].concat.apply([], ar.valueOf())

pl1 = new heatmap
pl1.plot()
