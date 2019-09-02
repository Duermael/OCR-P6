// gett the id of a cell in the grid array
function index(colId, rowId, objectGrid) {
	if ((colId < 0) || (rowId < 0) || (colId > objectGrid.cols - 1) || (rowId > objectGrid.rows - 1)) return -1;

	return colId + rowId * objectGrid.cols;
}


class Cell {
	constructor(colId, rowId, container) {
		this.colId = colId;
		this.rowId = rowId;
		this.container = container;
		this.width = 0;
		this.height = 0;
		this.visited = false;
		this.blocked = true;
		this.hasElement = false;
		this.hasPlayer = false;
		this.hasWeapon = false;
		this.playerId = undefined;
		this.weaponId = undefined;
		this.highlighted = false;
	}

	createCell() {
		// get grid width and height and set cell width and height
		const elmtGrid = $('#game-grid'), gridWidth = this.container.width, gridHeight = this.container.height;
		const cellWidth = Math.floor((gridWidth / this.container.cols)), cellHeight = Math.floor((gridHeight / this.container.rows));
		this.width = cellWidth;
		this.height = cellHeight;

		elmtGrid.append('<div class="grid-cell block" id="' + this.colId + '-' + this.rowId + '"></div>');
		$('.grid-cell').css({ 'width': cellWidth, 'height': cellHeight });
	}

	// randomly select a neighbor cell
	checkNeighbors() {
		const neighbors = [];

		function neighborsExists(neighbor) {
			if (neighbor && !neighbor.visited) neighbors.push(neighbor);
		}

		const top = this.container.array[index(this.colId, this.rowId - 1, this.container)];
		const right = this.container.array[index(this.colId + 1, this.rowId, this.container)];
		const bottom = this.container.array[index(this.colId, this.rowId + 1, this.container)];
		const left = this.container.array[index(this.colId - 1, this.rowId, this.container)];

		// check existence of neighbor cells
		neighborsExists(top);
		neighborsExists(right);
		neighborsExists(bottom);
		neighborsExists(left);

		// neighbor cell random selection from the existing neighbors array
		if (neighbors.length > 0) {
			const r = Math.floor(Math.random() * neighbors.length);
			return neighbors[r];
		} else {
			return undefined;
		}
	}

	removeBlock() {
		this.blocked = false;
		$('#' + this.colId + '-' + this.rowId).removeClass('block');
	}

	highlight() {
		$('#' + this.colId + '-' + this.rowId).css({ 'background-color': '#a8d7e7', 'cursor': 'pointer' });
		this.highlighted = true;
	}

	reverseHighlight() {
		$('#' + this.colId + '-' + this.rowId).css('background-color', '');
		this.highlighted = false;
	}
}