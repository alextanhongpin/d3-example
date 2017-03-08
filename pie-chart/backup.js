// const pieChart = new PieChart(960, 500)
// pieChart.select('body').draw(data)
const width = 960
const height = 450
const radius = Math.min(width, height) / 2
const data = [1, 1, 2, 3, 5, 8, 13, 21]

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')

svg.append('g')
  .attr('class', 'arcs')

svg.append('g').attr('class', 'labels')
svg.append('g')
  .attr('class', 'lines')

svg.attr('transform', `translate(${ width / 2 }, ${ height / 2 })`)

const pie = d3.pie()
  .sort(null)
  .value((d) => {
    return d.value
  })

const arc = d3.arc()
  .innerRadius(radius * 0.4)
  .outerRadius(radius * 0.8)

const outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)

const key = function (d) {
  return d.data.label
}

const color = d3.scaleOrdinal()
  .domain(['Lorem ipsum', 'dolor sit', 'amet', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt'])
  .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])
function randomData () {
  const labels = color.domain()
  return labels.map(function (label) {
    return { label: label, value: Math.random() }
  })
}
d3.select('.randomize').on('click', () => {
  change(randomData())
})
change(randomData())
function change (data) {
  /* ------- PIE SLICES -------*/
  const slice = svg.select('.arcs')
    .selectAll('path.arc')

    .data(pie(data), key)
    .enter()
    .append('g')
    .attr('class', 'arc')

  slice.append('path')
    .style('fill', (d) => {
      return color(d.data.label)
    })
    // .attr('d', arc)
    .transition()
    .duration(1000)
    .attrTween('d', arcTween)

  function arcTween (d) {
    const i = d3.interpolate(d._cached || d.endAngle, d.endAngle)
    return function (t) {
      d._cached = i(t)
      return arc(d)
    }
  }

  function arcTween2 (d, i, a) {
    this._current = this._current || d
    // const interpolate = d3.interpolate(this._current, d)
    const interpolate = d3.interpolate(this._current, d)
    this._current = interpolate(0)
    return function (t) {
      return arc(interpolate(t))
    }
  } // .attr('d', arc)

  slice.exit().remove()

  /* ------- TEXT LABELS -------*/

  const text = svg
    .select('.labels')
    .selectAll('text')
    .data(pie(data), key)

  text.enter()
    .append('text')
    .attr('dy', '.35em')
    .text((d) => {
      return d.data.label
    })

  function midAngle (d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2
  }

  text.transition().duration(1000)
    .attrTween('transform', function (d) {
      this._current = this._current || d
      var interpolate = d3.interpolateObject(this._current, d)
      this._current = interpolate(0)
      return function (t) {
        var d2 = interpolate(t)
        var pos = outerArc.centroid(d2)
        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1)
        return 'translate(' + pos + ')'
      }
    })
    .styleTween('text-anchor', function (d) {
      this._current = this._current || d
      var interpolate = d3.interpolateObject(this._current, d)
      this._current = interpolate(0)
      return function (t) {
        var d2 = interpolate(t)
        return midAngle(d2) < Math.PI ? 'start' : 'end'
      }
    })

  text.exit()
    .remove()

  /* ------- SLICE TO TEXT POLYLINES -------*/

  var polyline = svg.select('.lines').selectAll('polyline')
    .data(pie(data), key)

  polyline.enter()
    .append('polyline')

  polyline.transition().duration(1000)
    .attrTween('points', function (d) {
      this._current = this._current || d
      var interpolate = d3.interpolateObject(this._current, d)
      this._current = interpolate(0)
      return function (t) {
        var d2 = interpolate(t)
        var pos = outerArc.centroid(d2)
        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1)
        return [arc.centroid(d2), outerArc.centroid(d2), pos]
      }
    })

  polyline.exit()
    .remove()

  console.log('done')
}
