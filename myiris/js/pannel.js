//setup hovering..

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
