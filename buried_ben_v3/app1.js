var game = new Phaser.Game(800, 400, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create, update: update, render: render
});
function preload() {
    game.load.tilemap('level1', 'TILED/PixelFantasy_Caves_1.0/map_level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'TILED/PixelFantasy_Caves_1.0/CaveTileset.png');
    game.load.image('tiles-2', 'TILED/PixelFantasy_Caves_1.0/props1.png');

    game.load.image('corpse_1', 'TILED/PixelFantasy_Caves_1.0/corpse_1.png');
    game.load.image('background', 'TILED/PixelFantasy_Caves_1.0/maxresdefault.jpg');
    game.load.spritesheet('Player', 'TILED/character-sprite-sheets/1 Woodcutter/Woodcutter_v2.png?v=1', 48, 48, 72);

    game.load.audio('bgm_level1', ['BGM/BGM_cave_level_1/Cave-Loop-242562976.mp3', 'BGM/BGM_cave_level_1/Cave-Loop-242562976.ogg']);

    //game.load.atlas('corpse_1', 'TILED/PixelFantasy_Caves_1.0/corpse_1.png', 'TILED/PixelFantasy_Caves_1.0/map_level1.json');

}

//testing
var map;
var tileset;
var found_health = true;
var item_health;
var walk = 250;
var layer;
var player;
var jumpTimer = 0;
var cursors;
var bg;
var tileset;
var platforms;
var bgm_level1;
var attack;
var revive;


var lightSprite;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 800, 400, 'background');
    bg.fixedToCamera = true;

    bgm_level1 = game.add.audio('bgm_level1');
    //bgm_level1.play();
    bgm_music = [bgm_level1];
    game.sound.setDecodedCallback(bgm_music, bgm_loop, this);



    map = game.add.tilemap('level1');
    map.addTilesetImage('CaveTileset', 'tiles-1');
    map.addTilesetImage('corpse_1');
    map.addTilesetImage('props1', 'tiles-2');

    map.setCollisionBetween(0, 599, true, 'ground_v2');
    //map.setCollisionBetween(0, 35, true, 'corpse_1');

    layer = map.createLayer('ground_v2');

    map.createLayer('health');
    map.createLayer('spike_pit_layer_1');
    map.createLayer('spike_pit_layer_2');

    layer.resizeWorld();
    //layer_health.resizeWorld();


    game.physics.arcade.gravity.y = 700;

    player = game.add.sprite(32, 380, 'Player', 1);
    player.smoothed = false;
    //player.scale.set(1.5);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    revive = game.add.sprite(player.worldPosition.x, player.worldPosition.y, 'revive');


    player.anchor.set(0.5, 0.5);
    player.body.gravity.y = 1500;
    player.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);
    //player.animations.add('jump', [39], 1, true);

    player.animations.add('jump', [36, 37, 38, 39, 40, 41], 6, false);
    player.animations.add('idle', [24, 25, 26, 27], 10, true);
    player.animations.add('dead', [48, 49, 50, 51, 52, 53], 10, false);

    player.animations.add('attack', [60, 61, 62, 63, 64, 65], 10, false);

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    cursors = game.input.keyboard.createCursorKeys();
    attack = game.input.keyboard.addKey(Phaser.Keyboard.X);

    game.LIGHT_RADIUS = 50;

    game.shadowTexture = game.add.bitmapData((game.world.width), (game.world.height));
    lightSprite = game.add.image(0, 0, game.shadowTexture);


    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    //game.lights = game.add.group();
    //game.lights.add(new Torch(game, 200, 150));
    //game.lights.add(new Torch(game, game.width - 200, 150));
    //game.movingLight = new Torch(game, game.width / 2, this.game.height / 2);
    //game.lights.add(game.movingLight);

    //player.body.x = game.width/2;
    //player.body.y = game.height/2;
}

function bgm_loop() {
    bgm_music.shift();

    bgm_level1.loopFull(0.6);

}

function player_effect_light() {
    game.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
    game.shadowTexture.context.fillRect(0, 0, (game.world.width), (game.world.height));
    game.shadowTexture.context.beginPath();
    game.shadowTexture.context.fillStyle = 'rgb(255, 255, 8)';
    game.shadowTexture.context.arc(player.body.x, player.body.y,
    game.LIGHT_RADIUS, 0, Math.PI * 2);
    game.shadowTexture.context.fill();
    game.shadowTexture.dirty = true;
}

//function player_reset(){
    //game.add.sprite(32, 380, 'Player');
//}

function update() {

    player_effect_light();

    game.physics.arcade.collide(player, layer);
    //game.physics.arcade.collide(player, layer_health);

    if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        
        player.body.velocity.y = -500;
        //player.body.velocity.x = -250;
        

        jumpTimer = game.time.now + 250;
        player.animations.play('jump');
    }
    else if (cursors.left.isDown) {
        player.body.velocity.x = -walk;
        //player.setVelocityX = -walk;
        player.scale.x = -1;
        if (player.body.onFloor()) {
            player.animations.play('walk');
        }

    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = walk;
        //player.setVelocityX = walk;
        player.scale.x = 1;
        if (player.body.onFloor()) {
            player.animations.play('walk');
        }
    }
    else if (attack.isDown) {
        player.animations.play('attack');
    }
    else {
        //player.setVelocityX(0);
        player.body.velocity.x = 0;

        if (player.body.onFloor()) {
            player.animations.play('idle');
        }
        //player.animations.play('idle');
    }


    if (player.body.bottom >= game.world.bounds.bottom) {
        player.kill();
       // player.reset(player.worldPosition.x, player.worldPosition.y);
        player.reset(player.worldPosition.x, player.worldPosition.y);

    }

}

function render() {
    //game.debug.text(player.frame, 32, 32);


}