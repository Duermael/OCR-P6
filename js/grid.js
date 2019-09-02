class Grid {
	constructor(number) {
		this.cols = number;
		this.rows = number;
		this.width = parseInt($('#game-grid').css('width'));
		this.height = parseInt($('#game-grid').css('height'));
		this.array = [];
		this.stack = [];
	}

	generateGrid() {
		// cells creation
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {
				const cell = new Cell(i, j, this);
				this.array.push(cell);
				cell.createCell();

				// adapt grid size depending on cells size
				const newGridWidth = (cell.width) * this.cols;
				const newGridHeight = (cell.height) * this.rows;
				$('#game-grid').css({ 'width': newGridWidth, 'height': newGridHeight });
				this.width = newGridWidth;
				this.height = newGridHeight;
			}
		}
	}

	// place objects on grid - based on maze generation algorithm 
	// by default, all cells are blocked, blocks are removed along the path creation
	// blocks are kept on dead-ends cells
	placeBlocks() {
		let current = this.array[0];

		current.visited = true;
		this.stack.push(current);

		while (this.stack.length > 0) {
			const next = current.checkNeighbors();
			if (next !== undefined) {
				current.removeBlock();
				next.visited = true;
				this.stack.push(next);
				current = next;
			} else {
				current = this.stack.pop();
			}
		}
	}
}

const grid = new Grid(10);
