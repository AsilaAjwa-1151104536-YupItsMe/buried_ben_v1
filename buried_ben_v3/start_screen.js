var game = new Phaser.Game(800, 400, Phaser.AUTO, 'Buried Ben', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var buried_ben_bg;
var buried_ben_start_screen_title;
var buried_ben_option_new_game;

function preload() {
    game.load.image('background', 'TILED/PixelFantasy_Caves_1.0/maxresdefault.jpg');
    game.load.image('title', 'TILED/title.png');
    //game.load.script('level 1', 'app1.js');
    game.load.image('button_new_game', 'TILED/button_quit.png');
}

function create() {

    game.stage.backgroundColor = '#000000';
    buried_ben_bg = game.add.tileSprite(0, 0, 800, 400, 'background');
    buried_ben_bg.fixedToCamera = true;

    buried_ben_start_screen_title = game.add.image(400, 100, 'title');
    buried_ben_start_screen_title.anchor.set(0.5, 0.5);

    //buried_ben_option_new_game = game.add.text(400, 300, 'New Game', { font: "30px Courier New", fontWeight: "bold", fill: '#ffffff' });
    //buried_ben_option_new_game.anchor.set(0.5, 0.5);

    //game.paused = true;

    buried_ben_option_new_game = game.add.button(400, 200, 'button_new_game');
    buried_ben_option_new_game.inputEnabled = true;
    buried_ben_option_new_game.anchor.set(0.5, 0.5);

    buried_ben_option_new_game.inputEnabled = true;

    buried_ben_option_new_game.events.onInputDown.addOnce(app1.js, this);

}

function startGame() {
    game.load.script('level 1', 'app1.js');

    //game.state.add('level 1', app1);
    //game.state.start('level 1');
    //game.paused = false;
}

function update() {

}

function render() {

}