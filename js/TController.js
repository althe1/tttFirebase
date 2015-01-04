angular
.module('tttApp', ['firebase'])
.controller("TController", TController);

TController.$inject = ['$firebase'];

function TController($firebase) {
	vm = this;

	function getFirebaseGame() {
		var ref = new Firebase("https://freetictactoe.firebaseio.com/ttt");
		var game = $firebase(ref).$asObject();
		return game;
	}

	vm.game = getFirebaseGame();
	var ttt = vm.game;

	vm.player = '';

	ttt.$loaded().then(function() {
		if(ttt.needPlayerTwo) {
			vm.player = 2;
			ttt.needPlayerTwo = false;
		}
		else {
			vm.player = 1;
			ttt.needPlayerTwo = true;
			ttt.board = ['','','','','','','','',''];
			ttt.playerTurn = 1;
			ttt.winner = false;			
		}
		ttt.$save();
	});

	vm.click = function(i) {
		if(ttt.winner) {
			return;
		}
		if(ttt.board[i] === '' && vm.player === 1 && ttt.playerTurn === 1) {
			ttt.board[i] = 'X';
			ttt.playerTurn = 2;
		}
		else if(ttt.board[i] === '' && vm.player === 2 && ttt.playerTurn === 2) {
			ttt.board[i] = 'O';
			ttt.playerTurn = 1;
		}
		ttt.winner = checkGame();
		ttt.$save();
	};


	vm.resetGame = function() {
		ttt.board = ['','','','','','','','',''];
		ttt.playerTurn = 1;
		ttt.winner = false;
		ttt.$save();
	};

	function checkGame() {
		if(ttt.board[0] !== '' && ttt.board[1] !== '' && ttt.board[2] !== '' &&
			ttt.board[3] !== '' && ttt.board[4] !== '' && ttt.board[5] !== '' &&
			ttt.board[6] !== '' && ttt.board[7] !== '' && ttt.board[8] !== '' &&
			ttt.board[0] == ttt.board[1] && ttt.board[1] == ttt.board[2] ||
			ttt.board[3] == ttt.board[4] && ttt.board[4] == ttt.board[5] ||
			ttt.board[6] == ttt.board[7] && ttt.board[7] == ttt.board[8] ||
			ttt.board[0] == ttt.board[3] && ttt.board[3] == ttt.board[6] ||
			ttt.board[1] == ttt.board[4] && ttt.board[4] == ttt.board[7] ||
			ttt.board[2] == ttt.board[5] && ttt.board[5] == ttt.board[8] ||
			ttt.board[0] == ttt.board[4] && ttt.board[4] == ttt.board[8] ||
			ttt.board[2] == ttt.board[4] && ttt.board[4] == ttt.board[6]) {
			if(ttt.playerTurn === 1) {
				return "X";
			}
			else if (ttt.playerTurn === 2) {
				return "O";
			}
		}

		for(var j = 0; j < 9; j++) {
			if(ttt.board[j] === ''){
				return false;
			}
		}

		return 'tie';
	}



}