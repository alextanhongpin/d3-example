class AreaChart extends Chart {
  constructor (props) {
    super(props)
  }
  get margin () {
    return {
      top: 20,
      left: 40,
      right: 20,
      bottom: 20
    }
  }
  get chartTransition () {
    return 750
  }
  get chartDuration () {
    return 250
  }
  size (width = 960 , height = 500) {
    const margin = this.margin
    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom
    return this
  }

  update (data) {
    // Chart has not been drawn - unable to update
    if (!this.isDrawn) {
      // Destroy the old instance of the chart
      super.destroy()
      // Draw the chart
      this.draw(data)
      return false
    }
    const x = this.x
    const y = this.y
    const area = this.area
    const g = this.g

    // Update the x and y-domain
    x.domain(d3.extent(data.map(function (d) { return d.label })))
    y.domain([0, d3.max(data, function (d) { return d.value })])

    // Recalculate the min and max stop for the gradient
    const maxY = d3.max(data, function (d) { return d.value })
    const stopMin = y(.75 * maxY)
    const stopMax = y(.8 * maxY)
    this.updateStyleArea(g, stopMin, stopMax)

    // Update existing area path
    g.selectAll('path.area')
      .datum(data)
      .transition(this.chartTransition)
      .duration(this.chartDuration)
      .attr('d', area)

    // Update the x-axis with new values
    g.select('.x.axis')
      .transition(this.chartTransition)
      .duration(this.chartDuration)
      .call(d3.axisBottom(x))

    // Update the y-axis
    g.select('.y.axis')
      .transition(this.chartTransition)
      .duration(this.chartDuration)
      .call(d3.axisLeft(y))
  }

  draw (data) {
    const svg = this.svg
    const width = this.width
    const height = this.height
    const margin = this.margin

    // Prepare the x, y-axis and area data
    const x = d3.scaleLinear().rangeRound([0, width])
    const y = d3.scaleLinear().rangeRound([height, 0])
    const area = d3.area()
      .x(function (d) {return x(d.label) })
      .y0(height)
      .y1(function (d) {return y(d.value) })

    // Set x and y-domain
    x.domain(d3.extent(data.map(function (d) { return d.label })))
    y.domain([0, d3.max(data, function (d) { return d.value })])

    // Append base group to svg
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left, margin.top})`)

    

    // Compute the min and max stop for the linear gradient
    // Min and max stop is computed at 75% and 80% of the 
    // y-axis height
    const maxY = d3.max(data, function (d) { return d.value })
    const stopMin = y(.75 * maxY)
    const stopMax = y(.8 * maxY)
    this.styleArea(g, stopMin, stopMax)

    // Draw the x-axis
    g.append('g')
      .attr('class', 'axis x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))

    // Draw the y-axis
    g.append('g')
      .attr('class', 'axis y')
      .attr('transform', `translate(0, 0)`)
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .style('text-anchor', 'end')
      .text('Price ($)')

    // Draw the line
    g.datum(data)
      .append('path')
      .attr('class', 'area')
      .transition(500)
      .attr('d', area)
      .attr('clip-path', 'url(#rectClip)')

    // Clip-path animation
    svg.append('clipPath')
      .attr('id', 'rectClip')
      .append('rect')
      .attr('width', 0)
      .attr('height', height)

    d3.select('#rectClip rect')
      .transition().duration(500)
      .attr('width', width)
    // Store necessary variables to carry out update
    this.g = g
    this.x = x
    this.y = y
    this.area = area
    this.isDrawn = true
  }

  // styleArea() is method to style the area chart
  styleArea (g, stopMin, stopMax) {
    g.append('linearGradient')
      .attr('id', 'temperature-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', stopMin)
      .attr('x2', 0).attr('y2', stopMax)
      .selectAll('stop')
      .data([
        {offset: '0%', color: 'rebeccapurple'},
        {offset: '50%', color: 'blue'},
        {offset: '100%', color: 'red'}
      ])
      .enter().append('stop')
      .attr('offset', function (d) { return d.offset; })
      .attr('stop-color', function (d) { return d.color; })
  }

  updateStyleArea (g, stopMin, stopMax) {
    g.select('#temperature-gradient')
      .attr('x1', 0).attr('y1', stopMin)
      .attr('x2', 0).attr('y2', stopMax)
      .selectAll('stop')
      .attr('offset', function (d) { return d.offset; })
      .attr('stop-color', function (d) { return d.color; })
  }

}
