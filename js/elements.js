class Element {
	constructor(id, name, image, board) {
		this.id = id;
		this.name = name;
		this.image = image;
		this.board = board;
		this.cellColId = 0;
		this.cellRowId = 0;
	}

	placeElmt() {
		const nbrCols = this.board.cols;
		let rdRowId, rdColId;
		let randomIndex, leftCellIndex, rightCellIndex, topCellIndex, bottomCellIndex;
		let thisBoard = this.board;

		// checks on neighbor cells
		function checkCells() {
			if ((thisBoard.array[randomIndex].blocked) || (thisBoard.array[randomIndex].hasElement) || 
			((thisBoard.array[leftCellIndex]) && (0 < thisBoard.array[leftCellIndex].colId < 8) && (thisBoard.array[leftCellIndex].hasElement)) || 
			((thisBoard.array[rightCellIndex]) && (1 < thisBoard.array[rightCellIndex].colId < 9) && (thisBoard.array[rightCellIndex].hasElement)) || 
			((thisBoard.array[topCellIndex]) && (0 < thisBoard.array[topCellIndex].rowId < 8) && (thisBoard.array[topCellIndex].hasElement)) || 
			((thisBoard.array[bottomCellIndex]) && (1 < thisBoard.array[bottomCellIndex].rowId < 9) && (thisBoard.array[bottomCellIndex].hasElement))) {
				return 'not ok';
			} else {
				return 'ok';
			}
		}			

		// prevent to place a player on an occupied cell or next to an other player
		do {
			// randomly pick a cell
			randomIndex = Math.floor(Math.random()*this.board.array.length);
			rdColId = this.board.array[randomIndex].colId;
			rdRowId = this.board.array[randomIndex].rowId;

			leftCellIndex = randomIndex-1;
			rightCellIndex = randomIndex+1;
			topCellIndex = randomIndex-nbrCols;
			bottomCellIndex = randomIndex+nbrCols;

		} while (checkCells() === 'not ok');

		// modify object parameters
		this.cellColId = rdColId;
		this.cellRowId = rdRowId;
		
		if (this.id.includes('player')) { 
			this.board.array[randomIndex].hasPlayer = true;
			this.board.array[randomIndex].playerId = this.id;
		} else if (this.id.includes('weapon')) { 
			this.board.array[randomIndex].hasWeapon = true;
			this.board.array[randomIndex].weaponId = this.id;
		}
		this.board.array[randomIndex].hasElement = true; 
		
		// div size definition depending of grid size
		const rdCell = $('#'+this.cellColId+'-'+this.cellRowId); 
		const rdCellSize = parseInt(rdCell.css('width'))-2;
		rdCell.append(`<div class="elmt" id="${this.id}"></div>`);	
		$('#'+this.id).css({'width':rdCellSize, 'height':rdCellSize, 'background-repeat':'no-repeat', 'background-position':'center center', 'background-size':'contain'});
	}		
}

