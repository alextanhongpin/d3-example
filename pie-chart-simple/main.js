var width = 960,
  height = 500,
  radius = Math.min(width, height) / 2

var color = d3.scaleOrdinal()
  .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])

var arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0)

var labelArc = d3.arc()
  .outerRadius(radius - 40)
  .innerRadius(radius - 40)

var pie = d3.pie()
  .sort(null)
  .value(function (d) { return d.number; })

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

var data = [
  {'number': 4, 'name': 'Locke'},
  {'number': 8, 'name': 'Reyes'},
  {'number': 15, 'name': 'Ford'},
  {'number': 16, 'name': 'Jarrah'},
  {'number': 23, 'name': 'Shephard'},
  {'number': 42, 'name': 'Kwon'}
]

var g = svg.selectAll('.arc')
  .data(pie(data))
  .enter().append('g')
  .attr('class', 'arc')

g.append('path')
  .attr('d', arc)
  .style('fill', function (d) {
    return color(d.data.name)
  })

g.append('text')
  .attr('transform', function (d) { return 'translate(' + labelArc.centroid(d) + ')'; })
  .attr('dy', '.35em')
  .text(function (d) { return d.data.number; })
