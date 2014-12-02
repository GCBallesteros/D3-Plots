class SimpleCross
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

    svg = d3.select("body").append("svg")
            .attr("width", w + @margin.left + @margin.right)
            .attr("height", h + @margin.top + @margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + @margin.left + "," + @margin.top + ")")
           #.style("display")

    svg.append("rect")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", w)
       .attr("height", h)
       .style("fill", "green")
       .on('mousemove', ->
             mousePos = d3.mouse(this)
             d3.select("#cursor")
               .style("display", "inline")
               .attr("x", mousePos[0])
               .attr("y", mousePos[1])
       )
       #.on("mouseout", ->
            #d3.select("#cursor")
              #.style("display", "none")
       #)
    svg.append("rect")
       .attr("id", "cursor")
       .attr("x", 0)
       .attr("y", 0)
       .attr("height", 10)
       .attr("width", 10)
       .style("fill", "white")
       .style("display", "none")


pl1 = new SimpleCross
pl1.plot()
