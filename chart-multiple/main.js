// Change to chart manager
class MultiChart {

  constructor (props) {
    this.bar = props.bar
    this.line = props.line
    this.pie = props.pie
    this.group = props.group
    this.area = props.area
    this.bubble = props.bubble
    this.brush = props.brush
  }

  // svg() is a method to append the svg to the target element
  svg (el) {
    this.svg = d3.select(el)
      .append('svg')
    return this
  }

  size (width = 960 , height = 500) {
    // Set the svg size
    this.svg.attr('width', width).attr('height', height)
    // Set the charts size
    this.bar.svg(this.svg).size(width, height)
    this.line.svg(this.svg).size(width, height)
    this.pie.svg(this.svg).size(width, height)
    this.group.svg(this.svg).size(width, height)
    this.area.svg(this.svg).size(width, height)
    this.bubble.svg(this.svg).size(width, height)
    this.brush.svg(this.svg).size(width, height)
    return this
  }

  setChart (chartType) {
    this.chartType = chartType
    switch (this.chartType) {
      case 'bar':
        this._chart = this.bar
        break
      case 'line':
        this._chart = this.line
        break
      case 'pie':
        this._chart = this.pie
        break
      case 'group':
        this._chart = this.group
        break
      case 'area':
        this._chart = this.area
        break
      case 'bubble':
        this._chart = this.bubble
        break
      case 'brush':
        this._chart = this.brush
        break
      default:
        this._chart = this.bar
    }
    return this
  }

  draw (data) {
    this._chart.draw(data)
    return this
  }

  update (data) {
    this._chart.update(data)
  }

  destroy () {
    this._chart.destroy()
  }
}
const data = [
  {
    value: 1,
    label: 'A'
  }, {
    value: 2.4,
    label: 'B'
  },
  {
    value: 1.5,
    label: 'C'
  },
  {
    value: 0.5,
    label: 'D'
  }
]

const mchart = new MultiChart({
  bar: new BarChart(), // initialize a new bar chart instance
  line: new LineChart(), // initialize a new line chart instance
  pie: new PieChart(),
  group: new GroupBarChart(),
  area: new AreaChart(),
  bubble: new BubbleChart(),
  brush: new BrushChart()
})
const ch = mchart.svg('body').size(640, 480)
ch.setChart('bar').draw(data)

d3.select('#bar').on('click', () => {
  mchart.destroy()
  const data = [
    {
      value: 1,
      label: 'A'
    }, {
      value: .5,
      label: 'B'
    },
    {
      value: 2.5,
      label: 'C'
    },
    {
      value: 1.5,
      label: 'D'
    }
  ]
  ch.setChart('bar').draw(data)
})
d3.select('#barUpdate').on('click', () => {

  const data = [
    {
      value: 4,
      label: 'A'
    }, {
      value: 2.5,
      label: 'B'
    },
    {
      value: .5,
      label: 'C'
    },
    {
      value: 2.5,
      label: 'D'
    }
  ]
  ch.setChart('bar').update(data)
})

d3.select('#line').on('click', () => {
  mchart.destroy()
  const data = [
    {
      value: .2,
      label: new Date(2016, 1, 1)
    }, {
      value: .5,
      label: new Date(2016, 2, 1)
    },
    {
      value: 2.5,
      label: new Date(2016, 2, 23)
    },
    {
      value: 1.5,
      label: new Date(2016, 4, 21)
    }
  ]
  ch.setChart('line').draw(data)
})
d3.select('#lineUpdate').on('click', () => {

  const data = [
    {
      value: 4.2,
      label: new Date(2016, 1, 1)
    }, {
      value: 3.5,
      label: new Date(2016, 2, 1)
    },
    {
      value: 6.5,
      label: new Date(2016, 2, 23)
    },
    {
      value: 2.5,
      label: new Date(2016, 6, 21)
    },
    {
      value: 5.5,
      label: new Date(2016, 8, 21)
    },
    {
      value: 1.5,
      label: new Date(2016, 8, 23)
    }
  ]
  ch.setChart('line').update(data)
})

d3.select('#pie').on('click', () => {
  mchart.destroy()
  const data = [
    {
      value: 5,
      label: 'A'
    }, {
      value: 2.5,
      label: 'B'
    },
    {
      value: 1.5,
      label: 'C'
    },
    {
      value: 6.5,
      label: 'D'
    }
  ]
  ch.setChart('pie').draw(data)
})

d3.select('#pieUpdate').on('click', () => {

  const data = [
    {
      value: 2,
      label: 'A'
    }, {
      value: 6.5,
      label: 'B'
    },
    {
      value: 12.5,
      label: 'C'
    },
    {
      value: 9.5,
      label: 'D'
    },
    {
      value: 10.0,
      label: 'E'
    }
  ]
  ch.setChart('pie').update(data)
})

d3.select('#group').on('click', () => {
  mchart.destroy()
  const data = {
    labels: [
      'resilience', 'maintainability', 'accessibility',
      'uptime', 'functionality', 'impact'
    ],
    series: [
      {
        label: '2012',
        values: [4, 8, 15, 16, 23, 42]
      },
      {
        label: '2013',
        values: [12, 43, 22, 11, 73, 25]
      },
      {
        label: '2014',
        values: [31, 28, 14, 8, 15, 21]
      }]
  }
  ch.setChart('group').draw(data)
})


d3.select('#area').on('click', () => {
  mchart.destroy()
  const data = [
    {
      value: 5,
      label: 1
    }, {
      value: 2.5,
      label: 2
    },
    {
      value: 1.5,
      label: 3
    },
    {
      value: 6.5,
      label: 4
    }
  ]
  ch.setChart('area').draw(data)
})

d3.select('#areaUpdate').on('click', () => {

  const data = [
    {
      value: 2,
      label: 1
    }, {
      value: 6.5,
      label: 2
    },
    {
      value: 12.5,
      label: 3
    },
    {
      value: 9.5,
      label: 4
    },
    {
      value: 10.0,
      label: 5
    },
    {
      value: 4.0,
      label: 6
    },
    {
      value: 12.0,
      label: 7
    }
  ]
  ch.setChart('area').update(data)
})


d3.select('#bubble').on('click', () => {  
  mchart.destroy()
  ch.setChart('bubble').draw()
})
d3.select('#brush').on('click', () => {  
  mchart.destroy()
  ch.setChart('brush').draw()
})