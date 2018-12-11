function sort_agents(){
  console.log("Sort them by....")
  let selection = d3.select("#pannel #left #agent_list #selection_sort")
  let sorted_arg = selection.property("value")
  console.log(sorted_arg)
}
