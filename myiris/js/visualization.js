// We need to have the data collected by the underyling model.
const historicDiv = document.getElementById("currentsituation");

let pause = false;
console.log(historicDiv);
const margin = {
  top: 30,
  right : 20,
  bottom :10,
  left : 20},
  width = historicDiv.clientWidth,
  height = (historicDiv.clientHeight)/6.0-margin.top-margin.bottom,
  contextHeight = 50,
  contextWidth = width;

console.log("w " + width);
console.log("h " + height);

const svg = d3.select("#currentsituation")
                .append("svg")
                .attr("width",width+margin.left+margin.right)
                .attr("height",historicDiv.clientHeight+margin.top*6.0+margin.bottom*6.0);
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
let histograms_list = [];
function setup_iris(){

<<<<<<< HEAD
  //for every agent we need to have them recording at all time. but we will not save the output -> TODO later maybe ?
  // for (const agent of irisModel.agents) {
  //     agent.data = []; // empty the data set
  //     agent.recordData = true;
  // }

  //we also need to setup the histograms here so we can have transitions after.
  //here we use a dummy data..
  data = [0,0,0,0]
  yScale.domain([0,d3.max(data)]);



  // let svg = d3.  setup_iris();select("body")
  //   .append("svg")
  //   .attr("width",w)
  //   .attr("height",h);
  // console.log("data : " +data)

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x",function(d,i){
      return xScale(i);
    })
    .attr("y",function(d){
      return h- yScale(d);
    })
    .attr("width",xScale.bandwidth())
    .attr("height",function(d){
      return yScale(d);
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
       .attr("font-family","sans-serif")
       .attr("font-size","20px")
       .attr("fill","black");

       svg.append("g")
          .attr("class","axis")
          .attr("translate","translate(0,0)")
          .call(yAxis);
=======



 const yAxis = d3.axisLeft(yScale)
                  .ticks(4)
                  .tickFormat(d3.format(".0s"));
 let idx = 0;
  for (const type of outputs){
    //for each type of output prepare the graph.


    data = data_by_type[type];

    let args = {
      data : data,
      width : width,
      height : height,
      svg : svg,
      idx : idx,
      type : type,
      margin : margin

    };
    hist = new Histogram(args)

    histograms_list.push(hist);
    idx++;

>>>>>>> 4eb9af42afa3cfa079a669c164fd65acb729b6e5


}

}

var cnt = 0
function tick(){
  //nice for debuging..
  if (pause){
    return;
  }
  //represents a tick in the simulation. will need to update :
  //model, graphs.

  //update model
  irisModel.update();

  cnt++;
<<<<<<< HEAD
  //console.log("Hello this is visualization script  = ");
=======

>>>>>>> 4eb9af42afa3cfa079a669c164fd65acb729b6e5
  //update the current situation
  compute_new_medians();
  //paint the histogram if there is a change.
  let idx = 0;
  for (const type of outputs){
    let h = histograms_list[idx]
    if(!(h.data.equals(data_by_type[type]))){
        h.update(data_by_type[type]);

    }
    idx++;

  }

  //update the historic historic






}

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
        if (type == "brute_force" || type == "traded"){
          //if we are on the brute_force or traded seeing how the average is not very interesting
          //therefore we will show the cumulative sum
          med = d3.sum(medians[type]);
        }else{
            med = d3.mean(medians[type]);
        }

        if (med === undefined){
          med =  0;
        }
      }
      data_by_type[type].push(med);

    }
  }
}



function pause_iris(){
  pause = !pause;
  return;

}

function restart_iris(){

  let behaviors = {
    curious: 3,
    perfectionist: 3,
    geniesser: 2,
    capitalist: 2
  };

  let min_wage = 0;
  let tasks_num = 2;
  let players = 0; // here you set the players for the game
  irisModel = new IrisModel(behaviors, min_wage, tasks_num, players);

  
}
