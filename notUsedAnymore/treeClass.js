class treeClass {
  constructor (_parent, _props, _data) {
    this.parent = _parent
    this.props = {
      data: _props.data,
      margin: _props.margin,
      index: _props.index,
      artists: _props.artists,
    }
    const { x, y, width, height } = this.parent
    .node()
    .getBoundingClientRect();


    this.width = width;
    this.height = height;

  }

  initVis() {
    let vis = this;
    
    const innerWidth =
      vis.width - vis.props.margin.left - vis.props.margin.right;
    const innerHeight =
      vis.height - vis.props.margin.top - vis.props.margin.bottom;

    const g = this.parent.append('g')

    const dataWithoutMen = this.props.data.filter(d => d.gender == 'f')

    // // 1. Group the data per festival, per year the then per stage name
    const group = d3.group(
        dataWithoutMen,
        d => d.festival,
        d => d.city,
        d => d.year, 
     )

    // // 2. Change the structure to a hierarchy structure
    const treeData = d3.hierarchy(group)

    const chart = g
        .attr('id', 'tree')
        .attr('transform', `translate(${this.props.margin.left},${this.props.margin.top})`)

    const treeLayout = d3.tree().size([innerWidth, innerHeight])
    const links = treeLayout(treeData).links()

    function elbow(d, i) {
        return "M" + d.source.x + "," + d.source.y
            + "V" + d.target.y + "H" + d.target.x
            + (d.target.children ? "" : ("v"))
    }

    // rectangle 
    var rectangle = chart
                        .append('rect')
                        .attr('class', 'scroll-rectangle')
                        .attr('width', innerWidth)
                        .attr('height', innerHeight / 10)
                        .attr('y', -10);

    // Create one path per link
    var link = chart
        .selectAll('.edge')
        .data(links)
        .join('path')
        .attr('class', 'link')
        .attr('d', elbow);

    var nodesGroup = chart
        .selectAll('.node')
        .data(treeData.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('x', d => d.x)
        .attr('y', d => d.y);

    nodesGroup
        .append('circle')
        .attr('class', 'node-circle')
        .attr('r', d => 2)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

  }

  /**
   * updateVis(): Class method to update visualisation
   */
  updateVis() {
    let vis = this;

    const mapIndexToColor = ['pink', 'green', 'yellow', 'blue', 'red', 'orange']

    var rectangle = vis.parent
                        .selectAll('rect.scroll-rectangle')
                        .transition()
                        .ease(d3.easeCubicOut)
                        .duration(300)
                        .style("fill", mapIndexToColor[this.props.index])
                        .attr(
                          'transform',
                          `translate(${0},${this.props.index * innerHeight/6.5})`
                        )
                        .transition();
    
    this.parent.selectAll('circle').transition().duration(1000).attr('r', d => this.props.artists.includes(d.data.stage_name) ? 10: 2)

  }
}