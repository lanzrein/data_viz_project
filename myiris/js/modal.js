
function browse_shortcuts(){	

	// Get the modal
	var modal = document.getElementById('myModal');
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
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
	second.style.display = "block";

	pause_iris();

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  document.getElementsByClassName("drag")[0].innerHTML = '<p> Drag File here</p>';
	  second.style.display = "none";
	  pause_iris();
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














