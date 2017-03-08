const svgWidth = 960
const svgHeight = 500
const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  }
const width = svgWidth - margin.left - margin.right,
const height = svgHeight - margin.top - margin.bottom
const parseDate = d3.time.format('%d-%b-%y').parse
const x = d3.timeScale().range([0, width])
const y = d3.scaleLinear().range([height, 0])
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

const area = d3.area()
  .x((d) => { return x(d.date) })
  .y0(height)
  .y1(function (d) { return y(d.close); })

const svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.tsv('data.tsv', function (error, data) {
  if (error) throw error

  data.forEach(function (d) {
    d.date = parseDate(d.date)
    d.close = +d.close
  })

  x.domain(d3.extent(data, function (d) { return d.date; }))
  y.domain([0, d3.max(data, function (d) { return d.close; })])

  svg.append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area)

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Price ($)')
})
