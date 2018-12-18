//setup hovering..

let play_restart_counter = 0; // for play and pause counter to keep in which mode
let flip_agents = 0; // to choose which agent is to be viewed


$("#pannel").hover(function() {
    console.log("hi");
    trigger_function();
}, function() {
    console.log("Out");
    trigger_function();
});
console.log("setup hover")


function sort_agents(){
  console.log("Sort them by....")
  let selection = d3.select("#pannel #left #agent_list #selection_sort")
  let sorted_arg = selection.property("value")
  console.log(sorted_arg)
}


function setup_agent_display(){
  //here setup the agent display and show them all.
}

let dark = true;
function change_theme(){
  let sheet = document.getElementById('stylesheet');
  if(dark){
    sheet.href = "style.css";
  }else{
    sheet.href = "style-dark.css";
  }
  dark = !dark;



}


document.addEventListener('keypress', (event) => {
  const keyName = event.key;
  if (keyName == ' '){
	
	play_restart_counter +=1;
	if (play_restart_counter%2 == 0){
		pause_iris()
	}
	else{
		pause_iris()
	}
	 //alert('keypress event\n\n' + 'key: ' + keyName);
  }
  else if (keyName == 'r'){
	restart_iris()
  }
  else if (keyName == 'Tab'){


	flip_agents +=1;
	agent_id_new = flip_agents%4;
	line_plot_change(agent_id_new);

  }
 
});







