const socket = io();

// Elements
const $cell = document.querySelector('.cell');

var rows = 5;
var cols = 5;

var rowIndex = 0;
var colIndex = 0;

var left = '0';
var right = '0';
var above = '0';
var below = '0';

var currentTurn = 'red'
var nextTurn = 'blue';

var error = false;

var cell = $('.cell');

$cell.addEventListener('click', (event) => {
	socket.emit('cellClickEvent', message, (response) => {
		console.log('callback received from server !!', response);
	})
});

cell.click(function(event){
	error = false;
	$('#message').hide();
	findCurrentCoord(this);
	//printCoord();
	insertAtom(event.target, false);
	if(error) {
		$('#message').show();
	} else {
		changeTurn();	
	}
});

function triggerChainReaction(obj){
	var currentCell = $(obj);
	var value = currentCell.attr('data-value');
	var capacity = currentCell.attr('data-capacity');

	if(capacity === value) {
		currentCell.attr({
				'src' : 'img/blank.png',
				'data-color' : 'blank',
				'data-value': '0'
			});
		calculateNeighbours(currentCell);
		if($(left).length){
			insertAtom($(left), true);
		}
		if($(right).length){
			insertAtom($(right), true);
		}
		if($(above).length){
			insertAtom($(above), true);
		}
		if($(below).length){
			insertAtom($(below), true);
		}
	}
}

function insertAtom(obj, trigger) {
	var currentCell = $(obj);
	var color = currentCell.attr('data-color');
	var value = Number(currentCell.attr('data-value'));
	var capacity = Number(currentCell.attr('data-capacity'));

	if(!trigger) {
		if(color === currentTurn || color === 'blank') {
			if(value < capacity) {
				$(obj).attr({
					'src' : 'img/'+currentTurn+(value+1)+'.png',
					'data-color' : currentTurn,
					'data-value': ''+(value+1)
				});
			}
		} else {
			error = true;
		}
	} else {
		if(value < capacity) {
			$(obj).attr({
				'src' : 'img/'+currentTurn+(value+1)+'.png',
				'data-color' : currentTurn,
				'data-value': ''+(value+1)
			});
		}
	}
		

	if(!error) {
		triggerChainReaction(obj);
	}
}

function findCurrentCoord(obj) {
	rowIndex = obj.parentNode.rowIndex;
	colIndex = obj.cellIndex;
}

function printCoord(){
	console.log('['+rowIndex+','+colIndex+']');
}

function calculateNeighbours(obj) {
	var x = Number(obj.attr('data-x'));
	var y = Number(obj.attr('data-y'));
	leftId = 'img[data-x='+(x-1)+'][data-y='+(y)+']';
	rightId = 'img[data-x='+(x+1)+'][data-y='+(y)+']';
	aboveId = 'img[data-x='+(x)+'][data-y='+(y-1)+']';
	belowId = 'img[data-x='+(x)+'][data-y='+(y+1)+']';
	left = $(leftId);
	right = $(rightId);
	above = $(aboveId);
	below = $(belowId);
}

function changeTurn() {
	if(currentTurn === 'red') {
		currentTurn = 'blue';
		nextTurn = 'red';
		cell.css('background-color', 'blue');
	} else if(currentTurn === 'blue') {
		currentTurn = 'red';
		nextTurn = 'blue';
		cell.css('background-color', 'red');
	} else {
		console.error('currentTurn variable is neither red nor blue');
	}
}