const width = 960
const height = 450
const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
}

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const chartHeight = height - margin.top - margin.bottom
const chartWidth = width - margin.left - margin.right

const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

const parseTime = d3.timeParse('%d-%b-%y')

// Axis
const x = d3.scaleTime().rangeRound([0, width])
const y = d3.scaleLinear().rangeRound([height, 0])

const line = d3.line()
  .x((d) => {
    return x(d.date)})
  .y((d) => {
    return y(d.close)})

const data = `24-Apr-07 93.24,
25-Apr-07 95.35,
26-Apr-07 98.84,
27-Apr-07 99.92,
30-Apr-07 99.80,
1-May-07  99.47,
2-May-07  100.39,
3-May-07  100.40,
4-May-07  100.81,
7-May-07  103.92,
8-May-07  105.06,
9-May-07  106.88,
10-May-07 107.34,
11-May-07 108.74,
14-May-07 109.36,
15-May-07 107.52,
16-May-07 107.34,
17-May-07 109.44,
18-May-07 110.02,
21-May-07 111.98,
22-May-07 113.54,
23-May-07 112.89`

const splitData = data.split(',').map((d) => {

  return d.split(' ').filter((m) => {
    return m
  }).map((m) => {
    return m.trim().replace('\r\n', '')
  })
})

const parsedData = splitData.map((d) => {
  let schema = {}
  schema.date = parseTime(d[0])
  schema.close = parseFloat(d[1], 10)
  return schema
})

x.domain(d3.extent(parsedData, (d) => {
  return d.date}))

// The min-y and max-y will be used
  // y.domain(d3.extent(parsedData, (d) => {
  //  return d.close}))

// To set it to zero, do it this way
const maxY = d3.max(parsedData, (d) => {
  return d.close
})
const minY = 0

y.domain([minY, maxY])

const defs = g.append('linearGradient')
  .attr('id', 'temperature-gradient')
  .attr('gradientUnits', 'userSpaceOnUse')
  .attr('x1', 0)
  .attr('y1', y(50))
  .attr('x2', 0)
  .attr('y2', y(60)).selectAll('stop')
  .data([
    {offset: '0%', color: 'steelblue'},
    {offset: '50%', color: 'gray'},
    {offset: '100%', color: 'red'}
  ])
  .enter()
  .append('stop')
  .attr('offset', function (d) { return d.offset; })
  .attr('stop-color', function (d) { return d.color; })

g.append('g')
  .attr('class', 'axis x')
  .attr('transform', `translate(0, ${chartHeight})`)
  .call(d3.axisBottom(x))

g.append('g')
  .attr('class', 'axis y')
  .call(d3.axisLeft(y))
  .append('text')
  .attr('fill', '#000')
  .attr('transform', 'rotate(-90)')
  .attr('y', 6)
  .attr('dy', '0.71em')
  .style('text-anchor', 'end')
  .text('Price ($)')

g.append('path')
  .datum(parsedData)
  .attr('class', 'line')
  .attr('d', line)
