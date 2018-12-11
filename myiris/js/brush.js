
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
    console.log("w"+this.width);
    console.log("h"+this.height);

    this.xScale = d3.scaleLinear()
                   .range([0,this.width])
                   .domain([0,100]);

    this.xAxis = d3.axisBottom(this.xScale)
                   .tickSize(this.height)
                   .tickPadding(-10);
    this.area = d3.area()
                  .x(this.width)
                  .y0(this.height)
                  .y1(0)
                  .curve(d3.curveLinear);

    this.brush = d3.brushX()
                   .extent([
                     [this.xScale.range()[0],0],
                     [this.xScale.range()[1],this.height]
                   ])
                   .on("brush",brushing(this));

  this.context = this.svg.append("g")
                        .attr("class","brush");
                        // .attr("transform","translate(0,"+")");//check if need some translation..

   //add the axis
   // this.context.append("g")
   //             .attr("class","x axis top")
   //             .attr("transform","translate(0,120)")
   //             .call(this.xAxis);
  //add the brush
   this.context.append("g")
              .attr("class", "x brush")
              .attr("transform","translate(0,20)")
              .call(this.brush)
              .call(this.brush.move,this.xScale.range());
              // .selectAll("rect")
              // .attr("y",0)
              // .attr("height",this.height)
              // .attr("width",this.width);

    //add some flavor text.
    this.svg.append("text")
                .attr("transform","translate(0,120)")
                .text("Click and drag to zoom in or zoom out")


  }



}


function brushing(brush){
    console.log("brushing")
    console.log(brush);
    if(d3.event === null){
      return;
    }
    console.log(brush.xScale);

    let selection = d3.event.selection === null ? brush.xScale.domain() : d3.event.selection.map(brush.xScale.invert());
    console.log(selection);
    // brushing_charts(selection);
  }
