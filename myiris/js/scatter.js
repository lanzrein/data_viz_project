
/** This class represents a line plot. */
class ScatterPlot {

 /**
  * Constructor the args should have width, height, agent_name, an svg, and data.
	*/
	constructor(args){

		//create the data.
		this.init_data = {};
		for(const type of outputs){
			if (type == 'brute_force' || type=='traded'){
				continue;
			}
			this.init_data[type]  = args.data[type];
		}
		//setup the plot.
		this.plot_width = args.width;
		this.plot_height = args.height;
		this.plot = args.svg;
		this.agent_name = args.agent_name;
		this.xScale = d3.scaleLinear().domain([0,100]).range([0,this.plot_width]);
		this.yScale = d3.scaleLinear().domain([0,0.1]).range([this.plot_height,0]);
		this.color = d3.scaleOrdinal(["#A92F41",
		 							"#CCCCFF",
									"#848375",
	 								"#91C7A9"]);


		//axis.
		this.xAxis = d3.axisBottom(this.xScale);
		this.yAxis = d3.axisLeft(this.yScale);
		// x-axis
		this.plot.append("g")
				.attr("class", "xaxis")
				.attr("transform", "translate(0," + this.plot_height + ")")
				.call(this.xAxis);

		// y-axis
		this.plot.append("g")
				.attr("class", "yaxis")
				.call(this.yAxis)




		const classes = Object.keys(this.init_data)
		this.assigned_colors = classes.map(x => this.color(x))

		//add legend.
		var legend = this.plot.selectAll(".legend")
					.data(this.color.domain())
					.enter().append("g")
					.classed("legend", true)
					.attr("transform", function(d, i) {
						return "translate(0," + i * 20 + ")";
					});

		legend.append('text')
			.attr("x", 40)
			.attr("y", 10)
			.text(function (d, i) {
				return d
			})

		legend.append("rect")
			.attr("x", 20)
			.attr("width", 12)
			.attr("height", 12)
			.style("fill",this.color);


		line = d3.line()
			.x( (d,i) => this.xScale(i))
			.y( (d,i) => this.yScale(d))
			.curve(d3.curveBasis);

			//add lines.
		this.plot.selectAll(this.agent_name)
				.data(Object.entries(this.init_data))
				.enter()
					.append('path')
					.attr('d', (key_val, idx)  => line(idx) )
					.attr('class', (key_val, idx) =>  (key_val[0]))


	}


/**
 * update the plot according to the dataset. if there is a resize ( resize flag. ) we dont modify the xscales.
 *
 */

	update_scatter(dataset,resize=false){

		const temp = this.find_maximum_vals(dataset);
		//cahnge the scales if necessary.
		if(!resize){
			this.yScale.domain([d3.min(temp, d => d.y), d3.max(temp, d => d.y)]);
			this.xScale.domain([0, d3.max(temp, d => d.x)]);
		}



		this.plot.selectAll("g.yaxis")
				.call(this.yAxis);

		this.plot.selectAll("g.xaxis")
				.call(this.xAxis);

				//upadte the dataset.
		var i = 0;
		for(key in dataset){
			this.plot_line(dataset[key],this.assigned_colors[i],key);
			i = i +1;
		}

	}
//clear the line plot.
	clear_scatter(){
		// this.plot.selectAll('path').remove();
	}

//find the maxmimum in an array.
	find_maximum_vals(arr){

		var output = [];
		var result = [];

		for (var key in arr) {
			let dict = arr[key];
			for(var i=0;i<dict.length;i++){
				output.push({'x':dict.length,'y':dict[i]})
			}
		}

		return output
	}


//plot a line for the given dataset, in a specific color, for agent type of agent.
	plot_line(dataset,color,agent){


		line = d3.line()
			.x( (d,i) => this.xScale(i))
			.y( (d,i) => this.yScale(d))
			.curve(d3.curveBasis);

		this.plot.select('.'+agent)
				.datum(dataset)
					.attr('d', d => line(d))
					.attr("fill", "none")
					// .attr("stroke", color)
					.attr("stroke-width", 1.5)
					// .attr("stroke-linejoin", "round")
					// .attr("stroke-linecap", "round")

;

	}


}


//allows to parse time. not used. 
function parse_time(date){
	//we need to modify the date slightly to get a proper string..
	y = date["year"] + 2018;
	m = date["months"] + 1;
	d = date["days"]+1;
	h = date["hours"]
	string = y+"-"+m+"-"+d+"-"+h;
	let parser = d3.timeParse("%Y-%m-%d-%H")

	return parser(string);

}
