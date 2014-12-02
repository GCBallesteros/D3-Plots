# TODO
# 3) Add axis labels
# 5) Follow line marker with little circle and show pos in little
# 5) Generate some fake data
# 6)

class SemiPolar
  constructor: (radius, cx, cy)->
    @radius = radius
    @cx = cx  # coordinate x center
    @cy = cy  # coordinate y center
    @n_r_ticks = 4
    @n_ang_ticks = 6 # even numbers look better
    @destiny = "#semipolar_plot"


  plot_grid: ->
    radius = @radius
    svg = d3.select(@destiny)
      .append("g")
        .attr("class", "semipolar_grid")
        .attr("transform",
              "translate(" + @cx + "," + @cy + ")")

    # Draw circular arches on the r ticks
    r = d3.scale.linear()
      .domain([0, 1])
      .range([0, @radius])

    arc = d3.svg.arc()
      .startAngle(Math.PI/2)
      .endAngle(-Math.PI/2)
      .innerRadius(0)
      .outerRadius((d) -> r(d))

    line = d3.svg.line.radial()
      .radius((d) ->
        r(d[1])
      )
      .angle((d) -> d[0])


    gr = svg.append("g")
      .attr("class", "r axis")
      .selectAll("g")
      .data(r.ticks(@n_r_ticks).slice(1))
      .enter().append("g")

    gr.append("path")
      .attr("d", arc)
      .style("fill", "none")
      .style("stroke", "rgb(85, 85, 85)")
      .style("stroke-dasharray", ("3, 3"))
      .style("stroke-width", "1px")
      .style("shape-rendering", "none")

    svg.append("path")
      .attr("d", arc(1))
      .style("stroke", "rgb(45, 45, 45)")
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("shape-rendering", "none")

    # Draw Angular Grid
    ga = svg.append("g")
      .attr("class", "a axis")
      .selectAll("g")
      .data([-3..3].map((d) -> d*30))
      #.data(d3.range(0, 180, 180/@n_ang_ticks))
      .enter().append("g")
      .attr("transform", (d) ->
              ang = d - 90
              "rotate(" + ang + ")")

    ga.append("line")
      .attr("x2", @radius)
      .style("stroke", "rgb(85, 85, 85)")
      .style("stroke-dasharray", ("3, 3"))
      .style("stroke-width", "1px")
      .style("shape-rendering", "none")

    ga.append("text")
      .attr("x", @radius + 6)
      .attr("dx", ".35em")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .attr("transform", (d) ->
            turn = 90
            r_aux = radius + 10
            "rotate(" + turn + ", " + r_aux + ",0)")
      .text((d) -> Math.abs(d) + "°")

    svg.append("path")
       .datum(@generate_data())
       .attr("class", "line")
       .attr("d", line)
       .style("stroke", "red")
       .style("stroke-width", "2px")
       .style("fill", "none")

  generate_data: ->
    angle = d3.range(-Math.PI/2, Math.PI/2, Math.PI/101)
    r2 = angle.map((d) -> Math.abs(Math.sin(d)))

    return d3.transpose([angle, r2])

class LinePlot
  constructor: (h, w, x, y) ->
    @h = h
    @w = w
    @x = x
    @y = y
    @destiny = "#semipolar_plot"
    @n_x_ticks = 4
    @n_y_ticks = 4

  plot_line: ->
    svg = d3.select(@destiny)
      .append("g")
        .attr("class", "line_plot")
        .attr("transform",
              "translate(" + @x + "," + @y + ")")

    data = @generate_data()
    extX = d3.extent(data.x)
    n_x_points = data.x.length

    xScale = d3.scale.linear()
                     .domain(d3.extent(data.x))
                     .range([0, @w])

    yScale = d3.scale.linear()
                     .domain(d3.extent(data.y))
                     .range([@h, 0])

    line = d3.svg.line()
      .x((d) -> xScale(d[0]))
      .y((d) -> yScale(d[1]))

    svg.append("path")
       .datum(d3.transpose([data.x, data.y]))
       .attr("d", line)
       .style("opacity", "1")
       .style("stroke", "steelblue")
       .style("stroke-width", "2.5px")
       .style("fill", "none")

    # Add the axis
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
       .attr("transform", "translate(" + 0 + "," + 0 + ")")
       .call(yAxis)

    svg.append("g")
       .attr("class", "axisY")
       .attr("transform", "translate(" + 0 + "," + @h + ")")
       .call(xAxis)

    svg.append("rect")
       .attr("class", "click_surface")
       .attr("x", @x)
       .attr("y", @y)
       .attr("width", @w)
       .attr("height", @h)
       .style("fill", "none")
       .style("fill", "rgba(0,0,0,0)")
       .on("mousemove", ->
              mousePos = d3.mouse(this)
              cursor = d3.select("#cursor")

              x_pos = xScale.invert(mousePos[0])
              r = (x_pos - extX[0])/(extX[1] - extX[0])
              idx = Math.floor(r*n_x_points)
              console.log idx

              cursor.select("circle")
                    .attr("cx", xScale(data.x[idx]))
                    .attr("cy", yScale(data.y[idx]))
        )

    @plot_cursor(svg)

  plot_cursor: (svg) ->
    cursor = svg.append("g")
                .attr("id", "cursor")

    cursor.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 8)
      .style("fill", "lawngreen")

    cursor.append("text")
          .attr("x", @w)
          .attr("y", @y+20)
          .attr("text-anchor", "left")
          .attr("font-family", "sans-serif")
          .attr("font-size", "31px")
          .attr("font-weight", "bold")
          .attr("fill", "black")
          .text("hola")
  generate_data: ->
    xPoints = d3.range(0, 6, 0.01)
    yPoints = xPoints.map((d) -> Math.cos(d) + 0.3*Math.cos(2*d)+0.4*Math.cos(3*d))

    return {x: xPoints, y: yPoints}


class FinalPlot
  constructor: ->
    @width = 1200
    @height = 520

    @margin =
      top: 40
      right: 40
      bottom: 40
      left: 40

  plot: ->
    w = @width - @margin.left - @margin.right
    h = @height - @margin.top - @margin.bottom

    xfigScale = d3.scale.linear().domain([0,1]).range([0,w])
    yfigScale = d3.scale.linear().domain([0,1]).range([0,h])

    svg = d3.select("body").append("svg")
        .attr("width", @width)
        .attr("height", @height)
        .append("g")
        .attr("id", "semipolar_plot")
        .attr("transform",
              "translate(" + @margin.left + "," + @margin.top + ")")

    #Position and Size of Polar plot
    polar_x_pos = xfigScale(0.85)
    polar_y_pos = yfigScale(0.6)
    polar_radius = xfigScale(0.15)

    #Position and Size of Line plot
    line_x_pos = xfigScale(0)
    line_y_pos = yfigScale(0)
    lineplot_w = xfigScale(0.65)
    lineplot_h = yfigScale(1)

    grid = new SemiPolar(polar_radius, polar_x_pos, polar_y_pos)
    grid.plot_grid()

    line = new LinePlot(lineplot_h, lineplot_w, line_x_pos, line_y_pos)
    line.plot_line()



  line_plot: ->

# Plot the damn thing
plot = new FinalPlot
plot.plot()
