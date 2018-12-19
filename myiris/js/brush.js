/**
 * Class to create brushes for our visualization. They can be used tozoom in
 * and focus on a specific part of the line plot..
 */
class Brush{
  constructor(args){
    //setup the brush with initial values.
    this.first = true;
    this.width = args.width;
    this.height = args.height;
    this.svg = args.svg;
    this.margin = args.margin;
    this.plot = args.plot


    this.xScale = d3.scaleLinear()
                   .range([0,this.width-this.height-40])
                   .domain([0,data_per_agent[0]["fld"]]);

    this.xAxis = d3.axisBottom(this.xScale)
                   .ticks(5)
                   .tickSize(this.height/2)
                   .tickPadding(0);
    this.area = d3.area()
                  .x(0)
                  .y0(this.height/3)
                  .y1(0)
                  .curve(d3.curveLinear);

    this.brush = d3.brushX()
                   .extent([
                     [this.xScale.range()[0],0],
                     [this.xScale.range()[1],this.height]
                   ]).on("brush",brushing);






  this.context = this.svg.append("g")
                        .attr("class","brush")
                        .attr("transform","translate("+this.height+",0)")
  //add axis..
  this.context.append("g")
              .attr("class","xaxis")
              .attr("transform","translate(0,"+this.height+")")
              .call(this.xAxis);


  //add the brush
   this.xbrushhandle = this.context.append("g")
              .attr("class", "x brush")
              .call(this.brush)
              .attr("fill","#CCCC99");

  //this is for custom handles.. they are not necessary but make it easier to see there is a
  //brush.
  this.handle = this.xbrushhandle.selectAll(".handle--custom")
                      .data([{type: "w"}, {type: "e"}])
                      .enter()
                      .append("path")
                      .attr("class", "handle--custom")
                      .attr("fill", "#666")
                      .attr("fill-opacity", 0.8)
                      .attr("stroke", "#fff")
                      .attr("stroke-width", 1.5)
                      .attr("cursor", "ew-resize")
                      .attr("transform","translate("+this.width/2+","+this.height/2+")")
                      .attr("d", d3.arc()
                          .innerRadius(0)
                          .outerRadius(this.height/2)
                          .startAngle(0)
                          .endAngle(function(d, i) { return i ? Math.PI : -Math.PI; }));




  }

  /**
   * Update the brush according to the scatter_xScale.
   */
  update_brush(scatter_xScale){
    //update the brush so that it reflects on the current plot.
    this.xScale.domain(scatter_xScale.domain());

    this.context.select(".xaxis").call(this.xAxis);

    return ;
  }

}
