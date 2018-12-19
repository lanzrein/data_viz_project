//setup hovering..

let flip_agents = 0; // to choose which agent is to be viewed


// $("#pannel").hover(function() {
//     console.log("hi");
//     trigger_function();
// }, function() {
//     console.log("Out");
//     trigger_function();
// });

//
// function sort_agents(){
//   let selection = d3.select("#pannel #left #agent_list #selection_sort")
//   let sorted_arg = selection.property("value")
//   console.log(sorted_arg)
// // }
//
//
// function setup_agent_display(){
//   //here setup the agent display and show them all.
// }
//
//
//
//



function add_key_listeners(){
  //here we add all the key listeners.

  //make the model faster or slower.
  document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    if (keyName == ' '){

  	   pause_iris();
  	 //alert('keypress event\n\n' + 'key: ' + keyName);
    }else if (keyName == 'r'){
  	   restart_iris()
    }else if (keyName == 'd'){

    	flip_agents +=1;
    	agent_id_new = flip_agents%4;
    	line_plot_change(agent_id_new);

    }else if(keyName == 'a'){
      flip_agents -=1;
      agent_id_new = flip_agents%4;
      line_plot_change(agent_id_new);
    }else if(keyName == 'w'){
        if(speed > 1){
          speed /= 2;
        }
      }else if(keyName =='s'){
        if (speed < 64){
          speed*=2;

        }
    }else if(keyName == 'x'){
      save_current_state();
    }

  });

}
