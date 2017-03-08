
const data = [
  {
    age: '<5',
    population: '2704659'
  },
  {
    age: '5-13',
    population: '4499890'
  },
  {
    age: '14-17',
    population: '2159981'
  },
  {
    age: '18-24',
    population: '3853788'
  },
  {
    age: '25-44',
    population: '14106543'
  },
  {
    age: '45-64',
    population: '8819342'
  },
  {
    age: '>=65',
    population: '612463'
  }
]

const dataUpdate = [
  {
    age: '<5',
    population: '11204659'
  },
  {
    age: '5-13',
    population: '999890'
  },
  {
    age: '14-17',
    population: '3159981'
  },
  {
    age: '18-24',
    population: '353788'
  },
  {
    age: '25-44',
    population: '10106543'
  },
  {
    age: '45-64',
    population: '12819342'
  }
]


const svg = d3.select('body').append('svg')
  .attr('width', 480)
  .attr('height', 320)

// PIECHART
// * Render a pie chart for a given svg
// * Returns the relevant data for the pie chart
const PieChart = (svg, data) => {
  const HEIGHT = parseFloat(svg.attr('height'), 10)
  const WIDTH = parseFloat(svg.attr('width'), 10)
  const RADIUS = Math.min(HEIGHT, WIDTH) / 2

  const g = svg.append('g')
    .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`)

  const color = d3.scaleOrdinal(d3.schemeCategory20c)

  const pie = d3.pie()
    .sort(null)
    .value(d => d.population)

  const path = d3.arc()
    .outerRadius(RADIUS - 10)
    .innerRadius(0)

  const label = d3.arc()
    .outerRadius(RADIUS - 40)
    .innerRadius(RADIUS - 40)

  const arc = g.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc')

  arc.append('path')
    .attr('d', path)
    .attr('fill', d => color(d.data.age))

  arc.append('text')
    .attr('transform', d => `translate(${label.centroid(d)})`)
    .attr('dy', '0.35em')
    .text(d => d.data.age)
    .attr('font-size', '14px')
    .attr('font-family', 'Helvetica')

  return {
    height: HEIGHT,
    width: WIDTH,
    radius: RADIUS,
    arc: arc,
    pie: pie,
    path: path,
    color: color
  }
}

const pieChart = PieChart(svg, data)

d3.select('.change').on('click', () => {
  const arcUpdated = pieChart.arc.data(pieChart.pie(dataUpdate))
  // UPDATE
  // * Grab only new data and create a new arc
  arcUpdated
    .enter()
    .selectAll('path')
    .append('path')
    .attr('fill', d => pieChart.color(d.data.age))

  // DELETE
  // * Select only the removed data
  arcUpdated
    .exit()
    .remove()

  arcUpdated
    .selectAll('path')
    // .transition()
    // .duration(250)
    // .attrTween('d', arcTween)
    .remove()
  
  arcUpdated.append('path')
    .attr('d', pieChart.path)
    .attr('fill', d => pieChart.color(d.data.age))
    .transition()
    .duration(250)
    .attrTween('d', arcTween)

  arcUpdated
    .enter()
    .selectAll('text')
    .text(d => d.data.age)

  arcUpdated
    .exit()
    .selectAll('text')
    .remove()

  arcUpdated
    .selectAll('text')
    .text(d => d.data.age)
})

function arcTween(a, index) {
  const i = d3.interpolateObject(this._current, a)
  this._current = i(0)
  return function(t) {
    return pieChart.path(i(t))
  }
}