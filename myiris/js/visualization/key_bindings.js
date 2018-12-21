
let flip_agents = 0; // to choose which agent is to be viewed
/**
 * Add key listener to the page. They are explained in the process book and also in the tutorial.
 */
function add_key_listeners(){
  //here we add all the key listeners.
  document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    console.log(keyName)
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
    }else if(keyName == 'm'){
      //check if menu is visible, if yes then close, else show.
      if(visible){
        close_menu();
      }else{
        //show the menu_
        show_menu();
      }

    }else if(keyName == 'l'){
      //show the loading menu

      browse_fileload()
    }else if(keyName =='h'){
      //show the tutorial.
      
      browse_shortcuts();
    }

  });

}
