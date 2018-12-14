const parameters = ["stress","fld","rt","aot","agent_cnt"];

function show_menu(){
  //pause the simulation first so it doesnt run in the bg..
  if(!pause){
    pause_iris();
  }
  let menu = d3.select("#menu");
  menu.style("visibility", "visible");
  return;



}

function close_menu(){
  //unpause.
  if(pause){
    pause_iris();
  }
  let menu = d3.select("#menu");
  menu.style("visibility","hidden");
  return ;
}
function setup_map(){
  let map = {capitalist : 0, curious:0,geniesser : 0,perfectionist:0};

  for(const behavior of AGENT_BEHAVIORS){
    map[behavior] = {agent_cnt : 0 ,stress : 0 , fld : 100, rt : 0 , aot : 0  };
  }

  return map;

}


function custom_start(){

  //retrieve the values.
  let map = setup_map();
  for (const behavior of AGENT_BEHAVIORS){
    let str = "#menu #container #"+behavior;
    let div = d3.select(str);
    for (const param of parameters){
      let input = div.select("input#"+param).property("value");
      let value = isNaN(parseInt(input)) ? 0 : parseInt(input);
      map[behavior][param] = value


    }
  }

  //get the values for tasks.
  let task_cnt = d3.select("#menu #tasks_spec input#tasks_cnt").property("value")
  map.tasks_cnt = task_cnt;
  restart_iris(map,true);
  compute_new_medians(true);
  console.log("heya")
  //remove the menu
  close_menu();

  //we need to force to redraw once in case the values are not all 0..
  update_histograms(forced=true);
  update_scatter()



}


function get_current_values(){
  let idx =  0;
  for (const behavior of AGENT_BEHAVIORS){
    let str = "#menu #container #"+behavior;
    let div = d3.select(str);
    for (const param of parameters){
      if(param == "agent_cnt"){
        //get the current count of agents..
        div.select("input#"+param).property("value",irisModel.behaviors[behavior]);
      }else{
        //else get the current value of the parameter.
        div.select("input#"+param).property("value",data_by_type[param][idx]);
      }

    }
    idx++;
  }

}

function set_default_values(){
  let idx =  0;
  for (const behavior of AGENT_BEHAVIORS){
    let str = "#menu #container #"+behavior;
    let div = d3.select(str);
    for (const param of parameters){
      if(param == "agent_cnt"){
        //get the current count of agents..
        div.select("input#"+param).property("value",irisModel.behaviors[behavior]);
      }else if(param == "fld"){
        div.select("input#"+param).property("value",100);


      }else{
        //else get the current value of the parameter.
        div.select("input#"+param).property("value",0);
      }

    }
    idx++;
  }

}


function save_current_state(){
  saveJSON(irisModel,'irisModel');
  return ;
}

function allowDrop(event){
  event.preventDefault();
}

function drop_json(event){
  event.preventDefault();
  let file = event.dataTransfer.files[0];
  if(file){
    let fr = new FileReader();
    fr.onload = function(event){
      //what to do when the file is loaded...
      let json = event.target.result;

      try{
        irisModel = JSON.parse(json);
        //assigne the type.
        Object.setPrototypeOf(irisModel,IrisModel.prototype);
        for(const agent of irisModel.agents){
          Object.setPrototypeOf(agent,Agent.prototype);
        }
        for(const task of irisModel.tasks){
          Object.setPrototypeOf(task,Task.prototype);
        }

      }catch(err){
        console.log(err)
        alert("Corrupted data");
      }
    }
    fr.readAsText(file)
  }
}
