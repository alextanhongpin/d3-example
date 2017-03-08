// Imagine how the data are structured

const data = [
  {
    label: 'Jan',
    type: {
      income: 11,
      expense: 20
    }
  },
  {
    label: 'Feb',
    type: {
      income: 21,
      expense: 33
    }
  },
  {
    label: 'Mar',
    type: {
      income: 2,
      expense: 11
    }
  },
  {
    label: 'Apr',
    type: {
      income: 38,
      expense: 11
    }
  }
]

const updatedData = [
  {
    label: 'Jan',
    type: {
      income: 59,
      expense: 10
    }
  },
  {
    label: 'Feb',
    type: {
      income: 2,
      expense: 93
    }
  },
  {
    label: 'Mar',
    type: {
      income: 25,
      expense: 1
    }
  },
  {
    label: 'Apr',
    type: {
      income: 38,
      expense: 90
    }
  }
]

class GroupedBarChart {
  constructor (props) {
    this.width = 960
    this.height = 500
    this.margin = {
      top: 20,
      left: 40,
      bottom: 30,
      right: 20
    }
    this.colors = ['#98abc5', '#8a89a6']
    // Don't store the data here
    this.data = []
    this.el = 'body'
    Object.assign(this, props)
  }

  prepareScales () {
    this.labels = Object.keys(this.data[0].type)
    this.barWidth = this.width - this.margin.left - this.margin.right
    this.barHeight = this.height - this.margin.top - this.margin.bottom

    this.x0 = d3.scaleBand().range([0, this.barWidth], 0.1)
    this.x1 = d3.scaleBand()
    this.y = d3.scaleLinear().range([this.barHeight, 0])
    this.color = d3.scaleOrdinal().range(this.colors).domain(this.labels)
    this.xAxis = d3.axisBottom().scale(this.x0)
    this.yAxis = d3.axisLeft().scale(this.y).tickFormat(d3.format('.2s'))
  }

  appendSvg () {
    const svg = d3.select(this.el).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    this.svg = svg
  }

  prepareData () {
    if (!this.data) throw new Error('Require data to work')
    const months = this.data.map((m) => {
      return m.label
    })

    const maxY = this.data.reduce((max, m) => {
      return Math.max(max, Math.max(m.type.income, m.type.expense))
    }, 0)

    this.x0.domain(months)
    this.x1.domain(this.labels).range([0, this.x0.step()])
    this.y.domain([0, maxY])
  }

  draw () {
    this.prepareScales()
    this.appendSvg()
    this.prepareData()
    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${ this.height })`)
      .call(this.xAxis)

    // Y-Axis Label
    this.svg.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Population')

    const month = this.svg.selectAll('.month')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'month')
      .attr('transform', (d) => {
        return `translate(${this.x0(d.label)}, 0)`
      })

    month.selectAll('rect')
      .data((d) => {
        // Must be an array
        return [d.type.income, d.type.expense]
      })
      .enter()
      .append('rect')
      .attr('width', this.x1.step())
      .attr('x', (d, i) => {
        return this.x1(this.labels[i])
      })
      .attr('y', this.barHeight)
      .attr('height', 0)
      .transition()
      .delay(500)
      .attr('y', (d, i) => {
        return this.y(d)
      })
      .attr('height', (d, i) => {
        return this.barHeight - this.y(d)
      })
      .style('fill', (d, i) => {
        return this.color(this.labels[i])
      })

    const legend = this.svg.selectAll('.legend')
      .data(this.labels)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) { return 'translate(0,' + i * 20 + ')'; })

    legend.append('rect')
      .attr('x', this.width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', this.color)

    legend.append('text')
      .attr('x', this.width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function (d) { return d; })
  }

  update () {
    this.prepareData()
    this.svg.select('.x.axis')
      .transition(750)
      .call(this.xAxis)
    this.svg.select('.y.axis')
      .transition(750)
      .call(this.yAxis)

    const month = this.svg.selectAll('.month')
      .attr('transform', (d) => {
        return `translate(${this.x0(d.label)}, 0)`
      })

    month.selectAll('rect')
      .attr('width', this.x1.step())
      .attr('x', (d, i) => {
        return this.x1(this.labels[i])
      })
      .transition(750)
      // .attr('transform', (d) => {
      //   return `translate(0, ${-y(d)})`
      // })
      .attr('y', (d, i) => {
        return this.y(d)
      })
      .attr('height', (d, i) => {
        return this.barHeight - this.y(d)
      })
      .style('fill', (d, i) => {
        return this.color(this.labels[i])
      })
  }
  destroy () {}
}
const c = new GroupedBarChart({
  data: data
})
c.draw()

setTimeout(() => {
  c.data = updatedData
  c.update()
}, 1500)
