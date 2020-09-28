var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('Bat', 'TILED/character-sprite-sheets/sprite_monster/Bat/Bat/droid.png?v=1', 32, 32);

}

var sprites;
var rip = 0;

function create() {

    sprites = game.add.group();

    game.time.events.repeat(Phaser.Timer.SECOND, 50, createSprite, this);

}

function createSprite() {

    var mummy = sprites.create(0, game.world.randomY, 'Bat');
    game.physics.enable(mummy, Phaser.Physics.ARCADE);

    mummy.animations.add('walk');

    mummy.play('walk', 10, true);

}

function update() {

    sprites.setAll('x', 10, true, true, 1);

    //sprites.forEach(checkSprite, this, true);

}

//function checkSprite(sprite) {

//    try {
//        if (sprite.x > game.width) {
//            rip++;
//            sprites.remove(sprite, true);
//        }
//    }
//    catch (e) {
//        console.log(sprite);
//    }

//}

function render() {

    game.debug.text("Group size: " + sprites.total, 32, 32);
    game.debug.text("Destroyed: " + rip, 32, 64);

}