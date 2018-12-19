/*This file holds the logic to visualize the histograms for each type of value */
//translation of accronyms into real words.
const translation = {
  fld : "Feel like doing",
  rt : "Rest time",
  stress : "Stress",
  aot : "Amount of time",
  traded : "Tasks traded",
  brute_force : "Brute Forced"

};
//abreviation of type of agents.
const abrevation = {
  0 : "Cur.",
  1 : "Per.",
  2 : "Gen.",
  3 : "Cap."
};
//colors for the bars.
const colors=["#BD8C7D","#D1BFA7","#8E8E90","#49494B"];
class Histogram{
 /*
  * Constructs a histogram, should have in the args : data, width, height, svg, idx, type (of agent), margin.
  *
  */
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
                     .domain([0,1,2,3])//TODO AGENT_BEHAVIORS range
                     .range([0,this.width/6.0-(this.margin.left+this.margin.right)]);

   //seutp yScale
   //the offset is to have space for the names + category.
   let offset = 30;
   this.yScale = d3.scaleLinear()
                .domain([0,0])//at first its only zeroes but we will change the domain afterwards
                .range([this.height-offset*1.5,0]);


  //setup the axis
  this.yAxis = d3.axisLeft(this.yScale)
                    .ticks(4)
                    .tickFormat(d3.format(".0"));
  //setup the bar charts.
  let containerHeight = this.height;
  let containerWidth = this.width / 6.0;
  this.container = this.svg.append("g")
                      .attr("class",this.type)
                      .attr("height",containerHeight-offset*2)
                      .attr("transform","translate("+(containerWidth*this.idx)+","+offset+")");


  this.container.selectAll("rect")
                .data(this.data)
                .enter()
                .append("rect")
                .attr("transform","translate("+(this.margin.left)+",0)")
                .attr("x",(d,i)=>{
                  return this.xScale(i);
                })
                .attr("y",(d)=>{
                  return this.height-offset*2;
                })
                .attr("width",this.xScale.bandwidth())
                .attr("height",function(d){
                  return 0;//at first its 0..
                })
                .attr("fill",function(d,i){
                  return colors[i];

                })
                .on("mouseover",(d,i) => {
                  let m = d3.mouse((this.svg.node()));
                  let xP =m[0];
                  let yP = m[1];
                  let behavior = AGENT_BEHAVIORS[i];
                  d3.select("#tooltip")
                    .style("left",xP+"px")
                    .style("bottom","0px")
                    .text(digits(d));
                  //show
                  d3.select("#tooltip").classed("hidden",false);

                })
                .on("mouseout",() =>{
                  d3.select("#tooltip").classed("hidden",true);
                });
  // // //add the labels. ~~~ we dont do that its not that nice.
  // this.container.selectAll("text")
  //    .data(this.data)
  //    .enter()
  //    .append("text")
  //    .text(function(d,i){
  //      return abrevation[i];
  //    })
  //    .attr("text-anchor","middle")
  //    .attr("x",(d,i) => {
  //      return this.xScale(i)+this.xScale.bandwidth()/2;
  //    })
  //    .attr("y",(d) =>{
  //      return 0;
  //    })
  //    .attr("transform","translate("+(this.margin.left)+",0)")


     //add title
     this.svg.append("text")
                   .attr("class","type-title")
                   .attr("font-size","10px")
                   .attr("transform","translate("+(containerWidth*this.idx)+","+offset/2+")")
                   .text(translation[this.type]);
     //add the axis
     this.container.append("g")
        .attr("class","axis")
        .attr("transform","translate("+(this.margin.left)+",0)")
        .attr("y",this.height-offset*2)
        .call(this.yAxis);





 }

}

//a method when we have an update to update the taskValues
const digits = d3.format(".1");
/*
 * Updates the histogram according to the given data.
 *
 */
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
                  return this.yScale(d);
                })
                .attr("transform","translate("+(this.margin.left)+",0)")
                .attr("width",this.xScale.bandwidth()-(this.margin.left)/this.data.length)
                .attr("height",(d)=>{
                  return this.yScale(0) - this.yScale(d);
                });



   //add an axis.
   this.container.select("g.axis")
      .transition()
      .call(this.yAxis);


}
