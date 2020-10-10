var game = new Phaser.Game(800, 400, Phaser.AUTO, 'Buried Ben', {
    preload: preload,
    create: create,
    update: update,
    render: render
});
function preload() {

    game.load.spritesheet('button_start', 'TILED/New Game.png', 121, 41);

    game.load.image('background', 'TILED/PixelFantasy_Caves_1.0/maxresdefault.jpg');
    //game.load.script('Level1', 'level_1.js');
}

var bg;
var button_new_game;


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 800, 400, 'background');
    bg.fixedToCamera = true;

    button_new_game = game.add.button(100, 350, 'button_start', new_game, this, 2, 1, 0);
    //button_new_game.visible = true;
    button_new_game.name = 'new_game_button';
    button_new_game.anchor.setTo(0.5, 0.5);
}

function new_game(button_new_game, pointer, isOver) {
    if (isOver) {
        bg.visible = !bg.visible;
    }

}

function update() {


}

function render() {



}