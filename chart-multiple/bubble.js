// Sample Data
const sampleData =[
    {
      "name": "Cain",
      value: 129
    },
    {
      "name": "Seth",
      value: 29,
      "children": [
        {
          "name": "Enos",
          value: 22
        },
        {
          "name": "Noam",
          value: 9
        }
      ]
    },
    {
      "name": "Abel",
      value: 13
    },
    {
      "name": "Awan",
      value: 14,
      "children": [
        {
          "name": "Enoch",
          value: 1
        }
      ]
    },
    {
      "name": "Azura",
      value: 19
    }
  ]
class BubbleChart extends Chart {
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

  size (width = 960 , height = 500) {
    const margin = this.margin
    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom
    return this
  }

  update (data) {

  }

  draw (data = sampleData) {
    const svg = this.svg
    const width = this.width
    const height = this.height
    const format = d3.format(",d")
    const color = d3.scaleOrdinal(d3.schemeCategory20c)

    const dimension = Math.min(height, width)
    const pack = d3.pack()
    .size([dimension, dimension])
    .padding(1.5)

    const root = d3.hierarchy({children: data})
      .sum(function(d) { return d.value; })
      .each(function(d, i) {
        console.log(d, i)
        // if (id = d.data.id) {
        //   var id, i = id.lastIndexOf(".");
        //   d.id = id;
        //   d.package = id.slice(0, i);
        //   d.class = id.slice(i + 1);
        // }
      });
      console.log(pack(root).leaves())
    var node = svg.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function(d) { return d.data.name.toLowerCase(); })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.data.name); });

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.data.name.toLowerCase(); })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.data.name.toLowerCase(); });

    node.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.data.name.toLowerCase() + ")"; })
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .selectAll("tspan")
        .data(function (d) {
          return d.data.name.split(' ')
        })
        .enter()
        .append('tspan')
        .attr("x", 0)
      .text(function(d) { 
        console.log(d)
        return d; 
      })

    node.append("title")
        .text(function(d) { 
          console.log(d)
          return d.data.name //+ "\n" + format(d.value); 
        });
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
