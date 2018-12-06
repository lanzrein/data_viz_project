const parameters = ["stress","fld","rt","aot","agent_cnt"];

function show_menu(){
  //pause the simulation first so it doesnt run in the bg..
  pause_iris();
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
  console.log("heya")
  //remove the menu
  close_menu();



}
