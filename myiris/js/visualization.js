// We need to have the data collected by the underyling model.
const test = -1
// scale will be first of length 200 but then we
//need to add the option to slide it.
const h = 200;
const w = 300;
const paddingX = 50;
paddingY = 20;


const svg = d3.select("body")
              .append("svg")
              .attr("width",w)
              .attr("height",h);

const xScale = d3.scaleBand()
                  .domain([0,1,2,3])
                  .range([0,w-paddingX]);

const yScale = d3.scaleLinear()
              .domain([0,0])
              .range([h-paddingY,0]);


let data = [0,0,0,0];
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
  yScale.domain([0,d3.max(data)]);

  const yAxis = d3.axisLeft(yScale)
                  .ticks(4)
                  .tickFormat(d3.format(".0s"));


  // let svg = d3.select("body")
  //   .append("svg")
  //   .attr("width",w)
  //   .attr("height",h);
  // console.log("data : " +data)
  svg.attr("transform","translate(50,50)")
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("transform","translate("+paddingX+",0)")
    .attr("x",function(d,i){
      return xScale(i);
    })
    .attr("y",function(d){
      return h;
    })
    .attr("width",xScale.bandwidth())
    .attr("height",function(d){
      return yScale(d)-paddingY;
    })
    .attr("fill",function(d){
      return "rgb("+(d*10)+",0,0)";
    });

    //add values number to make it more readable
    svg.selectAll("text")
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
         return h;
       })
       .attr("transform","translate("+paddingX+",0)")

       .attr("font-family","sans-serif")
       .attr("font-size","11px")
       .attr("fill","black");

       svg.append("g")
          .attr("class","y axis")
          .attr("transform","translate("+paddingX+",0)")
          .attr("y",h-paddingY)
          .attr("fill","#000")
          .call(yAxis);



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
    med = d3.mean(medians["stress"]);
    if (med === undefined){
      med =  0;
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
      .attr("transform","translate("+paddingX+",0)")
      .attr("width",xScale.bandwidth()-paddingX/data.length)
      .attr("height",function(d){
        // console.log("h = " + d)
        return yScale(0) - yScale(d);
      })
      .attr("fill",function(d){
        return "rgb("+(d*25/255)+",0,0)";
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
         .attr("transform","translate("+paddingX+",0)")

         .attr("y",function(d){
           return h;
         })
         .attr("font-family","sans-serif")
         .attr("font-size","11px")
         .attr("fill","black");
         const yAxis = d3.axisLeft(yScale)
                          .ticks(3);
                         // .tickFormat(d3.format(".0s"));;

         //add an axis.
         svg.select("g")
            .transition()

            .attr("transform","translate("+paddingX+",0)")
            .attr("y",h)
            .call(yAxis);


}

const digits = d3.format(".3");
