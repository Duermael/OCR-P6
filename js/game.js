class Game {
	constructor(board) {
		this.board = board;
		this.firstPlayer = undefined;
		this.currentPlayer = undefined;
	}

	// randomly pick first player
	pickFirstPlayer() {
		const rdPlayerIndex = Math.floor(Math.random() * playersArr.length);
		const rdPlayer = playersArr[rdPlayerIndex];

		// update objects parameters
		rdPlayer.currentPlayer = true;
		this.firstPlayer = rdPlayer;
		this.currentPlayer = rdPlayer;

		// display an alert
		swal(`${rdPlayer.name} commence la partie !`)
			.then((launchGame) => {
				// launch first turn
				this.play(this.firstPlayer);
			});
	}

	// possible actions for one player
	play(player) {
		player = this.currentPlayer;
		const thisGame = this;

		// highlight current player
		player.highlightCurrentPlayer();
		$('#' + player.id + '-move').focus();

		// movements
		$('#' + player.id + '-move').one('click', function () {
			$('#' + player.id + '-attack').attr('disabled', '');
			$('#' + player.id + '-defend').attr('disabled', '');

			// highlight paths
			player.highlightPaths();
			player.move();

			// display / hide buttons + focus on "Valider" to allow keyboard actions
			$('#' + player.id + '-move').hide();
			$('#' + player.id + '-validate-move').show().focus();

			// action validation and switch turn
			$('#' + player.id + '-validate-move').on('click', function () {
				$(document).off('keydown');
				$('#game-grid').off('click');

				thisGame.board.array.forEach(element => {
					if (element.highlighted) element.reverseHighlight();
				});

				$('#' + player.id + '-validate-move').hide();
				$('#' + player.id + '-move').show();

				thisGame.switchTurns();
			});
		});

		// keyboard action
		$(document).one('keydown', function (e) {
			switch (e.which) {
				case 77:
					$('#' + player.id + '-move').trigger('click');
					break;
			}
		});

		const playerCell = this.board.array[index(player.cellColId, player.cellRowId, this.board)];
		const topCell = this.board.array[index(player.cellColId, player.cellRowId - 1, this.board)];
		const rightCell = this.board.array[index(player.cellColId + 1, player.cellRowId, this.board)];
		const bottomCell = this.board.array[index(player.cellColId, player.cellRowId + 1, this.board)];
		const leftCell = this.board.array[index(player.cellColId - 1, player.cellRowId, this.board)];

		// enable fighting actions buttons when player is in neighbor cell
		const activateFightButtons = () => $('#' + player.id + '-attack, #' + player.id + '-defend').removeAttr('disabled');

		let opponent;
		switch (true) {
			case (topCell && topCell.hasPlayer):
				activateFightButtons();
				opponent = topCell.playerId;
				break;
			case (rightCell && rightCell.hasPlayer):
				activateFightButtons();
				opponent = rightCell.playerId;
				break;
			case (bottomCell && bottomCell.hasPlayer):
				activateFightButtons();
				opponent = bottomCell.playerId;
				break;
			case (leftCell && leftCell.hasPlayer):
				activateFightButtons();
				opponent = leftCell.playerId;
				break;
		}

		const opponentIndex = playersArr.findIndex(object => {
			if (object.id === opponent) return object.id;
		});
		opponent = playersArr[opponentIndex];

		// attack with buttons
		$('#' + player.id + '-attack').on('click', function () {
			$('button[id*="move"]').remove();
			player.attack(opponent);
		});
		// attack with keyboard
		$(document).one('keydown', function (e) {
			switch (e.which) {
				case 65:
					if (opponent) {
						$('#' + player.id + '-attack').trigger('click');
					}
					break;
			}
		});

		// defend with buttons
		$('#' + player.id + '-defend').on('click', function () {
			$('button[id*="move"]').remove();
			player.protectAgainst(opponent);
		});
		// defend with keyboard
		$(document).one('keydown', function (e) {
			switch (e.which) {
				case 68:
					if (opponent) {
						$('#' + player.id + '-defend').trigger('click');
					}
					break;
			}
		});
	}

	// game end: alert and choice: end or new game
	endGame(winner) {
		swal({
			title: 'La partie est terminée !',
			text: `${winner.name} a gagné ! Voulez-vous lancer une autre partie ?`,
			buttons: {
				cancel: 'Non merci !',
				yes: {
					text: 'C\'est parti !',
					value: 'yes',
				},
			},
		})
			.then((value) => {
				switch (value) {
					case 'yes':
						location.reload();
						break;
					default:
						swal('Au revoir !');
				}
			});
	}


	switchTurns() {
		const currentPlayer = this.currentPlayer;
		// deactivate buttons for current player
		$('#' + currentPlayer.id + '-move, #' + currentPlayer.id + '-validate-move, #' + currentPlayer.id + '-attack, #' + currentPlayer.id + '-defend').off('click');

		// get index of new player
		let currentPlayerIndex = playersArr.findIndex(object => {
			if (object.id === currentPlayer.id) return object.id;
		});

		let nextPlayerIndex;
		// if current player is the last of the array, start back at index 0
		currentPlayerIndex === playersArr.length - 1 ? nextPlayerIndex = 0 : nextPlayerIndex = currentPlayerIndex + 1;

		const nextPlayer = playersArr[nextPlayerIndex];

		// enf game if one of the player has no more life-points
		switch (0) {
			case currentPlayer.lifePoints:
				this.endGame(nextPlayer);
				break;
			case nextPlayer.lifePoints:
				this.endGame(currentPlayer);
				break;
			default:
				// unhighlight current player
				currentPlayer.reverseHighlightCurrentPlayer();

				// highlight new player
				nextPlayer.highlightCurrentPlayer();

				// update players objects parameters
				currentPlayer.currentPlayer = false;
				nextPlayer.currentPlayer = true;
				this.currentPlayer = nextPlayer;
				// start turn
				this.play(currentPlayer);
		}
	}

	startGame() {
		// custom players names
		playersArr.forEach(player => player.customName());

		this.pickFirstPlayer();

		// collapse rules
		$('.card .d-none').removeClass('d-none');
		$('.card .collapse').collapse();

		// remove form		
		$('#launch-form').remove();
	}
}



