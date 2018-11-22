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

	data_per_agent.push( {
				fld : [{x:0,y:0,c:'fld'}],
				rt : [{x:0,y:0,c:'rt'}],
				stress : [{x:0,y:0,c:'stress'}],
				aot : [{x:0,y:0,c:'aot'}],
				traded : [{x:0,y:0,c:'traded'}],
				brute_force : [{x:0,y:0,c:'brute_force'}]
			})

}





function setup_iris(){

	
	// initialize canvas for plot
	
	for(var type in AGENT_BEHAVIORS){

		const current_height = p_height 

		var p_svg =  d3.select("body").append("svg")
			.attr("width", p_width + margin.left + margin.right)
			.attr("height", current_height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		compressed_init = compress_array(data_per_agent[type]) // compress all arrays into one plot to plot a scatter plot
		
		objects = {data:compressed_init,width:p_width,height:current_height,svg:p_svg};
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






