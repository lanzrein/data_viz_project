// We need to have the data collected by the underyling model.

let pause = false;




// scale will be first of length 200 but then we
//need to add the option to slide it.


const outputs = ["fld","rt","stress","aot","traded","brute_force"];




let data_by_type  = {
  fld : [0,0,0,0],
  rt : [0,0,0,0],
  stress : [0,0,0,0],
  aot : [0,0,0,0],
  traded : [0,0,0,0],
  brute_force : [0,0,0,0]
};
//setup the iris model.
// it is already defined in the sketch.js file as irisModel.
let histograms_list = [];
let brush;
/**FOR SCATTER PLOTS ***/
let scatter_plots;
let choosen_type = 0 ;
// initial values of globabl dataset

function setup_data_per_agent(){
  let data_per_agent = []

  for (agent_type in AGENT_BEHAVIORS){
  	data_per_agent.push( { fld : [0],rt : [0],stress : [0],aot : [0],traded : [0],brute_force : [0] })
  	// data_per_agent.push( { fld : [0],rt : [0],stress : [0],aot : [0] })
  }

  return data_per_agent;

}





let data_per_agent = setup_data_per_agent();




const svg_curr = d3.select("#currentsituation")
                    .append("svg");
const p_svg =  d3.select("#scatter").append("svg")
const svg_b = d3.select("#brush").append("svg")

/**END SCATTER PLOTS****/

function setup_iris(setup=true){

  let currDiv = document.getElementById("currentsituation");
  let histDiv = document.getElementById("scatter");
  let margin = {
    top: 20,
    right : 20,
    bottom :20,
    left : 20},
    width_curr = currDiv.clientWidth,
    height_curr = (currDiv.clientHeight),
    width_hist = histDiv.clientWidth,
    height_hist = histDiv.clientHeight;




 let idx = 0;
 //this is for the histograms.
 svg_curr.selectAll("*").remove();
 svg_curr.attr("width",width_curr)
         .attr("height",height_curr+margin.top+margin.bottom);
console.log(height_hist)
 histograms_list = [];
  for (const type of outputs){
    //for each type of output prepare the graph.


    data = data_by_type[type];

    let args = {
      data : data,
      width : width_curr,
      height : height_curr,
      svg : svg_curr,
      idx : idx,
      type : type,
      margin : margin

    };

    hist = new Histogram(args)

    histograms_list.push(hist);
    idx++;


}


//this is for the scatter plots.
p_svg.attr("width", width_hist+margin.left+margin.right )
.attr("height", height_hist+margin.top+margin.bottom)
.on("click",function(){line_plot_click(this)})
.append("g")
.attr("transform", "translate(" + margin.right+ "," + margin.top + ")");

p_svg.select("g").selectAll("*").remove();
//add some flavor text.

objects = {data:data_per_agent[choosen_type],width:width_hist-margin.left-margin.right,height:height_hist-margin.top-margin.bottom,svg:p_svg.select("g"),agent_name:AGENT_BEHAVIORS[choosen_type]};
plot_curr = new ScatterPlot(objects)
scatter_plots = (plot_curr)


//setup the brush
//get height and width for it.
let b_elem = document.getElementById("brush");
let b_width = b_elem.clientWidth;
let b_height = b_elem.clientHeight;

svg_b.selectAll("*").remove();
svg_b.attr("width",b_width)
              .attr("height",b_height)
if(!pause){
  svg_b.style("visibility","hidden");
}

let args_b = {width : b_width,height : b_height,svg : svg_b,margin : margin,plot : scatter_plots[0]};
brush = new Brush(args_b);


}

function tick(){
  //nice for debuging..
  if (pause){
    return;
  }
  //represents a tick in the simulation. will need to update :
  //model, graphs.

  //update model
  irisModel.update();


  //update the current situation
  compute_new_medians();
  //paint the histogram if there is a change.
  update_histograms();

  //update the historic historic
  update_scatter();



}

//HISTOGRAMS

function update_histograms(forced=false){
  let idx = 0;
  for (const type of outputs){
    let h = histograms_list[idx]
    if(forced || !(h.data.equals(data_by_type[type]))){
        h.update(data_by_type[type]);

    }
    idx++;

  }

}

