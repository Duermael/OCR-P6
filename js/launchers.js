// players and weapons arrays creation
let playersArr = [];
let weaponsArr = [];

// weapons and players instances creation
const weapon1 = new Weapon('weapon-ham', 'Jambon', 'weapon-ham.png', grid, 10, false);
const weapon2 = new Weapon('weapon-club', 'Gourdin', 'weapon-club.png', grid, 10, false);
const weapon3 = new Weapon('weapon-knife', 'Couteau', 'weapon-knife.png', grid, 15, true);
const weapon4 = new Weapon('weapon-bow', 'Arc', 'weapon-bow.png', grid, 20, true);
const weapon5 = new Weapon('weapon-sword', 'Epée', 'weapon-sword.png', grid, 25, true);
const weapon6 = new Weapon('weapon-axe', 'Hache', 'weapon-axe.png', grid, 30, true);
const player1 = new Player('player1', 'Joueur 1', 'player1.png', grid, weapon1);
const player2 = new Player('player2', 'Joueur 2', 'player2.png', grid, weapon2);

playersArr.push(player1, player2);
weaponsArr.push(weapon1, weapon2, weapon3, weapon4, weapon5, weapon6);

// game creation
const game = new Game(grid);

$(function () {
	// grid and blocks
	grid.generateGrid();
	grid.placeBlocks();

	// display players and info
	playersArr.forEach(player => {
		player.placeElmt();
		player.displayInfo();
	});

	// display weapons and info
	weaponsArr.forEach(weapon => {
		// default players weapons are not displayed in the grid
		(weapon === weapon1) || (weapon === weapon2) ? weapon.displayInfo() : (weapon.placeElmt(), weapon.displayInfo());
	});


	// launch game
	$('#launch-form :button').on('click', function () {
		game.startGame();
	});
});