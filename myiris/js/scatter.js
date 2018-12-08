

class ScatterPlot {


	constructor(args){


		this.init_data = args.data;
		this.plot_width = args.width;
		this.plot_height = args.height;
		this.plot = args.svg;
		this.xScale = d3.scaleLinear().domain([0,100]).range([0,this.plot_width]);
		this.yScale = d3.scaleLinear().domain([0,0]).range([this.plot_height,0]);
		this.color = d3.scaleOrdinal(d3.schemeCategory10);


		var xAxis = d3.axisBottom(this.xScale).tickFormat(d3.format("d"));
		var yAxis = d3.axisLeft(this.yScale);

		// x-axis
		this.plot.append("g")
				.attr("class", "xaxis")
				.attr("width",this.plot_width)
				.attr("height",this.plot_height)
				.attr("transform", "translate(0," + this.plot_height + ")")
				.call(xAxis);

		// y-axis
		this.plot.append("g")
				.attr("class", "yaxis")
				.call(yAxis);


		// plot initial points
		this.plot.selectAll('circle')
				.data(this.init_data)
				.enter()
					.append("circle")
					.attr("r", 3.5)
					.attr("cx", d => this.xScale(d.x) )
					.attr("cy", d => this.yScale(d.y) )
					.attr("fill", d => this.color(d.c) )


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

	}

	clear_scatter(){
		this.plot.selectAll('circle').remove();
	}
	update_scatter(dataset){


		this.yScale.domain([d3.min(dataset, d => d.y), d3.max(dataset, d => d.y)]);
		this.xScale.domain([0, d3.max(dataset, d => d.x)]);
		let points = this.plot.selectAll('circle')
							.data(dataset)
								.attr("cx", d => this.xScale(d.x) )
								.attr("cy", d => this.yScale(d.y) )
										.enter()
								.append("circle")
								.attr("r", 3.5)
								.attr("fill", d => this.color(d.c))
								.attr("cx", d => this.xScale(d.x) )
								.attr("cy", d => this.yScale(d.y) );



		const yAxis = d3.axisLeft(this.yScale);
		const xAxis = d3.axisBottom(this.xScale).tickFormat(d3.format("d"))
						.ticks(d3.max(dataset,d=>d.x));

		this.plot.selectAll("g.yaxis")
				.call(yAxis);

		this.plot.selectAll("g.xaxis")
				.call(xAxis);


	}


}
