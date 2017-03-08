class PieChart extends Chart {
  constructor (props) {
    super(props)
    const margin = {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20
    }
    this._margin = margin
  }

  size (width = 960 , height = 500) {
    const margin = this._margin
    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom

    this._radius = Math.min(this.width, this.height) / 2
    return this
  }

  drawGroup (svg) {
    const g = svg.append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)
    return g
  }

  beforeUpdate (data) {
    const radius = this._radius

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius / 2)

    const pie = d3.pie()
      // Sort the pie chart by values (the greater one should 
      // appear on the right first)
      .sort((a, b) => {
        return b.value - a.value
      })
      .value(function (d) { return d.value })

    return { arc, pie}
  }

  update (data) {
    data = this.sortDataByValue(data)
    this._data = data
    const g = this.g
    const { arc, pie } = this.beforeUpdate(data)
    const svg = this.svg

    const color = d3.scaleOrdinal(d3.schemeCategory20).domain(data.map((d) => {
      return d.label
    }))

    // Append new paths if new data are added
    g.datum(data).selectAll('path')
      .data(pie)
      .enter().append('path')
      .attr('class', 'pie')
      .attr('d', arc)
      .exit().remove()
    // Add transition to the data
    g.datum(data).selectAll('.pie')
      .data(pie)
      .transition(750)
      .duration(250)
      .attrTween('d', this.arcTween(arc).bind(this))
      .attr('fill', function (d) {
        return color(d.data.label)
      })

    // Remove unused data
    g.selectAll('.pie').data(pie(data)).exit().remove()

    this.color = color
    this.drawLegend()
  }

  draw (data) {
  
    data = this.sortDataByValue(data)
    this._data = data
    const svg = this.svg
    const g = svg.append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)
      this.g = g
    const { arc, pie } = this.beforeUpdate(data)

    const color = d3.scaleOrdinal(d3.schemeCategory20).domain(data.map((d) => {
      return d.label
    }))

    // Draw the pie arcs and fill them
    g.datum(data).selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('class', 'pie')
      .attr('fill', function (d) {
        return color(d.data.label)
      })
      .attr('d', arc)
      .each((d, i) => {
        if (!this._current) this._current = {}
        this._current[i] = d
      })
    
    // Draw tooltip
    const tooltip = this.drawTooltip()
    this.tooltipTimeout = null
    const self = this

    // Bind events
    g.selectAll('.pie')
    .on('mouseenter', function (d) {
      // Apply hover effect
      d3.select(this)
      .transition(500)
      .duration(50)
      .attr('opacity', '.75')
    })
    .on('mousemove', function(d) {
      if (self.tooltipTimeout) {
        window.clearTimeout(self.tooltipTimeout)
        self.tooltipTimeout = null
      }
      // Apply tooltip
      tooltip
      .style('left', `${d3.event.pageX - 5}px`)
      .style('top', `${d3.event.pageY - 60}px`)
      .style('display', 'inline-block')
      .html(d.data.label + '<br/>' + d.data.value)
    })
    .on('mouseleave', function() {
      // Remove hover effect
      d3.select(this)
      .transition(500)
      .duration(50)
      .attr('opacity', '1')

      if (self.tooltipTimeout) {
        window.clearTimeout(self.tooltipTimeout)
        self.tooltipTimeout = null
      }
      self.tooltipTimeout = window.setTimeout(() => {
        // Apply tooltip
        tooltip
        .style('display', 'none')
      }, 150)
    })

    this.color = color
    // Draw legend
    this.drawLegend()
  }

  drawLegend () {
    const color = this.color
    const svg = this.svg
    const width = this.width
    const height = this.height

    const cellLength = color.domain().length
    const cellHeight = 16
    const cellWidth = 32
    const cellSpacing = 8

    const legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        const offsetHeight = height / 2 + i * (cellHeight + cellSpacing) - (cellLength * (cellHeight + cellSpacing) / 2)
        return `translate(${ width / 2 - cellWidth }, ${ offsetHeight })`
      });

    legend.append('rect')
        .attr('width', cellHeight)
        .attr('height', cellHeight)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', cellWidth)
        .attr('y', cellSpacing)
        .attr('alignment-baseline', 'center')
        .text(function(d) { return d; });
  }

  drawTooltip () {
    return d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('display', 'none')
    .style('background', 'White')
    .style('box-shadow', '-3px 3px 15px #888888')
    .style('padding', '5px')
    .style('text-align', 'center')
    .style('border-radius', '8px')
    .style('font-size', '12px')
    .text('Hello World')
  }

  arcTween (arc) {
    return function (d, index) {
      const i = d3.interpolateObject(this._current[index], d)
      this._current[index] = i(0)
      return function (t) {
        return arc(i(t))
      }
    }
  }

  sortDataByValue (data) {
    return data.sort((a, b) => {
      return b.value - a.value
    })
  }


}
