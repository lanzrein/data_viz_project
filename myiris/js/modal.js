
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

	pause_iris();

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	 	modal.style.display = "none";
		pause_iris()
	}

}


function browse_fileload(){

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
	  pause_iris();
	}

}

function hide_browse(){
	var second = document.getElementById('fileModal');
	second.style.display = "none";
}

function handleFileSelect(evt){


    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    document.getElementsByClassName("drag")[0].innerHTML = '<p>' + files[0].name + '</p>';
		drop_json(evt);
		hide_browse();
		document.getElementsByClassName("drag")[0].innerHTML = '<p>+ Drag File here </p>';


}


function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
