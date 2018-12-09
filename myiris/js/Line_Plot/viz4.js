var cnt = 0
const Fields = ['aot','brute_force','fld','rt','stress','traded']


var global_dataset = []
var scatter_plots  = []


var margin = {top: 20, right: 20, bottom: 30, left: 40};


const p_width = 960 - margin.left - margin.right;
const p_height = 500 - margin.top - margin.bottom;


// initial values of globabl dataset

let data_per_agent = []

for (agent_type in AGENT_BEHAVIORS){
	data_per_agent.push( { fld : [0],rt : [0],stress : [0],aot : [0],traded : [0],brute_force : [0] })
}





function setup_iris(){


	for(var type in AGENT_BEHAVIORS){

		const current_height = p_height 

		var p_svg =  d3.select("body").append("svg")
			.attr("width", p_width + margin.left + margin.right)
			.attr("height", current_height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		

		objects = {data:data_per_agent[type],width:p_width,height:current_height,svg:p_svg,agent_name:AGENT_BEHAVIORS[type]};
		plot_curr = new ScatterPlot(objects)
		scatter_plots.push(plot_curr)
	}

	
}





function tick_func(){
 	
	if(cnt > 200) {
		return;
	}

	irisModel.update();
	medianValuesByBehavior = irisModel.show();
	cnt++;

	var j = 0;
	for(var agent_type of AGENT_BEHAVIORS){

		medians = medianValuesByBehavior[agent_type];
		if(medians != null){
			data_of_agent = data_per_agent[j]
			for (var key in data_of_agent) {
				median_comp = undef_check(d3.mean(medians[key]))
				index =  (data_of_agent[key]).length - 1
				prev_dp = (data_of_agent[key])[index]
				if(prev_dp != median_comp){
					data_per_agent[j][key].push(median_comp);
				}
			}
			scatter_plots[j].update_scatter(data_per_agent[j])		
		}else{
			console.log(medians)
		}
		j = j +1
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






