// We need to have the data collected by the underyling model.

// scale will be first of length 200 but then we
//need to add the option to slide it.
const h = 400;
const w = 600
var xScale = d3.scaleOrdinal()
                  .domain([0,200])
                  .range([0,w/4]);

var yScale = d3.scaleLinear([0,d3.max(agent_data)])
              .range([0,h/2]);

const svg = d3.select("#historicsnapshot")
              .append("svg")
              .attr("width",w)
              .attr("height",h);
//setup the iris model.
// it is already defined in the sketch.js file as irisModel.
function setup_iris(){

  //for every agent we need to have them recording at all time. but we will not save the output -> TODO later maybe ?
  for (const agent of irisModel.agents) {
      agent.data = []; // empty the data set
      agent.recordData = true;
  }

}

var cnt = 0
function tick(){
  //represents a tick in the simulation. will need to update :
  //model, graphs.

  //update model
  irisModel.update();
  if (cnt < 10){
  for (const agent of irisModel.agents) {
      console.log("Agent"+agent.ID+":");
      console.log(agent.data);
  }
  cnt++;

  //update the historic historic



  //update the current situation



}



}
