// We need to have the data collected by the underyling model.
const historicDiv = document.getElementById("currentsituation");
const margin = {
  top:30,
  right : 20,
  bottom : 150,
  left : 20},
  width = historicDiv.clientWidth-40,
  height = historicDiv.clientHeight*0.2,
  contextHeight = 50,
  contextWidth = width;



console.log("w " + width);
console.log("h " + height);

const svg = d3.select("#currentsituation")
                .append("svg")
                .attr("width",width+margin.left+margin.right)
                .attr("height",height*5+margin.top+margin.bottom);
// scale will be first of length 200 but then we
//need to add the option to slide it.


const outputs = ["fld","rt","stress","aot","traded","brute_force"];


const xScale = d3.scaleBand()
                  .domain([0,1,2,3])
                  .range([0,width-(margin.left+margin.right)]);
                  //here we can use + instead of - to have larger bands..
const yScale = d3.scaleLinear()
              .domain([0,0])
              .range([height,0]);


let data_by_type  = {
  fld : [0,0,0,0],
  rt : [0,0,0,0],
  stress : [0,0,0,0],
  aot : [0,0,0,0],
  traded : [0,0,0,0],
  brute_force : [0,0,0,0]
}
//setup the iris model.
// it is already defined in the sketch.js file as irisModel.
function setup_iris(){


  const yAxis = d3.axisLeft(yScale)
                  .ticks(4)
                  .tickFormat(d3.format(".0s"));
 let idx = 0;
  for (const type of outputs){
    //for each type of output prepare the graph.
    data = data_by_type[type];
    yScale.domain([0,d3.max(data)]);
    const yAxis = d3.axisLeft(yScale)
                    .ticks(4)
                    .tickFormat(d3.format(".0s"));
    svg.append("g")
      .attr("id",type)
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class","stress")
      .attr("transform","translate("+(margin.left)+","+idx * height+")")
      .attr("x",function(d,i){
        return xScale(i);
      })
      .attr("y",function(d){
        return height + idx *height;
      })
      .attr("width",xScale.bandwidth())
      .attr("height",function(d){
        return 0;
      })
      .attr("fill",function(d){
        return "rgb("+(d*255/100)+",0,0)";
      });

      //add values number to make it more readable
      svg
         .selectAll("text")
         .data(data)
         .enter()
         .append("text")
         .text(function(d){
           return d;
         })
         .attr("text-anchor","middle")
         .attr("x",function(d,i){
           return xScale(i)+xScale.bandwidth()/2;
         })
         .attr("y",function(d){
           return idx *height+height+margin.top;
         })
         .attr("transform","translate("+(margin.left)+","+idx * height+")")

         .attr("font-family","sans-serif")
         .attr("font-size","11px")
         .attr("fill","white");

         svg.append("g")
            .attr("class","axis")
            .attr("transform","translate("+(margin.left)+","+ (margin.top+ idx*(height+margin.top))+")")
            .attr("y",height+(margin.top))
            .attr("fill","#fff")
            .call(yAxis);


        idx++;



}

}

var cnt = 0
function tick(){

  if (cnt > 200 ){
    return ;
  }
  //represents a tick in the simulation. will need to update :
  //model, graphs.

  //update model
  irisModel.update();

  cnt++;

  //update the current situation
  compute_new_medians();
  //paint the histogram if there is a change.
  histograms(data_by_type);


  //update the historic historic






}
const digits = d3.format(".3");

function compute_new_medians(){
  //we can use a hacked version of the show method to get the values.
  medianValuesByBehavior = irisModel.show();

  data_by_type = {
    fld : [],
    rt : [],
    stress : [],
    aot : [],
    traded : [],
    brute_force : []
  };

  for ( const behavior of AGENT_BEHAVIORS){
    //by behavior get the medians
    medians = medianValuesByBehavior[behavior];
    //note medians is an array and you can access for example stress value by doing medians[stress]

    for (const type of outputs){
      let med =  0;
      if (!(medians === undefined )){
        med = d3.mean(medians[type]);
        if (med === undefined){
          med =  0;
        }
      }
      data_by_type[type].push(med);

    }
  }
}

function histograms(){


    let idx = 0;
    for (const type of outputs){
      let data = data_by_type[type];
      yScale.domain([0,d3.max(data)]);
      svg.select("g")
        .selectAll("rect")
        .data(data)
        .transition()
        .attr("x",function(d,i){
          return xScale(i);
        })
        .attr("y",function(d){
          return yScale(d)+margin.top;
        })
        .attr("transform","translate("+(margin.left)+",0)")
        .attr("width",xScale.bandwidth()-(margin.left)/data.length)
        .attr("height",function(d){
          return yScale(0) - yScale(d);
        })
        .attr("fill",function(d){
          return "rgb("+(d*255.0/100)+",0,0)";
        });

      //add values number to make it more readable
      svg.selectAll("text")
         .data(data)
         // .transition()

         .text(function(d){
           return digits(d);
         })
         // .attr("text-anchor","middle")
         .attr("x",function(d,i){
           return xScale(i)+xScale.bandwidth()/2;
         })
         .attr("y",function(d){
           return height+idx*height+margin.top;
         });



       const yAxis = d3.axisLeft(yScale)
                        .ticks(3);
                       // .tickFormat(d3.format(".0s"));;

       //add an axis.
       svg.select("g.axis")
          // .selectAll(".axis")
          .transition()
          .attr("transform","translate("+(margin.left)+","+ (margin.top+ idx*(height+margin.top))+")")
          .attr("y",height*idx+margin.top)
          .call(yAxis);


        idx++;

      }



}
