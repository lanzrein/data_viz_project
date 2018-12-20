
function browse_shortcuts(){

	if(!pause){
		pause_iris();
	}
	// play_restart_counter +=1;

	// Get the modal
	let modal = document.getElementById('myModal');
	// Get the <span> element that closes the modal
	let span = document.getElementsByClassName("close")[0];
	//check if it is already displayed , if yes hide it.
	if(modal.style.display == "block"){
		modal.style.display = "none";
		return;
	}
	modal.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	 	modal.style.display = "none";
	  	// play_restart_counter +=1;

	}

}


function browse_fileload(){

	if(!pause){
		pause_iris()
	}
	// play_restart_counter +=1;

	var second = document.getElementById('fileModal');
	var span = document.getElementsByClassName("close")[1];
	if(second.style.display == "block"){
		second.style.display = "none";
		return;
	}
	second.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  second.style.display = "none";
	  // play_restart_counter +=1;
	  // pause_iris();
	}

}
