class Chart {
  constructor () {}

  draw () {
    throw new Error('ChartError: Write your own implementation of the draw method here')
  }

  update () {
    throw new Error('ChartError: Write your own implementation of the update method here')
  }

  drawAxes () {
    throw new Error('ChartError: Write your own implementation of the drawAxes method here')
  }
  parseData () {
    throw new Error('ChartError: Write your own implementation of the parseData method here')
  }
  svg (svg) {
    if (!svg) {
      throw new Error('ChartError: svg is not defined')
    }
    this.svg = svg
    return this
  }

  size (width = 960 , height = 500) {
    this.width = width
    this.height = height
    return this
  }
  destroy () {
    d3.select('svg').selectAll('*').remove()
  }
}
