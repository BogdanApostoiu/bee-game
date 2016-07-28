console.log('ready');

// Init variables
var container = document.getElementById('container'),
	mainStage = document.getElementById('main-stage'),
	infoConsole = document.getElementById('info-console'),
	size = 0,
	grid = [5, 5]; // grid = [rows, columns]

container.style.height   = window.innerHeight - 20 + "px";
mainStage.style.height   = container.offsetHeight + "px";
mainStage.style.width    = container.offsetHeight + "px";
infoConsole.style.height = container.offsetHeight + "px";
size = 100 / grid[1] + "%";

// HELPER FUNCTIONS

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
	box.appendChild(textnode);                         // Append the text to <li>
	box.className += "box";
	box.id = row + "-" + column;
	box.style.width = size;
	document.getElementById(row).appendChild(box);
};

function initGrid(){
	for(var i = 0; i < grid[0]; i++){
		createRow(i);
		for(var j = 0; j < grid[1]; j++){
			createBox(i, j);
		}
	}
}initGrid();


// Bee object config

function randomLuck(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

var beeObject = function(){
	var self = this;
	self.queen = {
		type: 'queen',
		HP: 100,
		DF: 50,
		AK: 50
	};
	self.guardian = {
		type: 'guardian',
		HP: 100,
		DF: 30,
		AK: 30
	};
	self.capacity = {
		qb : 1,     // Number of queen bees
 		gb : 3		// Number of guardian bees
	};
	return self;
};
function swarmGenerator() {
	var i = 0,
		q = new beeObject().capacity.qb,
		g = new beeObject().capacity.gb;
		swarm = [];

	for(i = 0; i < q; i++) {
		a = new beeObject().queen;
		swarm.push(a);
		a = {};
	}

	for(i = 0; i < g; i++) {
		var a = new beeObject().guardian;
		swarm.push(a);
	}

	return swarm;
};

// Game init

gameInit = function() {
	this.beeArray = swarmGenerator(),
	this.waspArray = swarmGenerator();
};
gameInit.prototype = {
	constructor: gameInit,
	initUI: function(beeArray, waspArray){
		var id = 0
			nr = new beeObject().capacity;
		for(var i = 0; i < nr.qb; i++) {
			var img = document.createElement("img");
				img.src = 'img/QW.jpg';
				img.className += 'qw'; // because the image has higher height than width and I didn't want to search for a different one
			id = 0 + '-' + i;
			document.getElementById(id).setAttribute('bee-index', i);
			document.getElementById(id).setAttribute('bee-type', 'queen');
			document.getElementById(id).className += ' wasp';
			document.getElementById(id).appendChild(img);
		};
		for(var i = 0; i < nr.gb; i++) {
			var skills = document.createElement("div"),
				img = document.createElement("img");
				img.src = 'img/wasp.jpg';
			id = 1 + '-' + i;
			document.getElementById(id).setAttribute('bee-index', i + nr.qb);
			document.getElementById(id).setAttribute('bee-type', 'guardian');
			document.getElementById(id).className += ' wasp';
			document.getElementById(id).appendChild(img);
		};
		for(var i = 0; i < nr.qb; i++) {
			var img = document.createElement("img");
				img.src = 'img/QB.jpg';
			id = grid[0] - 1 + '-' + i;
			document.getElementById(id).setAttribute('bee-index', i);
			document.getElementById(id).setAttribute('bee-type', 'queen');
			document.getElementById(id).className += ' bee';
			document.getElementById(id).appendChild(img);
		};
		for(var i = 0; i < nr.gb; i++) {
			var img = document.createElement("img");
				img.src = 'img/bee.png';
			id = grid[0] - 2 + '-' + i;
			document.getElementById(id).setAttribute('bee-index', i + nr.qb);
			document.getElementById(id).setAttribute('bee-type', 'guardian');
			document.getElementById(id).className += ' bee';
			document.getElementById(id).appendChild(img);
		};
	},
	firstSelection: null,
	secondSelection: null,
	clearSelection: function(){
		this.firstSelection = null;
    	this.secondSelection = null;
	},
	userAction: function(id1, id2){

		if(hasClass(document.getElementById(id1), 'bee')){

			// CASE : user select bee
			if(id2 === null) {
				action.select(id1);
				return;	
			}

			// CASE : deselect bee
			if(id1 === id2) {
				action.deselect(id1);
				this.clearSelection();
		    } else {
			    // CASE : user wants to move bee
			    if(!hasClass(document.getElementById(id2), 'bee') && !hasClass(document.getElementById(id2), 'wasp')){
			    	action.move(id1, id2);
    				this.clearSelection();
			    }
			    // CASE : user attacks wasp
			    else {
			    	// CASE : user selects different bee
			    	if(hasClass(document.getElementById(id2), 'bee')){
			    		action.deselect(id1);
			    		action.select(id2);
			    		this.firstSelection = id2;
			    		this.secondSelection = null;
			    	} else {
				    	var b = [],
				    		w = [];
				    		b.push(id1.split('')[0], id1.split('')[2]);
				    		w.push(id2.split('')[0], id2.split('')[2]);

				    	// CASE : bee is not near the wasp
			    		if( (b[0] > w[0] && (b[0] - w[0]) > 1) ||
				    		(b[0] < w[0] && (w[0] - b[0]) < 1) ||
				    		(b[1] > w[1] && (b[1] - w[1]) > 1) ||
				    		(b[1] < w[1] && (w[1] - b[1]) < 1) ){
				    		info.updateWarning('Bee must be next to the wasp to attack!');
				    	} else action.attack(id1, id2);
			    	}
			    }		    	
		    }
			
		} else {
			// CASE : user's first selection is empty space or wasp
			this.clearSelection();
		}

	}
};

actionClass = function() {};
actionClass.prototype = {
	constructor: actionClass,
	select: function(id){
		document.getElementById(id).className += ' selected';
		info.updateInfo(document.getElementById(id).getAttribute('bee-index'));
		info.attackingInfo(null, null);
	},
	deselect: function(id){
		removeClass(document.getElementById(id), 'selected');
		info.updateInfo(null);
		info.attackingInfo(null, null);
	},
	move: function(id1, id2){
		document.getElementById(id2).innerHTML = document.getElementById(id1).innerHTML;  // move bee
    	document.getElementById(id2).className += ' bee';
    	document.getElementById(id2).setAttribute('bee-index', document.getElementById(id1).getAttribute('bee-index'));
    	document.getElementById(id2).setAttribute('bee-type', document.getElementById(id1).getAttribute('bee-type'));

    	document.getElementById(id1).removeAttribute('bee-index');
    	document.getElementById(id1).removeAttribute('bee-type')
    	removeClass(document.getElementById(id1), 'bee');			// reset bee
    	this.deselect(id1);											// classes and attributes
    	document.getElementById(id1).innerHTML = '';
    },
    attack : function(id1, id2){
    	var index1 = document.getElementById(id1).getAttribute('bee-index'),
    		index2 = document.getElementById(id2).getAttribute('bee-index'),
    		p1 = game.beeArray[index1],
    		p2 = game.waspArray[index2],
    		damage = Math.floor(p1.AK * (randomLuck(0, 100) / 100) - p2.DF * (randomLuck(0, 100) / 100));

    	if(damage > 0){
    		if(p2.HP - damage > 0){
    			game.waspArray[index2].HP -= damage;
    			game.waspArray[index2].AK = (p2.AK + damage * 25 / 100) > 0 ? game.waspArray[index2].AK - damage * 25 / 100 : 0;
    		}
    		else{
    			this.dead(id2, id1, index2, game.waspArray[index2].type, 'wasp');
    		}
    		info.attackingInfo(index2, damage);
    	} else {
    		if(p1.HP + damage > 0){
    			game.beeArray[index1].HP += damage;
    			game.beeArray[index1].AK = (p1.AK + damage * 25 / 100) > 0 ? game.beeArray[index1].AK + damage * 25 / 100 : 0;
    		}
    		else{
    			this.dead(id1, id2, index1, game.beeArray[index1].type, 'bee');
    		}
    		info.updateInfo(index1);
    		info.attackingInfo(index2, damage);
    	};
    },
    dead: function(id, idWinner, index, beeType, type){
    	if(beeType === 'queen') {
    		if(type === 'wasp'){
    			alert('The wasp queen is dead! You won the game.');
    		}
    		else{
    			alert('The bee queen is dead! You lost the game.');
    		}
    		resetGame();
    		return;
    	}
		info.updateWarning(beeType + ' ' + type + ' ' + index + " has died");
		document.getElementById(id).innerHTML = '';
		document.getElementById(id).className = 'box';
		document.getElementById(id).removeAttribute('bee-index');
		document.getElementById(id).removeAttribute('bee-type');
		this.deselect(id);
		game.clearSelection();
		if(hasClass(document.getElementById(idWinner), 'bee')){
			game.firstSelection = idWinner;
			info.updateInfo(idWinner);
		} else {
			info.updateInfo(null);
			info.attackingInfo(null, null);
		}
		
    }
};


function infoConsoleClass () {
	this.header = document.getElementById('header');
	this.info = document.getElementById('info');
	this.info2 = document.getElementById('info2');
	this.warning = document.getElementById('warning');
};
infoConsoleClass.prototype = {
	constructor: infoConsoleClass,
	clear: function(elem){
		elem.innerHTML = ''; 
	},
	updateHeader: function(info) {
		this.header.innerHTML = info;
	},
	updateInfo: function(index){
		var bee = game.beeArray[index],
			src = index !== null && bee.type === 'guardian' ? 'img/bee.png' : 'img/QB.jpg';
			text = index !== null ? 
					'Selected bee index: ' + index + '<br />' +
					'Type: ' + bee.type + '<br />' +
					'HP:' + bee.HP + '<br />' +
					'AK:' + bee.AK + '<br />' +
					'DF:' + bee.DF + '<br />' +
					'<img src ="' + src + '"/>'
				: 'Select a bee to attack';
		this.clear(this.info);
		this.info.innerHTML = text;
	},
	attackingInfo: function(index, damage){
		var wasp = game.waspArray[index],
			src = index !== null && wasp.type === 'guardian' ? 'img/wasp.jpg' : 'img/QW.jpg';
			text = index !== null ? 
					'Attacking wasp index: ' + index + '<br />' +
					'Type: ' + wasp.type + '<br />' +
					'HP:' + wasp.HP + '<br />' +
					'AK:' + wasp.AK + '<br />' +
					'DF:' + wasp.DF + '<br />' +
					'<img src ="' + src + '"/>'
				: 'Select a wasp to attack';
			if(damage !== null){
				var damageText = '<span class="damage">Damage: ' + damage + '</span>';
				text = damageText + text;
			};
		this.clear(this.info2);
		this.info2.innerHTML = text;
	},
	updateWarning: function(info){
		var self = this;
		this.clear(this.warning);
		this.warning.innerHTML = "<span>" + info + "</span>";
		setTimeout(function(){self.clear(self.warning)}, 3000);
	}
};

var info = new infoConsoleClass();

var action = new actionClass();

var game = new gameInit();
game.initUI();
info.updateInfo(null);

function resetGame(){
	mainStage.innerHTML = '';
	initGrid();
	game = new gameInit();
	game.initUI();
	info.updateInfo(null);
	info.attackingInfo(null, null);
};


mainStage.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
    	id = hasClass(document.getElementById(target.parentNode.id), 'box') ? target.parentNode.id : target.id;

    if(game.firstSelection === null) {
    	game.firstSelection = id;
    } else {
    	game.secondSelection = id;
    };
	game.userAction(game.firstSelection, game.secondSelection);

}, false);

