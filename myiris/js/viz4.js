var cnt = 0


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



function setup_iris_1(){


	// initialize canvas for plot

	for(const type in AGENT_BEHAVIORS){

		const current_height = height

		var p_svg =  d3.select("#scatter").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", current_height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		compressed_init = compress_array(data_per_agent[type]) // compress all arrays into one plot to plot a scatter plot

		objects = {data:compressed_init,width:width,height:current_height,svg:p_svg};
		plot_curr = new ScatterPlot(objects)
		scatter_plots.push(plot_curr)
	}


}





function tick_func(){

	if(cnt > 500) {
		return;
	}

	irisModel.update();

	cnt++;

	medianValuesByBehavior = irisModel.show();

	i = 0;
	for(var agent_type of AGENT_BEHAVIORS){

		console.log(agent_type)

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
			console.log(medians)
		}

		i = i +1;
	}


}


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
