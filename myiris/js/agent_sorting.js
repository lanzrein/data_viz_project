let color_back=["#BD8C7D","#D1BFA7","#8E8E90","#49494B"];
class AgentList{

  constructor(args){
    this.div = args.div;
    this.agents = args.agents;
    //sort it
    this.agents.sort(function(a,b){
        return value_sort(a,b,"ID");
      });
this.div.selectAll("p").remove();
    this.div.selectAll("p")
            .data(this.agents)
            .enter()
            .append("p")
            .text(function(d,i){
              return d.behavior+d.ID;
            })
	           .style("background-color",(d,i)=>{
		             return color_back[AGENT_BEHAVIORS.indexOf(d.behavior)];
	              })

            .on("click",(d,i)=>{
              this.display_agent(d);
            });;

    this.single_agent = args.single_agent;

    //append the first agent because we choose it randomly at first.

    let sel = this.single_agent.selectAll("p")
		     .data(build_string(this.agents[0]).split("\n"))
	 	     .enter()
		     .append("p")
                     .text((d)=>{return (d);});




  }


  display_agent(agent){
     this.single_agent.selectAll("p")
		     .data(build_string(agent).split("\n"))
	 	     .transition()
                     .text((d)=>{return (d);});

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
	    .style("background-color",(d,i)=>{
		return color_back[AGENT_BEHAVIORS.indexOf(d.behavior)];
	});

  }








}

function build_string(agent){

	//build a string to display for the given agent
	let str = "ID:"+agent.ID+"("+agent.behavior + ")\n";
	//add the values of fld, stress, rt, aot...
	str += "Values :\n"+"-FLD : " +agent.FLD+"\n-Stress : "+agent.stress+"\n-Rest time : "+agent.restingTime+"\n-Amnt. Time : "+agent.mappedAmountOfTime+"\n";

	//skill levels and pref
	let preferences = agent.preferences;
	//this comes from agent.js line 719
   	const tasks = ['admin', 'clean', 'cook', 'shop'];
	str += "Tasks prefs and skills: \n";
	for(const type of tasks){
		str+= "-"+preferences[type].task_name
		if(preferences[type].task_name.length == 4){
			str+=" ";//just to be all aligne...
		}
		str+="(Done :"+preferences[type].completed+"). \n--Skill :"+int(preferences[type].skill_level)+" Preference : "+int(preferences[type].task_preference)+"\n";
	}
	str+="Others : \n";
	//other things...
//	str+="-Solidarity:"+agent.solidarity;
	str+="\n-Master task : "+agent.masterTask;

	return str;


}

//can be used for : rt,fld,stress,aot,id,masterTask
function value_sort(a,b,value){
  return a[value] - b[value];
}

function category_sort(a,b){
  return AGENT_BEHAVIORS.indexOf(a.behavior) - AGENT_BEHAVIORS.indexOf(b.behavior);
}
