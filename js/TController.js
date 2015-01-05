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

	ttt.winner = '';
	vm.player = '';

	ttt.$loaded().then(playerSwitch);

	function playerSwitch(){
		if(ttt.needPlayerTwo) {
			vm.player = 2;
			ttt.needPlayerTwo = false;
		}
		else {
			vm.player = 1;
			ttt.needPlayerTwo = true;
			ttt.board = [['','',''],['','',''],['','','']];
			ttt.playerTurn = 1;
			ttt.winner = false;			
		}
		ttt.$save();
	}
 	
	vm.click = function(r,c) {
		if(ttt.winner) {
			return;
		}
		if(ttt.board[r][c] === '' && vm.player === 1 && ttt.playerTurn === 1) {
			ttt.board[r][c] = 'X';
			ttt.playerTurn = 2;
		}
		else if(ttt.board[r][c] === '' && vm.player === 2 && ttt.playerTurn === 2) {
			ttt.board[r][c] = 'O';
			ttt.playerTurn = 1;
		}
		ttt.winner = checkGame();
		ttt.$save();
	};


	vm.newGame = function() {
		ttt.board = [['','',''],['','',''],['','','']];
		ttt.playerTurn = 1;
		ttt.winner = false;
		ttt.$save();
	};

	function checkGame() {
		for(var i = 0; i < 3; i++) {
			if(ttt.board[i][0] !== '' && ttt.board[i][0] == ttt.board[i][1] && ttt.board[i][1] == ttt.board[i][2]) {
				return ttt.board[i][0];
			}
		}

		for(var j = 0; j < 3; j++) {
			if(ttt.board[0][j] !== '' && ttt.board[0][j] == ttt.board[1][j] && ttt.board[1][j] == ttt.board[2][j]) {
				return ttt.board[0][j];
			}
		}

		if(ttt.board[0][0] !== '' && ttt.board[0][0] == ttt.board[1][1]  && ttt.board[1][1] == ttt.board[2][2]) {
			return ttt.board[0][0];
		}

		if(ttt.board[0][2] !== '' && ttt.board[0][2] == ttt.board[1][1] && ttt.board[1][1] == ttt.board[2][0]) {
			return ttt.board[0][2];
		}

		for(i = 0; i < 3; i++) {
			for(j = 0; j < 3; j++) {
				if(ttt.board[i][j] === '') {
					return false;
				}
			}
		}

		return 'tie';

	}

}