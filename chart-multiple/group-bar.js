// var groupData = {
//   labels: [
//     'resilience', 'maintainability', 'accessibility',
//     'uptime', 'functionality', 'impact'
//   ],
//   series: [
//     {
//       label: '2012',
//       values: [4, 8, 15, 16, 23, 42]
//     },
//     {
//       label: '2013',
//       values: [12, 43, 22, 11, 73, 25]
//     },
//     {
//       label: '2014',
//       values: [31, 28, 14, 8, 15, 21]
//     }]
// }

class GroupBarChart extends Chart {
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
  /*
   * size() is a method to update the chart size
  **/
  size (width = 960 , height = 500) {
    const margin = this.margin
    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom
    return this
  }

  update (data) {

    if (!this.isDrawn) {
      super.destroy()
      this.draw(data)
      return false
    } 

    const g = this.g
    const x0 = this.x0
    const x1 = this.x1
    const y = this.y
    const color = this.color
    const xAxis = this.xAxis
    const yAxis = this.yAxis
    const height = this.height
    const width = this.width

      // update the domains
    x0.domain(data.labels)
    x1.domain(data.series.map(function(d) { return d.label })).rangeRound([0, x0.bandwidth()])
    y.domain([0, d3.max(data.series.reduce((arr, d) => {
      return arr.concat(d.values)
    }, []))])
    // Add new bars
      g.selectAll('.subgroup')
      .data(this.parseData(data))
      .attr('transform', function (d) {
        return `translate(${x0(d.label)}, 0)`
      })
      .selectAll('.bar')
      .data(function (d) {
        return d.value
      })
      .enter().append('rect')
      .attr('class', 'bar')
      .exit().remove()

    // Update existing bars
    const subgroup = g.selectAll('.subgroup')
      .data(this.parseData(data))
      .attr('transform', function (d) {
        return `translate(${x0(d.label)}, 0)`
      })
      .selectAll('.bar').data(function (d) {
        return d.value
      })

      subgroup.attr('width', x1.bandwidth())

      .attr('x', function (d) {
        console.log(x1(d.label))
        return x1(d.label)
      })
      .transition(750)
      .attr('y', function (d) {
        console.log(y(d.value))
        return y(d.value)
      })
      .attr('height', function (d) {
        console.log()
        return height - y(d.value)
      })
      .attr('fill', function (d) {
        return color(d.label)
      })
      g.selectAll('.subgroup')
      .data(this.parseData(data)).selectAll('.bar').data(function (d) {
        return d.value
      }).exit().remove()
  }

  draw (data) {
    // Cache the data to be reused
    this._data = data

    const svg = this.svg
    const height = this.height
    const width = this.width
    const margin = this.margin
    const { x0, x1, y, color, xAxis, yAxis } = this.drawAxes(data)

    // Set domain values
    x0.domain(data.labels)
    x1.domain(data.series.map(function(d) { return d.label })).rangeRound([0, x0.bandwidth()])
    y.domain([0, d3.max(data.series.reduce((arr, d) => { return arr.concat(d.values) }, []))])

    // Append chart group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Draw the x-axis
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)

    // Draw the y-axis
    g.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('font-size', '14px')
      .style('text-anchor', 'end')
      .style('fill', 'black')
      .text('Amount in MYR')

    // Draw the subgroups container
    const subgroup = g.selectAll('.subgroup')
      .data(this.parseData(data))
      .enter()
      .append('g')
      .attr('class', 'subgroup')
      .attr('transform', function (d) { return `translate(${x0(d.label)}, 0)` })

    // Draw the bars
    subgroup.selectAll('rect')
      .data(function (d) { return d.value })
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', x1.bandwidth())
      .attr('x', function (d) { return x1(d.label) })
      .attr('y', height)
      .transition(750)
      .duration(250)
      .attr('y', function (d) { return y(d.value) })
      .attr('height', function (d) { return height - y(d.value) })
      .attr('fill', function (d) { return color(d.label) })



      this.g = g
      this.x0 = x0
      this.x1 = x1
      this.y = y
      this.color = color
      this.xAxis = xAxis
      this.yAxis = yAxis
      this.isDrawn = true

      
      this.drawLegend(data)
  }

  /*
   * drawLegend() is a method to draw the chart legend
  **/
  drawLegend (data) {
    const width = this.width
    const height = this.height
    const svg = this.svg
    const color = this.color
    // Prepare the legend dataset
    const legendDataset = data.series.map((d) => {
      return {
        label: d.label,
        selected: false
      }
    })

    const legend = svg.selectAll('.legend')
      .data(legendDataset)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        return `translate(0, ${i * 20})`
      })

      const self = this
    legend.append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', function (d, i) {
        return color(d.label)
      })
      .attr('opacity', function (d, i) {
        if (d.selected) return .5
        return 1
      })
      .on('click', function (d, i) {
        console.log(d, i)

        legendDataset[i].selected = !legendDataset[i].selected

        d3.selectAll('.legend')
          .data(legendDataset).selectAll('rect').attr('fill', function (d, i) {
          return color(d.label)
        })
        .attr('opacity', function (d, i) {
          return d.selected ? 0.5 : 1
        })

        // Update the rect
        let updatedData = Object.assign({}, self._data )
        // remove the last one (for e.g.)
        const selection = legendDataset.filter((d) => {
          return d.selected
        }).map((d) => {
          return d.label
        })
        if (legendDataset[i].selected) {
          updatedData.series = updatedData.series.filter((m) => {
            return selection.indexOf(m.label) === -1
          })
        }
        self.update(updatedData)
        // Remove unused data
      })

    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function (d) { return d.label; })
  }

  drawAxes (data) {
    const height = this.height
    const width = this.width
    const svg = this.svg
    const margin = this.margin

    const x0 = d3.scaleBand().rangeRound([0, width]).padding(0.1)
    const x1 = d3.scaleBand()
    const y = d3.scaleLinear().range([height, 0])
    const color = d3.scaleOrdinal(d3.schemeCategory20)
    const xAxis = d3.axisBottom().scale(x0)
    const yAxis = d3.axisLeft().scale(y).tickFormat(d3.format('.2s'))

    return { x0, x1, y, color, xAxis, yAxis }
  }

  parseData (data) {
    let schema = []
    data.labels.map((label, index) => {
      schema.push({
        label: label,
        value: data.series.map((d, i) => {
          return {
            label: d.label,
            value: d.values[index]
          }
        })
      })
    })
    return schema
  }
}
