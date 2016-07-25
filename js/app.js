console.log('ready');

// Init variables
var container = document.getElementById('container'),
	mainStage = document.getElementById('main-stage'),
	infoConsole = document.getElementById('info-console'),
	size = 0,
	grid = [5, 5]; // grid = [rows, columns]

container.style.height = window.innerHeight - 20 + "px";
mainStage.style.height = container.offsetHeight + "px";
mainStage.style.width = container.offsetHeight + "px";
size = 100 / grid[1] + "%";

infoConsole.style.height = container.offsetHeight + "px";

// Grid init

function createRow(row){
	var gridRow = document.createElement("DIV");
	var textnode = document.createTextNode("");
	gridRow.appendChild(textnode);
	gridRow.id = row;
	gridRow.className += "row";
	gridRow.style.height = size;
	mainStage.appendChild(gridRow);
};

function createBox(row, column) {
	var box = document.createElement("DIV");
	var textnode = document.createTextNode("");         // Create a text node
	box.appendChild(textnode);                              // Append the text to <li>
	box.className += "box";
	box.id = row + "-" + column;
	box.style.width = size;
	document.getElementById(row).appendChild(box);
};

function initGrid(){
	for(var i = 1; i <= grid[0]; i++){
		createRow(i);
		for(var j = 1; j <= grid[1]; j++){
			createBox(i, j);
		}
	}
}initGrid();


// Game init



