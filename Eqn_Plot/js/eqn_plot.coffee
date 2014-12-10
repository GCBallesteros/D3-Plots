# TODO
# add multiaxes support
# add box with unit and number to the right of each eqn
#   add a simple grid
class LinePlot
  constructor: (x, y, w, h, id) ->
    @x = x
    @y = y
    @w = w
    @h = h
    @id = id

  plot_line: (eq_param) ->
    svg = d3.select('#' + @id)
      .append("g")
      .attr("id", "line_" + @id)
      .attr("class", "eqn_plot")
      .attr("transform",
            "translate(" + @x + "," + @y + ")")

    data = @generate_data(eq_param)

    xScale = d3.scale.linear()
                     .domain(d3.extent(data.x))
                     .range([0, @w])

    yScale = d3.scale.linear()
                     .domain(d3.extent(data.y))
                     .range([@h, 0])

    line = d3.svg.line()
      .x((d) -> xScale(d[0]))
      .y((d) -> yScale(d[1]))
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
    # end add axis

    svg.append("path")
       .attr("class", "linePlot")
       .datum(d3.transpose([data.x, data.y]))
       .attr("d", line)
       .style("opacity", "1")
       .style("stroke", "steelblue")
       .style("stroke-width", "2.5px")
       .style("fill", "none")

  update_line: (eq_param) ->
    svg = d3.select('#line_' + @id)

    data = @generate_data(eq_param)

    xScale = d3.scale.linear()
                     .domain(d3.extent(data.x))
                     .range([0, @w])

    yScale = d3.scale.linear()
                     .domain(d3.extent(data.y))
                     .range([@h, 0])

    line = d3.svg.line()
      .x((d) -> xScale(d[0]))
      .y((d) -> yScale(d[1]))

    # Add the axis
    xAxis = d3.svg.axis()
                  .scale(xScale)
                  .ticks(4)
                  .orient("bottom")

    yAxis = d3.svg.axis()
                  .scale(yScale)
                  .ticks(4)
                  .orient("left")

    svg.select(".axisX")
       .call(yAxis)

    svg.select(".axisY")
       .call(xAxis)
    # end add axis

    svg.selectAll(".linePlot")
       .datum(d3.transpose([data.x, data.y]))
       .attr("d", line)
       .style("opacity", "1")
       .style("stroke", "steelblue")
       .style("stroke-width", "2.5px")
       .style("fill", "none")


  generate_data: (params) ->
    xPoints = d3.range(0, 2*Math.PI, 0.1)
    yPoints = xPoints.map((d) -> params.amp*Math.cos(d + Number(params.phase)))

    data = {x: xPoints, y:yPoints}

class Controls
  constructor: (id, ctrs) ->
    @id = id
    @ctrs = ctrs

  plot: ->
    id = @id
    sel = d3.select("#" + id).select(-> @parentNode).select(-> @parentNode)
            .append("div")
            .attr("class", "controls")
            .style("margin-left","1300px")
            .style("margin-top", "-420px")
    for control in @ctrs
      do ->
          sel.append("p")
            .text(control.name)
            .style("font-family", "sans-serif")
            .append("p")
            .append("input")
            .attr("id", "control_" + control.name + "_" + id)
            .attr("type", "range")
            .attr("min", control.min)
            .attr("max", control.max)
            .attr("step", 0.2)

class FinalPlot
  constructor: ->
    @width = 1200
    @height = 470

    @margin =
      top: 40
      right: 40
      bottom: 40
      left: 40

    @id = "wavy"

  plot: ->
    id = @id
    w = @width - @margin.left - @margin.right
    h = @height - @margin.top - @margin.bottom

    xfigScale = d3.scale.linear().domain([0, 1]).range([0, w])
    yfigScale = d3.scale.linear().domain([0, 1]).range([0, h])

    svg = d3.select("body").append("div").append("svg")
      .attr("width", @width)
      .attr("height", @height)
      .append("g")
      .attr("id", id)
      .attr("transform",
            "translate(" + @margin.left + "," + @margin.top + ")")

    # Position and size of line plot
    line_x = xfigScale(0)
    line_y = yfigScale(0)
    line_w = xfigScale(1)
    line_h = yfigScale(1)

    line_plot = new LinePlot(line_x, line_y, line_w, line_h, id)
    eq_param = {amp: 1, phase: 1.2}
    line_plot.plot_line(eq_param)

    # Add controls
    ctrs = [{name: "phase", min: 0, max: Math.PI},
            {name: "amp", min: 1, max:2}]
    controls = new Controls(id, ctrs)
    controls.plot()

    # Add interactivity
    d3.select("#control_" + "phase" + "_" + id).on("input", ->
          eq_param.phase = @value
          line_plot.update_line(eq_param)
    )
    d3.select("#control_" + "amp" + "_" + id).on("input", ->
          eq_param.amp = @value
          line_plot.update_line(eq_param)
    )

plot = new FinalPlot
plot.plot()
