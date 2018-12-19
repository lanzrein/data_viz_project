
function browse_shortcuts(){


	pause_iris();
	play_restart_counter +=1;	

	// Get the modal
	var modal = document.getElementById('myModal');
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	 	modal.style.display = "none";
	  	play_restart_counter +=1;
		pause_iris()
	}

}


function browse_fileload(){


	pause_iris()
	play_restart_counter +=1;	

	var second = document.getElementById('fileModal');
	var span = document.getElementsByClassName("close")[1];
	second.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  second.style.display = "none";
	  play_restart_counter +=1;
	  pause_iris();
	}

}
