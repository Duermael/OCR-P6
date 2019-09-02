class Weapon extends Element {
	constructor(id, name, image, board, damages) {
		super(id, name, image, board);
		this.damages = damages;
	}

	placeElmt() {
		super.placeElmt();
		$('#' + this.id).css('background-image', 'url("img/' + this.image + '")');
	}

	displayInfo() {
		$('#weapons > ul').append('<li id="info-' + this.id + '"></li>');
		const idInfo = $('#info-' + this.id);
		const infoHTML = `<img class="avatar-weapon float-left" src="img/${this.image}">
		<ul class="list-unstyled"><li class="font-weight-bold">${this.name}</li><li>Dégâts : ${this.damages}</li></ul>`;
		idInfo.append(infoHTML);
		idInfo.before('<hr>');
	}
}
