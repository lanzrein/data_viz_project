
class Brush{
  constructor(args){
    //setup the brush with initial values.
    console.log("hi!")
    this.first = true;
    this.width = args.width;
    this.height = args.height;
    this.svg = args.svg;
    this.margin = args.margin;
    this.plot = args.plot


    this.xScale = d3.scaleLinear()
                   .range([0,this.width-this.margin.left-this.margin.right])
                   .domain([0,100]);

    this.xAxis = d3.axisBottom(this.xScale)
                   .tickSize(this.height)
                   .tickPadding(-10);
    this.area = d3.area()
                  .x((this.width-this.margin.left-this.margin.right)/2)
                  .y0(this.height)
                  .y1(0)
                  .curve(d3.curveLinear);

    this.brush = d3.brushX()
                   .extent([
                     [this.xScale.range()[0],0],
                     [this.xScale.range()[1],this.height]
                   ]);
  this.context = this.svg.append("g")
                        .attr("class","brush")
                        .attr("transform","translate("+this.margin.left+",0)")
                        .on("click",brushing);//check if need some translation..

   //add the axis
   // this.context.append("g")
   //             .attr("class","x axis top")
   //             .attr("transform","translate(0,120)")
   //             .call(this.xAxis);
  //add the brush
   this.xbrushhandle = this.context.append("g")
              .attr("class", "x brush")
              .attr("transform","translate(0,20)")
              .call(this.brush);

              // .selectAll("rect")
              // .attr("y",0)
              // .attr("height",this.height)
              // .attr("width",this.width);

    //add some flavor text.
    this.svg.append("text")
                .attr("transform","translate(0,20)")
                .text("Brush around the line plot to uncover interesting areas ! ")


  }


  update_brush(scatter_xScale){
    //update the brush so that it reflects on the current plot.
    console.log(scatter_xScale.domain());
    this.xScale.domain(scatter_xScale.domain());

    // this.xAxis.call(this.xScale);

    this.area = d3.area()
                  .x((this.width-this.margin.left-this.margin.right)/2)
                  .y0(this.height)
                  .y1(0)
                  .curve(d3.curveLinear);


    this.brush.extent([
                     [this.xScale.range()[0],0],
                     [this.xScale.range()[1],this.height]
                   ])
              .on("brush",brushing)
              ;

    this.xbrushhandle.call(this.brush)
                     .call(this.brush.move,this.xScale.range());

    return ;
  }

}
