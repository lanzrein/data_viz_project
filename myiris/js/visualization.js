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


  //for every agent we need to have them recording at all time. but we will not save the output -> TODO later maybe ?
  // for (const agent of irisModel.agents) {
  //     agent.data = []; // empty the data set
  //     agent.recordData = true;
  // }

  //we also need to setup the histograms here so we can have transitions after.
  //here we use a dummy data..
  // data = [0,0,0,0]

  const yAxis = d3.axisLeft(yScale)
                  .ticks(4)
                  .tickFormat(d3.format(".0s"));
 let idx = 0;
  for (const type of outputs){
    //for each type of output prepare the graph.
    console.log("idx : " + idx)
    data = data_by_type[type];
    yScale.domain([0,d3.max(data)]);
    const yAxis = d3.axisLeft(yScale)
                    .ticks(4)
                    .tickFormat(d3.format(".0s"));
    svg.append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("transform","translate("+(margin.left)+","+idx * height+")")
      .attr("x",function(d,i){
        return xScale(i);
      })
      .attr("y",function(d){
        return height + idx *height;
      })
      .attr("width",xScale.bandwidth())
      .attr("height",function(d){
        return yScale(d);
      })
      .attr("fill",function(d){
        return "rgb("+(d*255/100)+",0,0)";
      });

      //add values number to make it more readable
      svg.append("t")
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
           return height+ idx *height;
         })
         .attr("transform","translate("+(margin.left)+","+idx * height+")")

         .attr("font-family","sans-serif")
         .attr("font-size","11px")
         .attr("fill","black");

         svg.append("g")
            .attr("class","y axis")
            .attr("transform","translate("+(margin.left)+","+idx * height+")")
            .attr("y",height-(margin.top))
            .attr("fill","#000")
            .call(yAxis);


        idx++;



}
  // svg.selectAll("rect")
  //   .data(data)
  //   .enter()
  //   .append("rect")
  //   .attr("transform","translate("+(margin.left)+",0)")
  //   .attr("x",function(d,i){
  //     return xScale(i);
  //   })
  //   .attr("y",function(d){
  //     return height;
  //   })
  //   .attr("width",xScale.bandwidth())
  //   .attr("height",function(d){
  //     return yScale(d);
  //   })
  //   .attr("fill",function(d){
  //     return "rgb("+(d*255/100)+",0,0)";
  //   });
  //
  //   //add values number to make it more readable
  //   svg.selectAll("text")
  //      .data(data)
  //      .enter()
  //      .append("text")
  //      .text(function(d){
  //        return d;
  //      })
  //      .attr("text-anchor","middle")
  //      .attr("x",function(d,i){
  //        return xScale(i)+xScale.bandwidth()/2;
  //      })
  //      .attr("y",function(d){
  //        return height;
  //      })
  //      .attr("transform","translate("+(margin.left)+",0)")
  //
  //      .attr("font-family","sans-serif")
  //      .attr("font-size","11px")
  //      .attr("fill","black");
  //
  //      svg.append("g")
  //         .attr("class","y axis")
  //         .attr("transform","translate("+(margin.left)+",0)")
  //         .attr("y",height-(margin.top))
  //         .attr("fill","#000")
  //         .call(yAxis);



}

var cnt = 0
function tick(){

  // if (cnt > 400 ){
  //   return ;
  // }
  //represents a tick in the simulation. will need to update :
  //model, graphs.

  //update model
  irisModel.update();

  cnt++;
  //update the current situation

  //we can use a hacked version of the show method to get the values.
  medianValuesByBehavior = irisModel.show();
  const stress_data = [];
  for ( const behavior of AGENT_BEHAVIORS){
    //by behavior get the medians
    medians = medianValuesByBehavior[behavior];
    //note medians is an array and you can access for example stress value by doing medians[stress]
    med = 0
    //to
    if (!(medians === undefined )){
      med = d3.mean(medians["aot"]);
      if (med === undefined){
        med =  0;
      }
    }
    stress_data.push(med);

  }

  if (!data.equals(stress_data)){
    histogram(stress_data);
    data = stress_data;
  }


  //update the historic historic






}


function histogram(data){


    // var yAxis = d3.axisLeft(yScale);

    //update the scales
    // xScale.domain([d3.range(data.length)]);
    yScale.domain([0,d3.max(data)]);
    svg.selectAll("rect")
      .data(data)
      .transition()
      // .append("rect")
      .attr("x",function(d,i){
        return xScale(i);
      })
      .attr("y",function(d){
        return yScale(d);
      })
      .attr("transform","translate("+(margin.left)+",0)")
      .attr("width",xScale.bandwidth()-(margin.left)/data.length)
      .attr("height",function(d){
        // console.log("h = " + d)
        return yScale(0) - yScale(d);
      })
      .attr("fill",function(d){
        return "rgb("+(d*255.0/100)+",0,0)";
      });

      //add values number to make it more readable
      svg.selectAll("text")
         .data(data)
         .transition()

         .text(function(d){
           return digits(d);
         })
         .attr("text-anchor","middle")
         .attr("x",function(d,i){
           return xScale(i)+xScale.bandwidth()/2;
         })
         .attr("transform","translate("+(margin.left)+",0)")

         .attr("y",function(d){
           return height;
         })
         .attr("font-family","sans-serif")
         .attr("font-size","11px")
         .attr("fill","white");
         const yAxis = d3.axisLeft(yScale)
                          .ticks(3);
                         // .tickFormat(d3.format(".0s"));;

         //add an axis.
         svg.select("g")
            .transition()

            .attr("transform","translate("+(margin.left)+",0)")
            .attr("y",height)
            .call(yAxis);


}

const digits = d3.format(".3");
