
<<<<<<< HEAD
function browse_shortcuts(){

	if(!pause){
		pause_iris();
	}
	// play_restart_counter +=1;
=======
function browse_shortcuts(){	
>>>>>>> 9459b50b9d5b5c9582b17cb3802539f61663dcae

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

<<<<<<< HEAD
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	 	modal.style.display = "none";
	  	// play_restart_counter +=1;

=======
	pause_iris();	

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	 	modal.style.display = "none";
		pause_iris()
>>>>>>> 9459b50b9d5b5c9582b17cb3802539f61663dcae
	}

}


function browse_fileload(){

<<<<<<< HEAD
	if(!pause){
		pause_iris()
	}
	// play_restart_counter +=1;

=======
>>>>>>> 9459b50b9d5b5c9582b17cb3802539f61663dcae
	var second = document.getElementById('fileModal');
	var span = document.getElementsByClassName("close")[1];
	if(second.style.display == "block"){
		second.style.display = "none";
		return;
	}
	second.style.display = "block";

	pause_iris();

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  document.getElementsByClassName("drag")[0].innerHTML = '<p> Drag File here</p>';
	  second.style.display = "none";
<<<<<<< HEAD
	  // play_restart_counter +=1;
	  // pause_iris();
=======
	  pause_iris();
>>>>>>> 9459b50b9d5b5c9582b17cb3802539f61663dcae
	}

}


function handleFileSelect(evt){

	
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    document.getElementsByClassName("drag")[0].innerHTML = '<p>' + files[0].name + '</p>';
      

}


function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}














