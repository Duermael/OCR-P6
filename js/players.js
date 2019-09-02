class Player extends Element {
	constructor(id, name, image, board, weapon) {
		super(id, name, image, board);
		this.lifePoints = 100;
		this.weapon = weapon;
		this.currentPlayer = false;
		this.defend = false;
	}

	placeElmt() {
		super.placeElmt();
		// player's avatar
		$('#' + this.id).css('background-image', 'url("img/' + this.id + '-' + this.weapon.id + '.png")');
	}

	displayInfo() {
		$('#players').append('<div class="info-player text-center rounded p-1 mb-2" id="info-' + this.id + '"></div>');
		const idInfo = $('#info-' + this.id);
		const infoHTML = `<h5 class="mb-2" id="name-${this.id}">${this.name}</h5>
		<img class="avatar" src="img/${this.image}">
		<ul class="list-unstyled">
		<li class="points">Points de vie : ${this.lifePoints}</li><hr>
		<li class="weapon">Arme : ${this.weapon.name}</li>
		<li class="damages">Dégâts : ${this.weapon.damages}</li></ul>
		<hr>
		<button id="${this.id}-move" class="btn col-10 mb-1" disabled>Se déplacer</button>
		<button id="${this.id}-validate-move" class="btn col-10 mb-1" disabled>Valider</button>
		<button id="${this.id}-attack" class="btn col-10 mb-1" disabled>Attaquer</button>
		<button id="${this.id}-defend" class="btn col-10 mb-1" disabled>Se défendre</button>`
		idInfo.append(infoHTML);
		$('#' + this.id + '-validate-move').hide();
	}

	customName() {
		// get the field value and display it in player's info
		const namePlayer = $('#name-' + this.id).val();
		const nameContainer = $('#info-' + this.id + '> h5');
		if (namePlayer != '') {
			nameContainer.text(namePlayer);
			this.name = namePlayer;
		}
	}

	highlightCurrentPlayer() {
		$('#info-' + this.id).css({ 'background': '#4486a1', 'color': 'white' });
		$('#info-' + this.id + ' button[id*="move"]').removeAttr('disabled');
	}

	reverseHighlightCurrentPlayer() {
		$('#info-' + this.id).css({ 'background': '', 'color': '' });
		$('#info-' + this.id + ' :button').attr('disabled', '');
	}

	// highlight possible paths
	highlightPaths() {
		const thisCell = this.board.array[index(this.cellColId, this.cellRowId, this.board)];
		thisCell.highlight();
		let thisBoard = this.board;

		function path(direction) {
			for (let i = 1; i <= 3; i++) {
				let next;
				switch (direction) {
					case 'top':
						next = thisBoard.array[index(thisCell.colId, thisCell.rowId - i, thisBoard)];
						break;
					case 'right':
						next = thisBoard.array[index(thisCell.colId + i, thisCell.rowId, thisBoard)];
						break;
					case 'bottom':
						next = thisBoard.array[index(thisCell.colId, thisCell.rowId + i, thisBoard)];
						break;
					case 'left':
						next = thisBoard.array[index(thisCell.colId - i, thisCell.rowId, thisBoard)];
						break;
					default:
						break;
				}

				if (next && (next.blocked === false) && (next.hasPlayer === false)) {
					next.highlight();
				} else {
					break;
				}
			}
		}

		path('top');
		path('right');
		path('bottom');
		path('left');
	}

	switchWeapon() {
		const currentCell = this.board.array[index(this.cellColId, this.cellRowId, this.board)];
		const weaponInCell = currentCell.weaponId;
		const currentPlayer = this;

		// get new weapon index
		const newWeaponIndex = weaponsArr.findIndex(object => {
			if (object.id === weaponInCell) {
				return object.id;
			}
		});
		const newWeapon = weaponsArr[newWeaponIndex];

		// get current weapon index
		const currentWeaponIndex = weaponsArr.findIndex(object => {
			if (object.id === currentPlayer.weapon.id) {
				return object.id;
			}
		});
		const currentWeapon = weaponsArr[currentWeaponIndex];

		// change avatar
		$('#' + this.id).css('background-image', 'url("img/' + this.id + '-' + weaponInCell + '.png")');
		// change weapon in cell + hide to avoid multiple element in the same cell
		$('#' + newWeapon.id).attr('id', currentWeapon.id).css('background-image', 'url("img/' + currentWeapon.image + '")').hide();

		// objects update
		this.weapon = newWeapon;
		currentCell.weaponId = currentWeapon.id;

		// info udpates
		$('#info-' + this.id + ' .weapon').text('Arme : ' + newWeapon.name);
		$('#info-' + this.id + ' .damages').text('Dégâts : ' + newWeapon.damages);
	}

	moveToNextCell(dir) {
		// get player's position
		const playerPos = this.board.array[index(this.cellColId, this.cellRowId, this.board)];

		// player can only move in one direction once movement started
		switch (dir) {
			case 'right':
				dir = this.board.array[index(this.cellColId + 1, this.cellRowId, this.board)];
				this.board.array.forEach(element => {
					if (dir && dir.highlighted && element.highlighted) {
						if (((element.rowId === dir.rowId) && (element.colId < dir.colId)) || ((element.rowId != playerPos.rowId) && (element.colId === playerPos.colId))) {
							element.reverseHighlight();
						}
					}
				});
				break;
			case 'left':
				dir = this.board.array[index(this.cellColId - 1, this.cellRowId, this.board)];
				this.board.array.forEach(element => {
					if (dir && dir.highlighted && element.highlighted) {
						if (((element.rowId === dir.rowId) && (element.colId > dir.colId)) || ((element.rowId != playerPos.rowId) && (element.colId === playerPos.colId))) {
							element.reverseHighlight();
						}
					}
				});
				break;
			case 'bottom':
				dir = this.board.array[index(this.cellColId, this.cellRowId + 1, this.board)];
				this.board.array.forEach(element => {
					if (dir && dir.highlighted && element.highlighted) {
						if (((element.colId === dir.colId) && (element.rowId < dir.rowId)) || ((element.colId != playerPos.colId) && (element.rowId === playerPos.rowId))) {
							element.reverseHighlight();
						}
					}
				});
				break;
			case 'top':
				dir = this.board.array[index(this.cellColId, this.cellRowId - 1, this.board)];
				this.board.array.forEach(element => {
					if (dir && dir.highlighted && element.highlighted) {
						if (((element.colId === dir.colId) && (element.rowId > dir.rowId)) || ((element.colId != playerPos.colId) && (element.rowId === playerPos.rowId))) {
							element.reverseHighlight();
						}
					}
				});
				break;
		}

		// avatar movement
		if (dir && dir.highlighted) {
			this.cellColId = dir.colId;
			this.cellRowId = dir.rowId;

			const playerDiv = $('#' + this.id);
			playerDiv.detach();
			$('#' + dir.colId + '-' + dir.rowId).append(playerDiv);

			playerPos.hasPlayer = false;
			playerPos.playerId = undefined;
			if (playerPos.hasWeapon === false) playerPos.hasElement === false;
			dir.hasPlayer = true;
			dir.playerId = this.id;
			dir.hasElement = true;

			// switch weapon
			if (dir.hasWeapon) this.switchWeapon();

			// display old weapon 
			if (playerPos.hasWeapon && dir.hasPlayer) $('#' + playerPos.colId + '-' + playerPos.rowId + '> div[id*="weapon"]').show();
		}
	}

	// movement with keyboard or mouse
	move() {
		const thisPlayer = this;

		// keyboard
		$(document).on('keydown', function (e) {
			switch (e.which) {
				case 39:
					thisPlayer.moveToNextCell('right');
					break;

				case 37:
					thisPlayer.moveToNextCell('left');
					break;

				case 40:
					e.preventDefault();
					thisPlayer.moveToNextCell('bottom');
					break;

				case 38:
					e.preventDefault();
					thisPlayer.moveToNextCell('top');
					break;
			}
		});

		// mouse
		$('#game-grid').on('click', function (event) {
			let clickedCellId = event.target.id;
			if (clickedCellId.indexOf('weapon') !== -1) {
				clickedCellId = $('#' + clickedCellId).parent().attr('id');
			}

			const clickedCellCol = parseInt(clickedCellId.slice(0, clickedCellId.indexOf('-')));
			const clickedCellRow = parseInt(clickedCellId.slice(clickedCellId.indexOf('-') + 1));
			const clickedCellIndex = thisPlayer.board.array[index(clickedCellCol, clickedCellRow, thisPlayer.board)];

			if (clickedCellIndex && clickedCellIndex.highlighted) {
				for (let i = thisPlayer.cellColId; i < clickedCellIndex.colId; i++) {
					thisPlayer.moveToNextCell('right');
				}
				for (let i = thisPlayer.cellColId; i > clickedCellIndex.colId; i--) {
					thisPlayer.moveToNextCell('left');
				}
				for (let i = thisPlayer.cellRowId; i < clickedCellIndex.rowId; i++) {
					thisPlayer.moveToNextCell('bottom');
				}
				for (let i = thisPlayer.cellRowId; i > clickedCellIndex.rowId; i--) {
					thisPlayer.moveToNextCell('top');
				}
				$('#' + thisPlayer.id + '-validate-move').trigger('click');
			}
		});
	}

	attack(opponent) {
		// if opponent chose to defend himself, points are /2
		if (opponent.defend) {
			opponent.lifePoints -= (this.weapon.damages / 2);
			opponent.defend = false;
		} else {
			opponent.lifePoints -= this.weapon.damages;
		}

		opponent.lifePoints <= 0 ? opponent.lifePoints = 0 : opponent.lifePoints;


		swal(`${this.name} attaque ${opponent.name} avec ${this.weapon.name} pour ${this.weapon.damages} points de dégâts`)
			.then(() => {
				game.switchTurns();
				$('#info-' + opponent.id + ' .points').text('Points de vie : ' + opponent.lifePoints);
			});
	}

	// defense
	protectAgainst(opponent) {
		this.defend = true;

		if (opponent.defend) opponent.defend = false;

		swal(`${this.name} se défend contre la prochaine attaque !`)
			.then(() => {
				game.switchTurns();
			});
	}
}