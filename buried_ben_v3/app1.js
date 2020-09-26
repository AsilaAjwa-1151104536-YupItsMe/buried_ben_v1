var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create, update: update, render: render
});
function preload() {
    game.load.tilemap('level1', 'TILED/PixelFantasy_Caves_1.0/map_level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'TILED/PixelFantasy_Caves_1.0/CaveTileset.png');
    game.load.image('tiles-2', 'TILED/PixelFantasy_Caves_1.0/props1.png');

    game.load.image('corpse_1', 'TILED/PixelFantasy_Caves_1.0/corpse_1.png');
    game.load.image('background', 'TILED/PixelFantasy_Caves_1.0/maxresdefault.jpg');
    game.load.spritesheet('Player', 'TILED/character-sprite-sheets/1 Woodcutter/Woodcutter_v2.png?v=1', 48, 48);

    game.load.audio('bgm_level1', ['BGM/BGM_cave_level_1/Cave-Loop-242562976.mp3', 'BGM/BGM_cave_level_1/Cave-Loop-242562976.ogg']);

   // game.load.spritesheet('Bat', 'TILED/character-sprite-sheets/sprite_monster/Bat/Bat/droid.png?v=1', 32, 32);

    //game.load.atlas('corpse_1', 'TILED/PixelFantasy_Caves_1.0/corpse_1.png', 'TILED/PixelFantasy_Caves_1.0/map_level1.json');
    game.load.spritesheet('Bat', 'TILED/character-sprite-sheets/sprite_monster/Bat/Bat/bat_v1.png?v=1', 44, 92, 40);

}

//testing
var map;
var tileset;
var found_health = true;
var item_health;
var walk = 550;
var layer;
var player;
var jumpTimer = 0;
var attackTimer = 0;
var cursors;
var bg;
var tileset;
var platforms;
var bgm_level1;
var attack;
var revive;


var enemy_group_bat;
var lightSprite;
var enemies_bat;
var sprites_bat;
var enemy_bat;

var counter_enemy_bat=0;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 1200, 800, 'background');
    bg.fixedToCamera = true;

    bgm_level1 = game.add.audio('bgm_level1');
    bgm_music = [bgm_level1];
    game.sound.setDecodedCallback(bgm_music, bgm_loop, this);



    map = game.add.tilemap('level1');
    map.addTilesetImage('CaveTileset', 'tiles-1');
    map.addTilesetImage('corpse_1');
    map.addTilesetImage('props1', 'tiles-2');

    map.setCollisionBetween(0, 599, true, 'ground_v2');
    layer = map.createLayer('ground_v2');

    map.createLayer('health');
    map.createLayer('spike_pit_layer_1');
    map.createLayer('spike_pit_layer_2');

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 700;

    player = game.add.sprite(32, 380, 'Player');
    player.smoothed = false;
    //player.scale.setTo(4,2);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;

    revive = game.add.sprite(player.worldPosition.x, player.worldPosition.y, 'revive');


    player.anchor.set(0.5, 0.5);
    player.body.gravity.y = 1500;
    player.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);
    player.animations.add('jump', [36, 37, 38, 39, 40, 41], 6, false);
    player.animations.add('idle', [24, 25, 26, 27], 10, true);
    player.animations.add('dead', [48, 49, 50, 51, 52, 53], 10, false);

    player.animations.add('attack', [60, 61, 62, 63, 64, 65], 10, false);

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    game.LIGHT_RADIUS = 50;

    game.shadowTexture = game.add.bitmapData((game.world.width), (game.world.height));
    lightSprite = game.add.image(0, 0, game.shadowTexture);


    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;    /////////////enemy/////////////////////////
    enemy_group_bat = game.add.physicsGroup(Phaser.Physics.ARCADE);    for (var i = 0; i < 100; i++) {

        enemy_bat = enemy_group_bat.create(game.world.randomX, game.world.randomY, 'Bat');
        enemy_bat.scale.setTo(1.1);
        enemy_bat.animations.add('idle_bat', [0, 1, 2, 3, 4, 5, 6], 10, true);
        enemy_bat.play('idle_bat');

        enemy_bat, name = 'bat' + i;
        enemy_bat.body.immovable = true;
    }

    cursors = game.input.keyboard.createCursorKeys();
    attack = game.input.keyboard.addKey(Phaser.Keyboard.X);
}

function create_bat() {
    enemy_bat = sprites.create('Bat');
    enemy_bat.animations.add('idle_bat', [0, 1, 2], 10, true);
    enemy_bat.animations.play('idle_bat');

}

function create_group_bat() {

    enemies_bat = enemy_bat.create(game.world.randomX, game.world.randomY, 'Bat');
    enemies_bat.body.gravity.y = 6;
    enemies_bat.body.bounce.y = 0.7 + Math.random() * 0.2;
}


function player_bat(player, bat) {
    counter_enemy_bat++;

    if (counter_enemy_bat >= 10) {
        bat.kill();
        counter_enemy_bat = 0;
    }
      
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

function movement_player() {

    if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer) {

        player.body.velocity.y = -500;

        jumpTimer = game.time.now + 250;
        player.animations.play('jump');
    }

    else if (cursors.left.isDown) {
        player.body.velocity.x = -walk;

        player.scale.x = -1;
        if (player.body.onFloor()) {
            player.animations.play('walk');
        }

    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = walk;

        player.scale.x = 1;
        if (player.body.onFloor()) {
            player.animations.play('walk');
        }
    }
    else if (attack.isDown) {
        player.body.velocity.x = 5;
        player.animations.play('attack');
        game.physics.arcade.overlap(player, enemy_group_bat, player_bat, null, this);
    }

    else {
        player.body.velocity.x = 0;
        //player.animations.stop();
        if (player.body.onFloor()) {
            
            player.animations.stop();
        }
    }

}

function update() {

    player_effect_light();

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(enemy_group_bat, layer);
    

    movement_player();


    if (player.body.bottom >= game.world.bounds.bottom) {
        player.kill();
        player.reset(player.worldPosition.x, player.worldPosition.y);

    }

}

function render() {
    game.debug.spriteInfo(player, 32, 450);

}