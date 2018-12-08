// We need to have the data collected by the underyling model.
const currDiv = document.getElementById("currentsituation");
const histDiv = document.getElementById("scatter");
let pause = false;
const margin = {
  top: 30,
  right : 20,
  bottom :10,
  left : 20},
  width_curr = currDiv.clientWidth+40-10,
  height_curr = /*(currDiv.clientHeight)*/1600/6.0-margin.top-margin.bottom,
  width_hist = histDiv.clientWidth,
  height_hist = /*histDiv.clientHeight*/1600/4.0;

console.log("w " + width_curr);
console.log("h " + height_curr);

const svg = d3.select("#currentsituation")
                .append("svg")
                .attr("width",width_curr)
                .attr("height",1600+margin.top*6.0+margin.bottom*6.0);
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
}
//setup the iris model.
// it is already defined in the sketch.js file as irisModel.
let histograms_list = [];

/**FOR SCATTER PLOTS ***/
let scatter_plots  = []
// initial values of globabl dataset

function setup_data_per_agent(){
	let data_per_agent = []

	for (agent_type in AGENT_BEHAVIORS){

		data_per_agent.push( {
					fld : [{x:0,y:0,c:'fld'}],
					rt : [{x:0,y:0,c:'rt'}],
					stress : [{x:0,y:0,c:'stress'}],
					aot : [{x:0,y:0,c:'aot'}],
					traded : [{x:0,y:0,c:'traded'}],
					brute_force : [{x:0,y:0,c:'brute_force'}]
				})

	};

	return data_per_agent;

}


let data_per_agent = setup_data_per_agent();




/**END SCATTER PLOTS****/

function setup_iris(){

 let idx = 0;
 //this is for the histograms.
  for (const type of outputs){
    //for each type of output prepare the graph.


    data = data_by_type[type];

    let args = {
      data : data,
      width : width_curr,
      height : height_curr,
      svg : svg,
      idx : idx,
      type : type,
      margin : margin

    };
    hist = new Histogram(args)

    histograms_list.push(hist);
    idx++;


}


//this is for the scatter plots.

	for(const type in AGENT_BEHAVIORS){

		const current_height = height_hist

		var p_svg =  d3.select("#scatter").append("svg")
			.attr("width", width_hist + margin.left + margin.right)
			.attr("height", height_hist + 2*margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		compressed_init = compress_array(data_per_agent[type]) // compress all arrays into one plot to plot a scatter plot

		objects = {data:compressed_init,width:width_hist-margin.left-margin.right,height:current_height,svg:p_svg};
		plot_curr = new ScatterPlot(objects)
		scatter_plots.push(plot_curr)
	}
}

var cnt = 0
function tick(){
  //nice for debuging..
  if (pause ){
    return;
  }
  //represents a tick in the simulation. will need to update :
  //model, graphs.

  //update model
  irisModel.update();

  cnt++;

  //update the current situation
  compute_new_medians();
  //paint the histogram if there is a change.
  update_histograms();


  //update the historic historic
  update_scatter();





}

//HISTOGRAMS

function update_histograms(){
  let idx = 0;
  for (const type of outputs){
    let h = histograms_list[idx]
    if(!(h.data.equals(data_by_type[type]))){
        h.update(data_by_type[type]);

    }
    idx++;

  }

}

function compute_new_medians(debug=false){
  //we can use a hacked version of the show method to get the values.
  medianValuesByBehavior = irisModel.show();
  if(debug){
    console.log(medianValuesByBehavior);
  }
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
  return;
}


function restart_iris(parameters=null,customized=false){

  if(!customized){
    const customBehavior = document.getElementsByClassName('custom-behavior');
    const behaviors = {
      curious: parseInt(customBehavior.curious.value),
      perfectionist: parseInt(customBehavior.perfectionist.value),
      geniesser: parseInt(customBehavior.geniesser.value),
      capitalist: parseInt(customBehavior.capitalist.value)
    };


  const minWage = document.getElementById('min-wage');
  const min_wage = parseInt(minWage.value);
  const tasksNum = document.getElementById('how-many-task');
  const tasks_num = parseInt(tasksNum.value);
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

  console.log(behaviors);
  const tasks_num = parameters.tasks_cnt;
  console.log(tasks_num);
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
    scatter_plots[idx].clear_scatter();
    idx++;
  }

}


//FOR SCATTER PLOTS HERE
function undef_check(value){

	if(value === undefined){
		return 0;
	}else{
		return value;
	}

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

  	i = 0;
  	for(var agent_type of AGENT_BEHAVIORS){

  		medians = medianValuesByBehavior[agent_type];
  		if(medians != null){
  			data_of_agent = data_per_agent[i]
  			for (var key in data_of_agent) {
  				median_comp = {c:key , y: undef_check(d3.mean(medians[key]))} ;
  				index =  (data_of_agent[key]).length - 1
  				prev_dp = (data_of_agent[key])[index]
  				if( prev_dp.y != median_comp.y ){
  					median_comp.x = prev_dp.x + 1;
  					data_per_agent[i][key].push(median_comp)
  				}
  			}
  			compressed_arr = compress_array(data_per_agent[i])
  			scatter_plots[i].update_scatter(compressed_arr)
  		}else{
  			console.log("Error");
  		}

  		i = i +1;
  	}


}


//we can use this to customize some agent in the future.
function customize_agent(agent,value_map){
	// value_map = {fld : 400, stress : 400, rt : 400, aot : 400}
	// for (var agent of irisModel.agents){
		//create an agent with specific values at the start.
		agent.FLD = value_map.fld;
		agent.stress = value_map.stress;
		agent.mappedAmountOfTime = value_map.aot;
		agent.restingTime = value_map.rt;
	// }

}
