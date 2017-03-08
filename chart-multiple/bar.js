// Sample Data
// const data = [
//   {
//     value: 4,
//     label: 'A'
//   }, {
//     value: 2.5,
//     label: 'B'
//   },
//   {
//     value: .5,
//     label: 'C'
//   },
//   {
//     value: 2.5,
//     label: 'D'
//   }
// ]

class BarChart extends Chart {
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
    const g = this.g
    const x = this.x
    const y = this.y
    const xAxis = this.xAxis
    const yAxis = this.yAxis
    const color = this.color
    const width = this.width
    const height = this.height

    // Update the x,y and color domains
    x.domain(data.map(function (d) { return d.label }))
    y.domain([0, d3.max(data, function (d) { return d.value })])
    color.domain(data.map(function (d) { return d.label }))

    // Update the x and y-axis
    d3.select('.axis.x').call(xAxis)
    d3.select('.axis.y').call(yAxis)

    // Update the bar chart
    g.selectAll('.bar')
      .data(data)
      .transition(750)
      .delay(function (d, i) { return Math.random() * 150 + 150 })
      .attr('x', function (d) { return x(d.label) })
      .attr('y', function (d) { return y(d.value) })
      .attr('width', x.bandwidth())
      .attr('height', function (d) { return height - y(d.value) })
  }

  draw (data) {
    const svg = this.svg
    const height = this.height
    const width = this.width
    const margin = this.margin
    const tooltip = this.drawHTMLTooltip()
    this.tooltipTimeout = null

    // Initialize the x, y, color, x-axis and y-axis
    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
    const y = d3.scaleLinear().rangeRound([height, 0])
    const color = d3.scaleOrdinal(d3.schemeCategory10)
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y).tickFormat(d3.format('$.2f'))

    // Update the x and y-domain values
    x.domain(data.map(function (d) { return d.label }))
    y.domain([0, d3.max(data, function (d) { return d.value })])
    color.domain(data.map(function (d) { return d.label }))

    // Append the chart group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Draw the x-axis
    g.append('g')
      .attr('class', 'axis x')
      .call(xAxis)
      .attr('transform', `translate(0, ${height})`)

    // Draw the y-axis
    g.append('g')
      .attr('class', 'axis y')
      .call(yAxis)
      .append('text')
      .attr('y', margin.top)
      .attr('x', 10)
      .attr('text-anchor', 'start')
      // .attr('transform', 'rotate(-90)')
      .attr('fill', 'black')
      .attr('font-size', '14px')
      .text('Income MYR')


    const svgTop = document.querySelector('svg').getBoundingClientRect().top

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) { return x(d.label) })
      .attr('y', function (d) { return y(d.value) })
      .attr('width', x.bandwidth())
      .attr('fill', function (d) { return color(d.label) })
      .attr('height', function (d) { return height - y(d.value) })
      .on('mouseover', (evt) => {

        if (this.tooltipTimeout) {
          window.clearTimeout(this.tooltipTimeout)
          this.tooltipTimeout = null
        }
        tooltip.style('visibility', 'visible')
          .style('left', `${d3.event.target.x.baseVal.value + x.bandwidth() / 2 }px`)
          .style('top', `${(height - d3.event.target.height.baseVal.value) + svgTop + margin.top + 20 }px`)
          .style('z-index', 100)
          .text(d3.event.target.__data__.value + ' ' + d3.event.target.__data__.label)
      })
      .on('mouseleave', (d) => {
        // Throttle
        if (this.tooltipTimeout) {
          window.clearTimeout(this.tooltipTimeout)
          this.tooltipTimeout = null
        }
        this.tooltipTimeout = window.setTimeout(() => {
          tooltip.style('visibility', 'hidden')
        }, 250)
      })

    // this.drawLegend(svg)
    this.g = g
    this.x = x
    this.y = y
    this.xAxis = xAxis
    this.yAxis = yAxis
    this.color = color

    this.isDrawn = true
  }
  drawHTMLTooltip () {
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('width', '100px')
      .style('height', '24px')
      .style('line-height', '24px')
      .style('text-align', 'center')
      .style('border-radius', '5px')
      .style('box-shadow', '0 1px 5px rgba(0, 0, 0, .25)')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, .5)')
      .style('color', 'white')
      .text('a simple tooltip')
    return tooltip
  }
  drawTooltip (svg) {
    const tooltip = svg.append('g')
      .attr('class', 'tooltip')
      .append('text')
      .text('tooltip')
      .attr('transform', 'translate(100, 100)')
      .style('opacity', '0')
    return tooltip
  }

  drawLegend (svg) {
    const width = this.width
    const height = this.height
    const color = this.color

    const legend = svg.append('g')
      .append('rect')
      .attr('width', 160)
      .attr('height', 100)
      .attr('class', 'legend')
      .attr('fill', 'rgba(255, 255, 255, .5)')
      .attr('stroke', '#333')
      .attr('transform', `translate(${width - 160}, 20)`)

    const legendItem = svg
      .selectAll('.legend-item')
      .data(['Expense', 'Income'])
      .enter()
      .append('g')
      .attr('class', 'legend-item')

    legendItem.append('rect')
      .attr('x', width - 150)
      .attr('y', function (d, i) { return i * 24 + 30 })
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', color)

    legendItem.append('text')
      .attr('x', width - 122)
      .attr('y', function (d, i) { return i * 24 + 40 })
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text(function (d) { return d })
  }
}
