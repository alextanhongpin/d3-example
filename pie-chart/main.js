class Labels {
  constructor (svg) {
    this.svg = svg
  }

  initWithClassName (className) {
    this.className = className
    // The labels and polyline are one set
    this.svg.append('g').attr('class', className)
    this.svg.append('g').attr('class', 'lines')
  }

  draw (data) {
    const svg = this.svg
    const radius = this.radius
    const key = function (d) {
      return d.data.label
    }

    var text = svg.select(`.${this.className}`).selectAll('text')
      .data(data, key)

    console.log('this.clasls', this.className)

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .text((d) => {
        console.log('TEXTENTER', d)
        return d.data.label
      })

    function midAngle (d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2
    }
    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8)
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

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    var polyline = svg.select('.lines').selectAll('polyline')
      .data(data, key)

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

    text.exit()
      .remove()
  }
}

class Pie {
  constructor (svg) {
    this.svg = svg
  }

  initWithClassName (className) {
    this.className = className
    this.svg.append('g').attr('class', className)
  }

  draw (data) {
    const radius = this.radius
    const key = function (d) {
      return d.data.label
    }
    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8)
    const slice = this.svg.select(`.${this.className}`)
      .selectAll('path.arc')

      .data(data, key)
      .enter()
      .append('g')
      .attr('class', 'arc')

    slice.append('path')
      .style('fill', (d) => {
        return this.color(d.data.label)
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
  }
}

class PieChart {
  constructor (width, height) {
    this.width = width
    this.height = height
    this.el = 'body'
  }

  // ComputeRadius() is a static method that returns
  // the radius of the pie chart based on the given
  // width and height
  static ComputeRadius (width, height) {
    const radius = Math.min(width, height) / 2
    return radius
  }

  // SVG() is a static method that appends a svg
  // to the body and with the populated attributes
  static SVG (el, width, height) {
    return d3.select(el).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
  }

  select (el) {
    this.el = el
    return this
  }

  init (data) {
    console.log('inint, ', data)
    const svg = PieChart.SVG(this.el, this.width, this.height)
    const radius = PieChart.ComputeRadius(this.width, this.height)
    console.log('RADIUS', radius)
    svg.attr('transform', `translate(${ this.width / 2 }, ${ this.height / 2 })`)
    const color = d3.scaleOrdinal()
      .domain(data)
      .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])

    // Initialize the labels
    this.labels = new Labels(svg)
    this.labels.color = color
    this.labels.radius = radius
    this.labels.initWithClassName('labels')
    // Append the group for the pie chart arcs
    this.pie = new Pie(svg)
    this.pie.color = color
    this.pie.radius = radius

    this.pie.initWithClassName('arcs')

    // Prepare the pie chart data
    this.svg = svg
    return this
  }

  test () {
    console.log('thistest')
    const labels = ['Lorem ipsum', 'dolor sit', 'amet', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt']
    const data = labels.map(function (label) {
      return { label: label, value: Math.random() }
    })
    console.log('data', data)
    this.init(data).draw(data)
  }

  draw (data) {
    if (!this.randomize) {
      const labels = ['Lorem ipsum', 'dolor sit', 'amet', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt']
      const data = labels.map(function (label) {
        return { label: label, value: Math.random() }
      })
      d3.select('.randomize').on('click', (evt) => {
        this.draw(data)
      })
    }
    const svg = this.svg
    const pie = d3.pie()
      .sort(null)
      .value((d) => {
        return d.value
      })

    /* ------- PIE SLICES -------*/
    this.pie.draw(pie(data))

    /* ------- TEXT LABELS -------*/
    this.labels.draw(pie(data))

  /* ------- SLICE TO TEXT POLYLINES -------*/
  }
}

const pieChart = new PieChart(960, 400)
pieChart.select('body').test()
// Parents have classnam

function parentsHaveClassName (node, className) {
  let parent = node
  while (parent && parent.parentNode) {
    if (parent.classList && parent.classList.contains(className)) {
      return true
    }
    parent = parent.parentNode
  }
  return false
}
