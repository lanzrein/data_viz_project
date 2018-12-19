// This file contains the main functions for handling the VIZ



//a pause options
let pause = false;
//a time parser to d3 ( not used )
let init_time = d3.timeParse("%Y-%m-%d-%H")("2018-01-01-00");
//different type of outputs.
const outputs = ["fld","rt","stress","aot","traded","brute_force"];



//an array used for the histograms.
let data_by_type  = {
  fld : [0,0,0,0],
  rt : [0,0,0,0],
  stress : [0,0,0,0],
  aot : [0,0,0,0],
  traded : [0,0,0,0],
  brute_force : [0,0,0,0]
};
let histograms_list = [];

//handle for the brush.
let brush;


/**FOR SCATTER PLOTS ***/
let scatter_plots;
let choosen_type = 0 ;


/**
 * Clear the array. Used in start and restart.
 */
function setup_data_per_agent(){

  let data_per_agent = [];

  for (agent_type in AGENT_BEHAVIORS){
  	data_per_agent.push( { fld : [0],rt : [0],stress : [0],aot : [0],traded : [0],brute_force : [0] })

  }

  return data_per_agent;

}




//array of data per type of agent.
let data_per_agent = setup_data_per_agent();



//svg handles for the histogram, line plot and the brush.
const svg_curr = d3.select("#currentsituation")
                    .append("svg");
const p_svg =  d3.select("#scatter").append("svg")
const svg_b = d3.select("#brush").append("svg")

/**END SCATTER PLOTS****/
//handle for the agent sorting.
let agent_sort;

/**
 * This method sets up the viz so it can be used in tick() afterwards.
 *
 */
function setup_iris(setup=true){
  //some sizing..
  let currDiv = document.getElementById("currentsituation");
  let histDiv = document.getElementById("scatter");
  let margin = {
    top: 20,
    right : 20,
    bottom :30,
    left : 40},
    width_curr = currDiv.clientWidth,
    height_curr = (currDiv.clientHeight),
    width_hist = histDiv.clientWidth,
    height_hist = histDiv.clientHeight;




 let idx = 0;
 //this is for the histograms.
 svg_curr.selectAll("*").remove();
 svg_curr.attr("width",width_curr)
         .attr("height",height_curr);
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
//setup the svg.
p_svg.attr("width", width_hist+margin.left+margin.right )
.attr("height", height_hist+margin.top+margin.bottom)
.on("mousemove",function(){line_plot_click(this)})
.append("g")
.attr("transform", "translate(" + margin.right+ "," + margin.top + ")");
//clear it in case its a restart.
p_svg.select("g").selectAll("*").remove();
//create the line plot.
objects = {data:data_per_agent[choosen_type],width:width_hist-margin.left-margin.right,height:height_hist-margin.top-margin.bottom,svg:p_svg.select("g"),agent_name:AGENT_BEHAVIORS[choosen_type]};
scatter_plots = new ScatterPlot(objects);



//setup the brush
//get height and width for it.
let b_elem = document.getElementById("brush");
let b_width = b_elem.clientWidth;
let b_height = b_elem.clientHeight;

svg_b.selectAll("*").remove();
svg_b.attr("width",b_width)
              .attr("height",b_height)
if(!pause){
  //of its not pause we dont want it to be seen.
  svg_b.style("visibility","hidden");
}

let args_b = {width : b_width,height : b_height/2,svg : svg_b,margin : margin,plot : scatter_plots[0]};
brush = new Brush(args_b);


//setup the agent sorting list..
let div = d3.select("#pannel #left #sort_display_agents #agent_list");

let single_agent = d3.select("#single_agent");
let args_sort = {div : div, agents : irisModel.agents, single_agent:single_agent}
agent_sort = new AgentList(args_sort);

//setup the red line so its already here but hidden.
p_svg.selectAll(".cursor")
.data([0])
.enter()
.append("line")
.attr("class","cursor")
.attr("x1", (d)=>{return d;})
.attr("y1", 20)
.attr("x2", (d)=>{return d;})
.attr("y2", scatter_plots.plot_height+20)
.style("stroke-width", 2)
.style("stroke", "red")
.style("visibility","hidden")
.style("z-level","3");


}

/**
 * The main method used in the viz.
 * When called will compute the new medians, update the histograms, and the line plot.
 * Since the simulation update is done in the base code ( in sketch.js ) we dont need to worry about updatin the agetn.
 */
function tick(){

  if (pause){
    return;
  }

  //update the current situation
  compute_new_medians();
  //paint the histogram if there is a change.
  update_histograms();

  //update the historic historic
  update_scatter();



}

