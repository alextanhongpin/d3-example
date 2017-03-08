const data = [
  { letter: 'A', frequency: 10 },
  { letter: 'B', frequency: 14 },
  { letter: 'C', frequency: 1 },
  { letter: 'D', frequency: 20 },
  { letter: 'E', frequency: 4 },
  { letter: 'F', frequency: 8 },
]
const updatedData = [
  { letter: 'A', frequency: 15 },
  { letter: 'B', frequency: 12 },
  { letter: 'C', frequency: 9 },
  { letter: 'D', frequency: 0 },
  { letter: 'E', frequency: 8 },
  { letter: 'F', frequency: 2 },
]

const svg = d3.select('body')
  .append('svg')
  .attr('width', 960)
  .attr('height', 500)

const BarChart = (svg, data, options) => {
  const SVG_HEIGHT = parseFloat(svg.attr('height'), 10)
  const SVG_WIDTH = parseFloat(svg.attr('width'), 10)
  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  }
  const WIDTH = SVG_WIDTH - margin.left - margin.right
  const HEIGHT = SVG_HEIGHT - margin.top - margin.bottom

  const x = d3.scaleBand().rangeRound([0, WIDTH]).padding(.1)
  const y = d3.scaleLinear().rangeRound([HEIGHT, 0])

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // Passing data to x domain
  x.domain(data.map((d) => {
    return d.letter
  }))
  y.domain([0, d3.max(data, (d) => {
    return d.frequency
  })])

  // Draw the x-axis
  g.append('g')
    .attr('class', 'axis x')
    .attr('transform', `translate(0, ${HEIGHT})`)
    .call(d3.axisBottom(x))

  // Draw the y-axis
  g.append('g')
    .attr('class', 'axis y')
    .call(d3.axisLeft(y).ticks(10, '%'))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Frequency')

  // Render the bar chart
  g.selectAll('.bar')
    // Append the data
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    // x-data
    .attr('x', (d) => {
      return x(d.letter)
    })
    // y-data
    .attr('y', (d) => {
      return y(d.frequency)
    })
    // Width of a bar-chart
    .attr('width', x.bandwidth())
    // Inverse height of the bar-chart
    .attr('height', (d) => {
      return HEIGHT - y(d.frequency)
    })

  return {
    g: g
  }
}

const barChart = BarChart(svg, data)

window.setTimeout(() => {

  barChart.g.data(updatedData)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr()
}, 2000)