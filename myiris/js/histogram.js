/*This file holds the logic to visualize the histograms for each type of value */

const translation = {
  fld : "Feel like doing",
  rt : "Rest time",
  stress : "Stress",
  aot : "Amount of time",
  traded : "Tasks traded",
  brute_force : "Brute Forced"

};

class Histogram{
 constructor(args){
   //the args should be given in correct order.
   this.data = args.data;
   this.width = args.width;
   this.height = args.height;
   this.svg = args.svg;
   this.idx = args.idx;
   this.type = args.type;
   this.margin = args.margin;//margin = {left,top,bottom,right}

   //setup xScale
   this.xScale = d3.scaleBand()
                     .domain([0,1,2,3])
                     .range([0,this.width-(this.margin.left)]);

   //seutp yScale
   this.yScale = d3.scaleLinear()
                .domain([0,0])//at first its only zeroes but we will change the domain afterwards
                .range([this.height,0]);


  //setup the axis
  this.yAxis = d3.axisLeft(this.yScale)
                    .ticks(4)
                    .tickFormat(d3.format(".0s"));
  //setup the bar charts.
  let containerHeight = this.height + this.margin.top + this.margin.bottom;
  this.container = svg.append("g")
                      .attr("class",this.type)
                      .attr("transform","translate(0,"+(containerHeight*this.idx+margin.top+margin.bottom)+")");


  this.container.selectAll("rect")
                .data(this.data)
                .enter()
                .append("rect")
                .attr("transform","translate("+(this.margin.left)+",0)")
                .attr("x",(d,i)=>{
                  return this.xScale(i);
                })
                .attr("y",(d)=>{
                  return this.height;
                })
                .attr("width",this.xScale.bandwidth())
                .attr("height",function(d){
                  return 0;//at first its 0..
                })
                .attr("fill",function(d){
                  return "rgb("+(d*255/100)+",0,0)";
                })
                .on("mouseover",(d,i) => {
                  let xP = this.xScale(i);
                  let yP = this.height*this.idx+this.height/2;
                  let behavior = AGENT_BEHAVIORS[i];
                  d3.select("#tooltip")
                    .style("right",xP+"px")
                    .style("top",yP+"px")
                    .text("Agent type : " +behavior);
                  //show
                  d3.select("#tooltip").classed("hidden",false);

                })
                .on("mouseout",() =>{
                  d3.select("#tooltip").classed("hidden",true);
                });
  // //add the labels.
  this.container.selectAll("text")
     .data(this.data)
     .enter()
     .append("text")
     .text(function(d){
       return d;
     })
     .attr("text-anchor","middle")
     .attr("x",(d,i) => {
       return this.xScale(i)+this.xScale.bandwidth()/2;
     })
     .attr("y",(d) =>{
       return this.height+this.margin.bottom;
     })
     .attr("transform","translate("+(this.margin.left)+",0)")

     .attr("font-family","sans-serif")
     .attr("font-size","11px")
     .attr("fill","black");


     //add title
     this.container.append("text")
                   .attr("class","type-title")
                   .attr("transform","translate(10,-10)")
                   .text(translation[this.type]);



     //add the axis
     this.container.append("g")
        .attr("class","axis")
        .attr("transform","translate("+(this.margin.left)+",0)")
        .attr("y",this.height+(this.margin.top))
        .attr("fill","#fff")
        .call(this.yAxis);





 }

}

//a method when we have an update to update the taskValues
const digits = d3.format(".2");

Histogram.prototype.update = function(data){
  this.data = data;
  this.yScale.domain([0,d3.max(data)]);


  this.container.selectAll("rect")
    .data(data)
    .transition()
    .attr("x",(d,i)=>{
      return this.xScale(i);
    })
    .attr("y",(d) => {
      // return 0;
      return this.yScale(d);
    })
    .attr("transform","translate("+(this.margin.left)+",0)")
    .attr("width",this.xScale.bandwidth()-(this.margin.left)/this.data.length)
    .attr("height",(d)=>{
      return this.yScale(0) - this.yScale(d);
    })
    .attr("fill",function(d){
      return "rgb("+(d*255.0/100)+",0,0)";
    })


  //add values number to make it more readable
  this.container.selectAll("text")
     .data(data)
     .text(function(d){
       return digits(d);
     })


   //add an axis.
   this.container.select("g.axis")
      .transition()
      .attr("transform","translate("+(this.margin.left)+",0)")
      .attr("y",this.margin.top)
      .call(this.yAxis);


}

function hist_click(data,type) {
  console.log("Click on value " + data +" of type "+type);

}
