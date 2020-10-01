var game;
game = new Phaser.Game(800, 400, Phaser.AUTO, 'Buried Ben');

game.state.add('Menu', start_screen);
//game.state.add('Play', Play);
//game.state.add('Win', Win);

//game.state.start('Menu');