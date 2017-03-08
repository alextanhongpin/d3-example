// Sample Data
// .area {
//   fill: steelblue;
//   clip-path: url(#clip);
// }

// .zoom {
//   cursor: move;
//   fill: none;
//   pointer-events: all;
// }
const sdata = [
  {
    date: new Date(2016, 0, 1),
    price: 100
  },
    {
    date: new Date(2016, 1, 1),
    price: 200
  },
    {
    date: new Date(2016, 2, 1),
    price: 213
  },
    {
    date: new Date(2016, 3, 1),
    price: -431
  },
    {
    date: new Date(2016, 4, 1),
    price: 546
  },
    {
    date: new Date(2016, 5, 1),
    price: 123
  },
    {
    date: new Date(2016, 6, 1),
    price: 234
  },
    {
    date: new Date(2016, 7, 1),
    price: 123
  }
]
class BrushChart extends Chart {
  constructor (props) {
    super(props)
  }

  get margin () {
    return {
      top: 20,
      right: 20,
      bottom: 110,
      left: 40
    }
  }

  get margin2 () {
    return {
      top: 430,
      right: 20,
      bottom: 30,
      left: 40,
    }
  }

  size (width = 960 , height = 500) {
    const margin = this.margin
    const margin2 = this.margin2
    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom
    this.height2 = height - margin2.top - margin2.bottom
    return this
  }

  update (data) {

  }

  draw (data=sdata) {
    const width = this.width
    const height = this.height
    const height2 = this.height2
    const svg = this.svg
    const margin = this.margin
    const margin2 = this.margin2
    
var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.price); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.price; }));
  // y.domain([0, d3.max(data, function(d) { return d.price; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2)

  svg.selectAll('.area').style('fill', 'steelblue')
      .style('clip-path', 'url(#clip)')

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .style('cursor', 'move')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom)


function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}
  }
  drawHTMLTooltip () {
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('width', '100px')
      .style('height', '24px')
      .style('line-height', '24px')
      .style('text-align', 'center')
      .style('border-radius', '5px')
      .style('box-shadow', '0 1px 5px rgba(0, 0, 0, .25)')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, .5)')
      .style('color', 'white')
      .text('a simple tooltip')
    return tooltip
  }
  drawTooltip (svg) {
    const tooltip = svg.append('g')
      .attr('class', 'tooltip')
      .append('text')
      .text('tooltip')
      .attr('transform', 'translate(100, 100)')
      .style('opacity', '0')
    return tooltip
  }

}
