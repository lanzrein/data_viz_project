function show_menu(){
  //pause the simulation first so it doesnt run in the bg..
  pause_iris();
  let menu = d3.select("#menu");
  menu.style("visibility", "visible");
  return;



}

function close_menu(){
  //unpause.
  pause_iris();
  let menu = d3.select("#menu");
  menu.style("visibility","hidden");
  return ;
}


function custom_start(){
  //first restart the iris with all the values given..




  console.log("heya")
  //remove the menu
  close_menu();



}
