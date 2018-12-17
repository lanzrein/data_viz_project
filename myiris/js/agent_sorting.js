class AgentList{

  constructor(args){
    this.div = args.div;
    this.agents = args.agents;
    this.div.selectAll("p")
            .data(this.agents)
            .enter()
            .append("p")
            .text(function(d,i){
              return d.behavior+d.ID;
            })
            .on("click",(d,i)=>{
              this.display_agent(d);
            });;

    this.single_agent = args.single_agent;

    //append the first agent because we choose it randomly at first.
    this.single_agent.append("p")
                     .text("by")

    this.single_agent.append("p")
                     .text("hi");



  }


  display_agent(agent){
    console.log(agent);
    let div = d3.select("#single_agent");




  }


  sort_by(by){

    if(by == "category"){
      //its a special case where we can't use value sort..
      this.agents.sort(function(a,b){
        return category_sort(a,b);
      })
    }else{
      //we can use value_sort as a comparator.
      this.agents.sort(function(a,b){
        return value_sort(a,b,by);
      })
    }

    //update agent list.

    this.div.selectAll("p")
            .data(this.agents)
            .transition()
            // .append("p")
            .text(function(d,i){
              return d.behavior+d.ID;
            })

  }








}



//can be used for : rt,fld,stress,aot,id,masterTask
function value_sort(a,b,value){
  return a[value] - b[value];
}

function category_sort(a,b){
  return AGENT_BEHAVIORS.indexOf(a.behavior) - AGENT_BEHAVIORS.indexOf(b.behavior);
}
