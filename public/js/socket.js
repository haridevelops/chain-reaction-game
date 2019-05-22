const socket = io();

// variables
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
var opponentTurn = false;
var cell = $('.cell');
// Elements
const $cell = document.querySelectorAll('.cell');

// Parsing Query String
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

$cell.forEach((cell) => {
    cell.addEventListener('click', (event) => {
		let index = findCoordinates(event);
		let clickedCell = $(`#id${index.row}${index.column}`);
		let color = clickedCell.attr('data-color');
		console.log(color);
		console.log('next turn before emit',currentTurn)
		if (opponentTurn) return displayErrorMessage('#turn');

		if (currentTurn === color || color === 'blank') {
			if (index.row === undefined && index.column === undefined) {
				return displayErrorMessage('#info');
			}
			let userIndex = createUserObject(index);
			socket.emit('cellClickEvent', userIndex, (response, error) => {
				console.log('callback received from server !!', response);
			})

		} else {
			return displayErrorMessage('#info');
		}
		

		console.log('next turn after emit',currentTurn)
    });    
})

socket.emit('newUser', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
})

socket.on('cellClickEventResponse', (options) => {
    console.log('event received', options)
    if (options.user.username == username) {
        opponentTurn = true;
    } else opponentTurn = false;


    error = false;
    insertAtom(options, false);
	if(error) {
		$('#message').show();
	} else {
		changeTurn();	
	}

});

const insertAtom = (options, trigger) => {
    var currentCell = $(`#id${options.index.row}${options.index.column}`);
	var color = currentCell.attr('data-color');
	var value = Number(currentCell.attr('data-value'));
	var capacity = Number(currentCell.attr('data-capacity'));

	if(!trigger) {
		if(color === currentTurn || color === 'blank') {
			if(value < capacity) {
				currentCell.attr({
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
			currentCell.attr({
				'src' : 'img/'+currentTurn+(value+1)+'.png',
				'data-color' : currentTurn,
				'data-value': ''+(value+1)
			});
		}
	}
		

	if(!error) {
		triggerChainReaction(options);
	}
}

const insertAtomToNeighbours = (obj, trigger) => {
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
		triggetChainReactionToNeighbours(obj);
	}
}

const triggetChainReactionToNeighbours = (obj) => {
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
			insertAtomToNeighbours($(left), true);
		}
		if($(right).length){
			insertAtomToNeighbours($(right), true);
		}
		if($(above).length){
			insertAtomToNeighbours($(above), true);
		}
		if($(below).length){
			insertAtomToNeighbours($(below), true);
		}
	}
}

function triggerChainReaction(options){
	var currentCell = $(`#id${options.index.row}${options.index.column}`);
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
			insertAtomToNeighbours($(left), true);
		}
		if($(right).length){
			insertAtomToNeighbours($(right), true);
		}
		if($(above).length){
			insertAtomToNeighbours($(above), true);
		}
		if($(below).length){
			insertAtomToNeighbours($(below), true);
		}
	}
}

const createUserObject = (index) => {
    return {
        user: { username, room },
		index
    }
}

const findCoordinates = (event) => {
    return {
        row: event.target.parentNode.parentNode.rowIndex,
        column: event.target.parentNode.cellIndex
    }
}

const displayErrorMessage = (errID) => {
    $(errID).show();
    return setTimeout(() => {
        $(errID).hide();
    }, 2000);
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