//HISTOGRAMS
/**
 *Update the histograms. We check if the data is different from the current one to optimize
 * the performance
 * You can use the forced parameter to force a redraw even if the values are the same. useful in case of restart.
 */
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

/**
 * Recompute the medians of the model.
 * This code compute the medians and in some specific cases the sum of the parameters.
 **/
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

/**
 * Pause or unpause the iris.
 * If it is paused, the brush appears and so will the red line if used.
 * if unpause they are hidden.
 */
function pause_iris(){
  pause = !pause;

  if(!pause){
    svg_b.style("visibility","hidden");
    p_svg.selectAll(".cursor").style("visibility","hidden")
  }else{
    svg_b.style("visibility","visible");
    brush.update_brush(scatter_plots.xScale);

  }
  return;
}

/**
 * Restart the simulaiton.
 * Can either be restartartefd with the same parameters as before.
 * Or if you set customized to true, then you can pass some parameters to customize the restart.
 *
 */
function restart_iris(parameters=null,customized=false){

  if(!customized){
    const customBehavior = document.getElementsByClassName('custom-behavior');
    const behaviors = {
      curious: parseInt("2"),//we do a 2-2-2-2 classic restart with 2 of each agents..
      perfectionist: parseInt("2"),
      geniesser: parseInt("2"),
      capitalist: parseInt("2")
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

  //setup again..
  setup_iris();


}


//FOR SCATTER PLOTS HERE

/*
 * Check if a value is undefined. returns 0 if it is undefined.
 *
 */
function undef_check(value){
  return (value===undefined)? 0 : value;
}


/**
 * TODO omar comment this.
 */
function compress_array(arr){

	var output = [];

	for (var key in arr) {
	    dict = arr[key];
	    output = output.concat(dict)
	}

	return output
}
/**
 * TODO omar comment this.
 */
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


/**
 * This method is called when you resize the viz. It will resize the line and histograms.
 */
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


/**
 * You can give an agent and a value map as parameter. and the agent will take the
 * values given in the value_map.
 */
function customize_agent(agent,value_map){

		agent.FLD = value_map.fld;
		agent.stress = value_map.stress;
		agent.mappedAmountOfTime = value_map.aot;
		agent.restingTime = value_map.rt;

}

/*
 * This is called when there is a brush event.
 * It will check if there is an event and update the line plots accordingly.
 */
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

/*
 * Update the line plot according to the selection ( a list of two values. )
 */
function brushing_chart(selection){
  let plt = scatter_plots;

  plt.xScale.domain(selection);
  scatter_plots.update_scatter(data_per_agent[choosen_type],resize=true);
}

/*
 * handles move event on the line plot.
 * if the simulaiton is paused, it will detect where it was clicked and make histogram display the value
 * at this moment.
 * moreover it will move a red line wher ethe move is.
 */
function line_plot_click(ctx){
  if(!pause){
    return;
  }
  let coord = d3.mouse(ctx)
  let x = coord[0];
  if (x < 20 || x > scatter_plots.plot.node().getBoundingClientRect().width){
    //we are out of the graph

    return;
  }
  draw_line(x);
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
/*
 * Draw a vertical red line given the x parameter ( x being the x coordinate where to draw it. )
 */
function draw_line(x){
  let g = p_svg;
  g.selectAll(".cursor")
  .data([x])
  .attr("class","cursor")
  .attr("x1", (d)=>{return d;})  //<<== change your code here
  .attr("y1", 20)
  .attr("x2", (d)=>{return d;})  //<<== and here
  .attr("y2", scatter_plots.plot_height+20)
  .style("visibility","visible");


  //add the time where it is....
  let scaled_x = scatter_plots.xScale.invert(x);

  curr_time = parse_time(irisModel.setModelTime());

  let scale = d3.scaleTime().range([init_time,curr_time]).domain([0,data_per_agent[0]["fld"].length]);
  // let scale1 = d3.scaleLinear().domain([])
  let day = scale(scaled_x);



}
/*
 * Change the line plot currently displayed.
 */
function line_plot_change(choice){
  //remove color for current one.
  d3.select('.selected').classed('selected',false);

  //add color to the new one.
  d3.select('button#'+AGENT_BEHAVIORS[choice]).classed('selected',true);
  
  //change current color.
  choosen_type = choice;
  //then we need to change
  scatter_plots.update_scatter(data_per_agent[choosen_type],resize=true);
}
/*
 *TODO displays all line plot in a window.
 */
function show_all_line_plots(){
 //TODO if time allows....
}
