

class ScatterPlot {


	constructor(args){


		this.init_data = args.data;
		this.plot_width = args.width;
		this.plot_height = args.height;
		this.plot = args.svg;
		this.agent_name = args.agent_name;
		this.xScale = d3.scaleLinear().domain([0,100]).range([0,this.plot_width]);
		this.yScale = d3.scaleLinear().domain([0,0.1]).range([this.plot_height,0]);
		this.color = d3.scaleOrdinal(d3.schemeCategory10);



		var xAxis = d3.axisBottom(this.xScale);
		var yAxis = d3.axisLeft(this.yScale);

		// x-axis
		this.plot.append("g")
				.attr("class", "xaxis")
				.attr("transform", "translate(0," + this.plot_height + ")")
				.call(xAxis);

		// y-axis
		this.plot.append("g")
				.attr("class", "yaxis")
				.call(yAxis);



		const classes = Object.keys(this.init_data)
		this.assigned_colors = classes.map(x => this.color(x))


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
			.curve(d3.curveCardinal);


		this.plot.selectAll(this.agent_name)
				.data(Object.entries(this.init_data))
				.enter()
					.append('path')
					.attr('d', (key_val, idx)  => line(idx) )
					.attr('class', (key_val, idx) =>  this.agent_name + (key_val[0]));


		/*this.plot.selectAll(".w")
				.data(Object.entries(this.init_data))
				.enter()
					.append('path')
					.attr('d', (key_val, idx)  => line(idx) )
					.attr('class', (key_val, idx) => 'w' + this.agent_name + (key_val[0]));*/

	}


	update_scatter(dataset){

		const temp = this.find_maximum_vals(dataset);


		this.yScale.domain([d3.min(temp, d => d.y), d3.max(temp, d => d.y)]);
		this.xScale.domain([0, d3.max(temp, d => d.x)]);

		const yAxis = d3.axisLeft(this.yScale);
		const xAxis = d3.axisBottom(this.xScale);

		this.plot.selectAll("g.yaxis")
			.transition()
				.call(yAxis);

		this.plot.selectAll("g.xaxis")
			.transition()
				.call(xAxis);


		var i = 0;
		for(key in dataset){
			this.plot_line(dataset[key],this.assigned_colors[i],key);
			i = i +1;
		}

	}


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



	plot_line(dataset,color,agent){


		line = d3.line()
			.x( (d,i) => this.xScale(i))
			.y( (d,i) => this.yScale(d))
			.curve(d3.curveCardinal);

		this.plot.select('.'+ this.agent_name +agent)
				.datum(dataset)
					.attr('d', d => line(d))
					.attr("fill", "none")
					.attr("stroke", color)
					.attr("stroke-width", 1.5)
					.attr("stroke-linejoin", "round")
					.attr("stroke-linecap", "round");

	}


}