function compute_new_medians(debug=false){
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


//UTILITY ( PAUSE RESTART ETC..)
function pause_iris(){
  pause = !pause;

  if(!pause){
    svg_b.style("visibility","hidden");

  }else{
    console.log("pausing");
    svg_b.style("visibility","visible");
    brush.update_brush(scatter_plots.xScale);


  }




  return;
}
function restart_iris(parameters=null,customized=false){

  if(!customized){
    const customBehavior = document.getElementsByClassName('custom-behavior');
    const behaviors = {
      curious: parseInt(irisModel.behaviors.curious),
      perfectionist: parseInt(irisModel.behaviors.perfectionist),
      geniesser: parseInt(irisModel.behaviors.geniesser),
      capitalist: parseInt(irisModel.behaviors.capitalist)
    };


  const minWage = document.getElementById('min-wage');
  const min_wage = parseInt("0");
  const tasksNum = document.getElementById('how-many-task');
  const tasks_num = (irisModel.tasks.length)/4;
  const players = 0; // here you set the players for the game
  irisModel = new IrisModel(behaviors, min_wage, tasks_num, players);

  }else{
    //we have a customized setup and need to set the value appropriately.
    const behaviors = {
      curious: parameters.curious.agent_cnt,
      perfectionist: parameters.perfectionist.agent_cnt,
      geniesser: parameters.geniesser.agent_cnt,
      capitalist: parameters.capitalist.agent_cnt
    };

  const tasks_num = parameters.tasks_cnt;
  const players = 0; // here you set the players for the game
  irisModel = new IrisModel(behaviors, 0/*min wage ? */, tasks_num, players);
  //now we need to set each agents with the given values.
  for(const agent of irisModel.agents){
      customize_agent(agent,parameters[agent.behavior]);

  }

  }


  //we need to clear the data array of scatter plots !
  data_per_agent = setup_data_per_agent();
  let idx = 0
  for (const behavior in AGENT_BEHAVIORS){

    compress_arr = compress_array(data_per_agent[idx]);
    idx++;
  }
  scatter_plots.clear_scatter();


}


//FOR SCATTER PLOTS HERE
function undef_check(value){
  return (value===undefined)? 0 : value;
	// if(value === undefined){
	// 	return 0;
	// }else{
	// 	return value;
	// }

}

function compress_array(arr){

	var output = [];

	for (var key in arr) {
	    dict = arr[key];
	    output = output.concat(dict)
	}

	return output
}
function update_scatter(){

  	medianValuesByBehavior = irisModel.show();


    var j = 0;
    for(var agent_type of AGENT_BEHAVIORS){

      medians = medianValuesByBehavior[agent_type];
      if(medians != null){
        data_of_agent = data_per_agent[j]
        for (var key in data_of_agent) {


            median_comp = undef_check(d3.mean(medians[key]))

            data_per_agent[j][key].push(median_comp);

        }


      }else{
        console.log(medians)
      }
      j = j +1
    }
    scatter_plots.update_scatter(data_per_agent[choosen_type])


}



function resize_viz(){
  // resize histograms.
  //its fairly similar to the setup of the iris except we need to have different sizes..
  //first we need to delete everything..
  d3.selectAll("#scatter#g").remove();
  // d3.select("#brush").remove();
  // d3.select("#currentsituation.parent").remove();
  setup_iris(setup=false);

  if(pause){
    //update the current situation
    compute_new_medians();
    //paint the histogram if there is a change.
    update_histograms(forced=true);

    //update the historic historic
    update_scatter();
    brush.update_brush(scatter_plots.xScale);

  }

}



function customize_agent(agent,value_map){

		agent.FLD = value_map.fld;
		agent.stress = value_map.stress;
		agent.mappedAmountOfTime = value_map.aot;
		agent.restingTime = value_map.rt;

}


function brushing(){

    let selection = d3.event.selection === undefined ? brush.xScale.domain() : d3.event.selection.map(brush.xScale.invert);
    if(!(d3.event.selection === undefined)){
      brush.handle.attr("display",null).attr("transform",function(d,i){

      return "translate("+brush.xScale(selection[i])+","+brush.height/2+")";
    })
  }else{
    brush.handle.attr("display","none")
  }
    brushing_chart(selection);
}


function brushing_chart(selection){
  let plt = scatter_plots;

  plt.xScale.domain(selection);
  scatter_plots.update_scatter(data_per_agent[choosen_type],resize=true);
}


function line_plot_click(ctx){
  let coord = d3.mouse(ctx)
  let x = coord[0];
  if (x < 20 || x > scatter_plots.plot.node().getBoundingClientRect().width){
    //we are out of the graph
    console.log("oob")
    return;
  }
  x -= 20;//shift.
  let tick = int(scatter_plots.xScale.invert(x));
  //we have the tick whrere the thing happened now we need to get the info about it .
  data_by_type = {
    fld : [],
    rt : [],
    stress : [],
    aot : [],
    traded : [],
    brute_force : []
  };

  for(const type of outputs){
    for(const idx in AGENT_BEHAVIORS){
      data_by_type[type].push(data_per_agent[idx][type][tick]);
    }

    update_histograms(forced=true);
  }


}


function line_plot_change(choice){
  //remove color for current one.
  d3.select('.selected').classed('selected',false);

  //add color to the new one.
  d3.select('button#'+AGENT_BEHAVIORS[choice]).classed('selected',true);

  //change current color.
  choosen_type = choice;
  //then we need to change
  scatter_plots.update_scatter(data_per_agent[choosen_type],resize=true)
}
