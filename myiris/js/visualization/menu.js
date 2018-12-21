const parameters = ["stress","fld","rt","aot","agent_cnt"];

/**
 * Show the menu. If the sim is not paused , pause it.
 */
 let visible = false;
function show_menu(){
  //pause the simulation first so it doesnt run in the bg..
  if(!pause){
    pause_iris();
  }
  let menu = d3.select("#menu");
  menu.style("visibility", "visible");
  visible = true;
  return;

}

/*
 * Close the menu, if the sim was paused, unpaused it.
 */
function close_menu(){
  //unpause.
  if(pause){
    pause_iris();
  }
  let menu = d3.select("#menu");
  menu.style("visibility","hidden");
  visible = false;
  return ;
}

/*
 * Setup a map containing for each category of agent the parameters. ( agent_cnt, stress, fld, rt, aot..)
 */
function setup_map(){
  let map = {capitalist : 0, curious:0,geniesser : 0,perfectionist:0};

  for(const behavior of AGENT_BEHAVIORS){
    map[behavior] = {agent_cnt : 0 ,stress : 0 , fld : 100, rt : 0 , aot : 0  };
  }

  return map;

}

/*
 * Do a custom start according to the given values in the input cells.
 *
 */
function custom_start(){

  //retrieve the values.
  let map = setup_map();
  for (const behavior of AGENT_BEHAVIORS){
    let str = "#menu #container #"+behavior;
    let div = d3.select(str);
    //retrieve all the values..
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

  //we need to force to redraw once in case the values are not all 0..
  update_histograms(forced=true);
  update_scatter()

  //remove the menu
  close_menu();


}

/**
 * get the current values of the irisModel and input them in the html inputs.
 *
 */
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


/**
 * Set the values in the html inputs as default values.
 * all agents are 2.
 * all parameters are 0 except fld which is 100
 */
function set_default_values(){
  let idx =  0;
  for (const behavior of AGENT_BEHAVIORS){
    let str = "#menu #container #"+behavior;
    let div = d3.select(str);
    for (const param of parameters){
      if(param == "agent_cnt"){
        //set the number as two..
        div.select("input#"+param).property("value",2);
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

/**
 * Save the current state in a json file.
 */
function save_current_state(){
  saveJSON(irisModel,'irisModel');
  return ;
}

/*
 * just to allow drop events..
 */
function allowDrop(event){
  event.preventDefault();
}
/*
 * Load the dropped json file and try to make it into a irisModel. If it doesnt work will display an alert menu saying
 * the file is corrupted. else will show that it is successfully.
 */
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

        alert("Successfully loaded the file !");
        clear_plots();
        close_menu();

      }catch(err){
        console.log(err)
        alert("Corrupted data");
        return;
      }
    }
    fr.readAsText(file)
  }
}
