// Sample data
// Note: The data has to be sort in ascending order of the date
// const data = [
//   {
//     value: .2,
//     label: new Date(2016, 1, 1)
//   }, {
//     value: .5,
//     label: new Date(2016, 2, 1)
//   },
//   {
//     value: 2.5,
//     label: new Date(2016, 2, 23)
//   },
//   {
//     value: 1.5,
//     label: new Date(2016, 4, 21)
//   }
// ]

class LineChart extends Chart {
  constructor (props) {
    super(props)
    const margin = {
      top: 20,
      left: 40,
      right: 20,
      bottom: 20
    }

    this._margin = margin
  }
  size (width = 960 , height = 500) {
    const margin = this._margin
    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom
    return this
  }

  drawAxes (width, height) {
    const x = d3.scaleTime().rangeRound([0, width])
    const y = d3.scaleLinear().rangeRound([height, 0])
    return { x, y}
  }

  drawGroup (svg, margin) {
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left, margin.top})`)
    return g
  }

  beforeUpdate (data) {
    const width = this.width
    const height = this.height
    const svg = this.svg
    const margin = this._margin
    const x = this.x
    const y = this.y

    const line = d3.line()
      .x(function (d) {return x(d.label) })
      .y(function (d) {return y(d.value) })

    x.domain(d3.extent(data.map(function (d) { return d.label })))
    y.domain(d3.extent(data, function (d) { return d.value }))

    return { line, x, y}
  }

  update (data) {
    const { line, x, y } = this.beforeUpdate(data)
    const g = this.g
    // Target existing lines to carry update
    g.selectAll('path.line')
      .data([data])
      .transition(500)
      .attr('d', line)

    g.select('.x.axis')
      .transition(750)
      .call(d3.axisBottom(x))

    g.select('.y.axis')
      .transition(750)
      .call(d3.axisLeft(y))

    this.bindFocusEvents(this.svg)
  }

  draw (data) {
    const { x:xAxis, y:yAxis } = this.drawAxes(this.width, this.height)
    const g = this.drawGroup(this.svg, this._margin)
    this.x = xAxis
    this.y = yAxis
    this.g = g
    const { line, x, y } = this.beforeUpdate(data)
    this.x = x
    this.y = y

    const width = this.width
    const height = this.height
    const svg = this.svg
    const margin = this._margin

    g.append('g')
      .attr('class', 'axis x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))

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
    // Append lines
    g.data([data])
      .append('path')
      .attr('class', 'line')
      .transition(500)
      .attr('d', line)      
      .attr('clip-path', 'url(#rectClip)')

    // Clip-path animation
    svg.append('clipPath')
      .attr('id', 'rectClip')
      .append('rect')
      .attr('width', 0)
      .attr('height', height)

    d3.select('#rectClip rect')
      .transition().duration(3000)
      .attr('width', width)

    const focus = this.drawFocus(svg)
    // Append the rectangle to capture mouse
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function () {
        focus.style('display', null)
      })
      .on('mouseout', function () {
        focus.style('display', 'none')
      })
      .on('mousemove', mousemove)

    const bisector = d3.bisector(function (d) {
      return d.label
    }).left
    function mousemove () {
      const mouseX = x.invert(d3.event.x)
      const i = bisector(data, mouseX, 1)
      const d0 = data[i - 1]
      const d1 = data[i]
      console.log(d0, d1)
      const d = mouseX - d0.label.getTime() > d1.label.getTime() - mouseX ? d1 : d0

      const formatDate = d3.timeFormat('%d-%b')
      focus.select('circle.focus')
        .transition(750)
        .duration(50)
        .ease(d3.easeLinear)
        .attr('transform', `translate(${x(d.label)}, ${y(d.value)})`)

      focus.select('text.y1')
        .attr('transform',
          'translate(' + x(d.label) + ',' +
          y(d.value) + ')')
        .text(d.value)

      focus.select('text.y2')
        .attr('transform',
          'translate(' + x(d.label) + ',' +
          y(d.value) + ')')
        .text(d.value)

      focus.select('text.y3')
        .attr('transform',
          'translate(' + x(d.label) + ',' +
          y(d.value) + ')')
        .text(formatDate(d.label))

      focus.select('text.y4')
        .attr('transform',
          'translate(' + x(d.label) + ',' +
          y(d.value) + ')')
        .text(formatDate(d.label))

      focus.select('.x')
        .attr('transform',
          'translate(' + x(d.label) + ',' +
          y(d.value) + ')')
        .attr('y2', height - y(d.value))

      focus.select('.y')
        .attr('transform',
          'translate(' + width * -1 + ',' +
          y(d.value) + ')')
        .attr('x2', width + width)
    }
  }
  drawFocus (svg) {
    const width = this.width
    const height = this.height
    const focus = svg.append('g')
      .style('display', 'none')

    focus.append('circle')
      .attr('class', 'focus')
      .style('fill', 'none')
      .style('stroke', 'blue')
      .attr('r', 10)

    focus.append('line')
      .attr('class', 'x')
      .style('stroke', 'blue')
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.5)
      .attr('y1', 0)
      .attr('y2', height)

    // append the y line
    focus.append('line')
      .attr('class', 'y')
      .style('stroke', 'blue')
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.5)
      .attr('x1', width)
      .attr('x2', width)
    // place the value at the intersection
    focus.append('text')
      .attr('class', 'y1')
      .style('stroke', 'white')
      .style('stroke-width', '3.5px')
      .style('opacity', 0.8)
      .attr('dx', 8)
      .attr('dy', '-.3em')
    focus.append('text')
      .attr('class', 'y2')
      .attr('dx', 8)
      .attr('dy', '-.3em')

    // place the date at the intersection
    focus.append('text')
      .attr('class', 'y3')
      .style('stroke', 'white')
      .style('stroke-width', '3.5px')
      .style('opacity', 0.8)
      .attr('dx', 8)
      .attr('dy', '1em')
    focus.append('text')
      .attr('class', 'y4')
      .attr('dx', 8)
      .attr('dy', '1em')
    return focus
  }
  bindFocusEvents (svg) {
    const width = this.width
    const height = this.height
    const x = this.x
    const y = this.y
  }
}
