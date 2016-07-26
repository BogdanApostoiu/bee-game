console.log('ready');

// Init variables
var container = document.getElementById('container'),
	mainStage = document.getElementById('main-stage'),
	infoConsole = document.getElementById('info-console'),
	size = 0,
	grid = [5, 5], // grid = [rows, columns]
	min = 1,
	max = 100;

container.style.height   = window.innerHeight - 20 + "px";
mainStage.style.height   = container.offsetHeight + "px";
mainStage.style.width    = container.offsetHeight + "px";
infoConsole.style.height = container.offsetHeight + "px";
size = 100 / grid[1] + "%";

// HELPER

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};
function removeClass(e,c) {
	e.className = e.className.replace( new RegExp('(?:^|\\s)'+c+'(?!\\S)') ,'');
}


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


// Bee object config

function randomLuck() {
    return Math.floor(Math.random()*(max-min+1)+min);
}

var beeConfig = {
	queen : {
		HP: 100,
		DF: 50,
		AK: 50,
		Luck: randomLuck()
	},
	guardian : {
		HP: 100,
		DF: 30,
		AK: 30,
		Luck: randomLuck()
	},
	capacity: {
		qb : 1,     // Number of queen bees
 		gb : 3		// Number of guardian bees
	}
};

function playerSwarm(nrQB, nrGB){
	var i = 0,
		swarm = []

	for(i = 0; i < nrQB; i++) {
		swarm.push(beeConfig.queen);
	}

	for(i = 0; i < nrGB; i++) {
		swarm.push(beeConfig.guardian);
	}

	return swarm;
};

// for(var i = 1; i < 12; i++){
// 	console.log(i + " : " + beeSwarm.queen.Luck + "\n");
// 	console.log(i + " : " + beeSwarm.guardian.Luck + "\n");
// 	console.log(i + " : " + beeSwarm.queen.Luck + "\n")
// }

// Game init

gameInit = function() {
	this.beeArray = playerSwarm(beeConfig.capacity.qb, beeConfig.capacity.gb),
	this.waspArray = playerSwarm(beeConfig.capacity.qb, beeConfig.capacity.gb);
};
gameInit.prototype = {
	constructor: gameInit,
	initUI: function(beeArray, waspArray){
		var id = 0;
		for(var i = 1; i <= beeConfig.capacity.qb; i++) {
			var img = document.createElement("img");
				img.src = 'img/QW.jpg';
				img.className += 'qw'; // because the image has higher height than width and I didn't want to search for a different one
			id = 1 + '-' + i;
			document.getElementById(id).className += ' wasp';
			document.getElementById(id).appendChild(img);
		};
		for(var i = 1; i <= beeConfig.capacity.gb; i++) {
			var img = document.createElement("img");
				img.src = 'img/wasp.jpg';
			id = 2 + '-' + i;
			document.getElementById(id).className += ' wasp';
			document.getElementById(id).appendChild(img);
		};
		for(var i = 1; i <= beeConfig.capacity.qb; i++) {
			var img = document.createElement("img");
				img.src = 'img/QB.jpg';
			id = grid[0] + '-' + i;
			document.getElementById(id).className += ' bee';
			document.getElementById(id).appendChild(img);
		};
		for(var i = 1; i <= beeConfig.capacity.gb; i++) {
			var img = document.createElement("img");
				img.src = 'img/bee.png';
			id = grid[0] - 1 + '-' + i;
			document.getElementById(id).className += ' bee';
			document.getElementById(id).appendChild(img);
		};
	},
	currentSelection: null,
	userAction: function(id){
		var id = id;

		// CASE : user select / deselect bee
		if(this.currentSelection == id) {
		removeClass(document.getElementById(this.currentSelection), 'selected');
    	this.currentSelection = null;
	    }
	    else{
	    	this.currentSelection = id;

	    	if(hasClass(document.getElementById(id), 'bee')){
		    	document.getElementById(id).className += ' selected';
		    }
		    else{
		    	document.getElementById(id).className += ' selected';
		    }
	    }

	},
	updateInfo: function(info){
		var text = document.createTextNode(info + ' is already selected');
		document.getElementById('info-p').appendChild(text);
	}
}

var game = new gameInit();
console.log(game.initUI());


mainStage.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
    	id = target.parentNode.id;

    // SEND TO USERACTIONMETHOD

    game.userAction(id);

  //   if(game.currentSelection == id) {
		// removeClass(document.getElementById(game.currentSelection), 'selected');
  //   	game.currentSelection = null;
  //   }
  //   else{
  //   	if(hasClass(document.getElementById(id), 'bee')){
	 //    	document.getElementById(id).className += ' selected';
	 //    }
  //   	game.currentSelection = id;
  //   }

  //   if()
}, false);

