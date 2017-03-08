const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
}
const width = 960
const height = 500

const chartWidth = width - margin.left - margin.right
const chartHeight = height - margin.top - margin.bottom

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height)

const x = d3.scaleBand().rangeRound([0, chartWidth]).padding(.1)
const y = d3.scaleLinear().rangeRound([height, 0])

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
  .attr('transform', `translate(0, ${height})`)
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
    return height - y(d.frequency)
  })
