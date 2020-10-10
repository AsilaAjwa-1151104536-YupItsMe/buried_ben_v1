﻿var game = new Phaser.Game(800, 400, Phaser.AUTO, 'Buried Ben Level 2', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('background', 'TILED/PixelFantasy_Caves_1.0/maxresdefault.jpg');
    game.load.tilemap('level2', 'TILED/PixelFantasy_Caves_1.0/map_level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('Player', 'TILED/character-sprite-sheets/1 Woodcutter/Woodcutter_v2.png?v=1', 48, 48);
    game.load.image('tiles-1', 'TILED/PixelFantasy_Caves_1.0/CaveTileset.png');
    game.load.image('tiles-2', 'TILED/PixelFantasy_Caves_1.0/props1.png');
    game.load.image('tiles-3', 'TILED/PixelFantasy_Caves_1.0/Enviroment.png');

    game.load.spritesheet('falling_objects', 'TILED/PixelFantasy_Caves_1.0/falling_objects.png');
    game.load.spritesheet('diggable_objects', 'TILED/PixelFantasy_Caves_1.0/diggable_objects.png');

    game.load.spritesheet('ladder_objects', 'TILED/PixelFantasy_Caves_1.0/ladder.png');

    game.load.spritesheet('Dweller', 'TILED/character-sprite-sheets/sprite_monster/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Mushroom/Undead executioner puppet_v2.png?v=1', 100, 100);
    game.load.spritesheet('Bat', 'TILED/character-sprite-sheets/sprite_monster/Bat/Bat/bat_v1.png?v=1', 44, 92, 40);


    game.load.image('corpse_health', 'TILED/PixelFantasy_Caves_1.0/corpse_health.png');
    game.load.image('corpse_battery', 'TILED/PixelFantasy_Caves_1.0/corpse_battery.png');

    game.load.audio('bgm_level2', ['BGM/BGM_cave_level_2/Wet Cave PREPARED LOOP.mp3', 'BGM/BGM_cave_level_2/Wet Cave PREPARED LOOP.ogg']);

    game.load.image('health_kit', 'TILED/character-sprite-sheets/health_kit.png?v=1');
    game.load.image('battery_flashlight', 'TILED/character-sprite-sheets/battery.png?v=1');

}

var map;
var tileset;
var found_health = true;
var item_health;
var walk = 550;
var layer;
var player;
var jumpTimer = 0;
var cursors;
var bg;
var platforms;
var bgm_level2;
var attack;
var run;
var revive;

var attackTimer = 0;
var injuryTimer = 0;
var digTimer = 0;

var climb = 200;


var group_ladder;
var create_ladder;

var player_health_status = 4;
var player_health_max_status = 6;
var player_health_count;
var player_health_icon;
var player_health_position;
var player_health_group;
var sprite_player_health_group;

var player_battery_status = 4;
var player_battery_max_status = 6;
var player_battery_count;
var player_battery_icon;
var player_battery_position;
var player_battery_group;
var sprite_player_battery_group;

var player_light_radius = 50;

var battery_timer = 0;
var shading = 100;

var lightSprite;

var enemy_group_bat;

var enemies_bat;
var sprites_bat;
var enemy_bat;
var distance_bat = 0;
var batText;
var counter_enemy_bat = 0;
var bat_follow = 200;


var enemy_group_dweller;
var enemy_dweller;
var counter_enemy_dweller = 0;
var dweller_follow = 400;

var enemy_group_stalactite;
var enemy_stalactite;

var enemy_group_dig;
var enemy_dig;
var object_position_dig;


var game_over;
var game_over_bg;
var button_retry;
var button_quit;
var game_over_text;


var bgm_bat;



function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 800, 400, 'background');
    bg.fixedToCamera = true;

    //////////////////////////////////////////////////////////////
    bgm_level2 = game.add.audio('bgm_level2');
    bgm_music = [bgm_level2];
    game.sound.setDecodedCallback(bgm_music, bgm_loop, this);

    /////////////////////////////////////////////////////////
    map = game.add.tilemap('level2');
    map.addTilesetImage('CaveTileset', 'tiles-1');
    game.load.image('tiles-1', 'TILED/PixelFantasy_Caves_1.0/CaveTileset.png');



    map.setCollisionBetween(0, 599, true, 'ground_v2');
    layer = map.createLayer('ground_v2');

    map.addTilesetImage('props1', 'tiles-2');
    map.addTilesetImage('Enviroment', 'tiles-3');

    map.createLayer('decoration_v3');
    map.createLayer('spike_pit_layer_1');
    map.createLayer('spike_pit_layer_2');

    map.createLayer('decoration');

    map.createLayer('decoration_v2');

    map.createLayer('decoration_v1');
    

    map.createLayer('water').alpha = 0.4;
    

    layer.resizeWorld();
    game.physics.arcade.gravity.y = 1500;

    /////////PLAYER//////////////////////////////////

    object_player();


    /////////////ENEMY_BAT/////////////////////////

    object_bat();



    /////////////ENEMY_DWELLER/////////////////////////

    object_dweller();


    //////BATTERY////////////////////////////
    player_battery();
    object_battery_item();
    ////HEALTH/////////////////////////

    player_health();
    object_health_item();


    ///////////OBJECT CLIMB///////////////////////////////////////////
    //object_climb();

    ////////////////////////FALLING OBJECT//////////////////////////
    object_stalactite();


    //////////////////DIGGABLE OBJECT//////////////////////////////
    object_dig();

    //////////////////LADDER/////////////////////////////////////

    object_ladder();

    ////////////////////////////////////////////////////////////

    cursors = game.input.keyboard.createCursorKeys();
    attack = game.input.keyboard.addKey(Phaser.Keyboard.D);
    run = game.input.keyboard.addKey(Phaser.Keyboard.W);


}


function object_bat() {
    enemy_group_bat = game.add.physicsGroup(Phaser.Physics.ARCADE);

    for (var i = 0; i < 100; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        enemy_bat = enemy_group_bat.create(game.world.randomX, game.world.randomY, 'Bat');
        enemy_bat.animations.add('idle_bat', [0, 1, 2, 3, 4, 5, 6], 3, true);
        enemy_bat.scale.setTo(1.1);
        enemy_bat.name = 'bat' + i;
        enemy_bat.body.immovable = true;
        enemy_bat.animations.play('idle_bat');
        enemy_bat.body.bounce.x = 1
        enemy_bat.body.gravity.y = 0;

    }

}




function object_ladder() {
    group_ladder = game.add.physicsGroup(Phaser.Physics.ARCADE);
    var ladder_position_x = [780, 1170, 1290, 3370, 4360, 5910, 8560, 8920, 8550, 7610, 6550, 5080, 3220, 1300, 3170, 4420, 7450, 8280, 7870, 9300, 10030, 9960];
    var ladder_position_y = [10, 10, 10, 200, 400, 400, 400, 600, 800, 600, 600, 600, 600, 1000, 1200, 1200, 1288, 1200, 200, 1200, 1100, 1000];

    for (var i = 0; i < ladder_position_x.length; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        //enemy_dweller = enemy_group_dweller.create(dweller_position_x[i], dweller_position_y[i], 'Dweller');
        create_ladder = group_ladder.create(ladder_position_x[i], ladder_position_y[i], 'ladder_objects');
        //enemy_dweller.scale.setTo(1.2);
        create_ladder.name = 'ladder' + i;
        create_ladder.body.immovable = true;
        create_ladder.body.bounce.x = 1
        create_ladder.anchor.set(0.5, 0.5);
        //enemy_dweller.body.gravity.y = 0;
        game.physics.enable(create_ladder, Phaser.Physics.ARCADE);
        create_ladder.body.collideWorldBounds = true;

    }

}



function object_dweller() {
    enemy_group_dweller = game.add.physicsGroup(Phaser.Physics.ARCADE);
    //var dweller_position_x = [9150];
    //var dweller_position_y = [950];

    for (var i = 0; i < 100; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        //enemy_dweller = enemy_group_dweller.create(dweller_position_x[i], dweller_position_y[i], 'Dweller');
        enemy_dweller = enemy_group_dweller.create(game.world.randomX, game.world.randomY, 'Dweller');
        enemy_dweller.animations.add('idle_dweller', [0, 1, 2, 3, 6, 7, 8, 9], 8, true);
        //enemy_dweller.scale.setTo(1.2);
        enemy_dweller.name = 'dweller' + i;
        enemy_dweller.body.immovable = true;
        enemy_dweller.animations.play('idle_dweller');
        enemy_dweller.body.bounce.x = 1
        //enemy_dweller.body.gravity.y = 0;

    }

}

function object_stalactite() {
    enemy_group_stalactite = game.add.physicsGroup(Phaser.Physics.ARCADE);

    for (var i = 0; i < 50; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        enemy_stalactite = enemy_group_stalactite.create(game.world.randomX, game.world.randomY, 'falling_objects');
        //enemy_stalactite.scale.setTo(1.1);
        enemy_stalactite.name = 'stalactite' + i;
        enemy_stalactite.body.immovable = true;
        enemy_stalactite.scale.setTo(0.35);

    }

}

function object_dig() {
    enemy_group_dig = game.add.physicsGroup(Phaser.Physics.ARCADE);

    var dig_position_x = [   1100, 900, 1100, 1300, 2200, 2700, 2800, 3400, 4600, 6000, 6200, 8200, 7800, 8000, 8500, 9050];
    var dig_position_y = [   500, 800, 900, 900, 200, 200, 900, 600, 800, 800, 900, 900, 900, 800, 800, 900];

    for (var i = 0; i < dig_position_x.length; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        enemy_dig = enemy_group_dig.create(dig_position_x[i], dig_position_y[i], 'diggable_objects');

        enemy_dig.name = 'dig' + i;
        enemy_dig.body.immovable = true;
        enemy_dig.scale.setTo(0.9);

    }

}

function player_battery() {
    player_battery_group = game.add.group();
    player_battery_group.scale.setTo(0.03, 0.03)
    player_battery_group.fixedToCamera = true;

    for (var i = 0; i < player_battery_status; i++) {
        sprite_player_battery_group = player_battery_group.create(4500 - (i * 1200), 11200, 'battery_flashlight');
        sprite_player_battery_group.anchor.setTo(0.5, 0.5);
        sprite_player_battery_group.name = 'battery' + i;
    }
    //sprite_player_health_group.anchor.setTo(0.5, 0.5);

}

function object_battery_item() {
    group_battery_item = game.add.physicsGroup(Phaser.Physics.ARCADE);

    for (var i = 0; i < 50; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        battery_item = group_battery_item.create(game.world.randomX, game.world.randomY, 'corpse_battery');

        battery_item.name = 'battery_item' + i;
        battery_item.body.immovable = true;
        battery_item.scale.setTo(1);

    }

}


function player_health() {
    player_health_group = game.add.group();
    player_health_group.scale.setTo(0.03, 0.03)
    player_health_group.fixedToCamera = true;

    for (var i = 0; i < player_health_status; i++) {
        sprite_player_health_group = player_health_group.create(4500 - (i * 1200), 12200, 'health_kit');
        sprite_player_health_group.anchor.setTo(0.5, 0.5);
        sprite_player_health_group.name = 'health' + i;
    }
    //sprite_player_health_group.anchor.setTo(0.5, 0.5);

}

function object_health_item() {
    group_health_item = game.add.physicsGroup(Phaser.Physics.ARCADE);

    for (var i = 0; i < 50; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        health_item = group_health_item.create(game.world.randomX, game.world.randomY, 'corpse_health');

        health_item.name = 'health_item' + i;
        health_item.body.immovable = true;
        health_item.scale.setTo(1);

    }

}


function detect_player_bat(player, bat) {

    bat.anchor.set(0.5);
    bat.animations.add('fly_bat', [16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31], 15, true);


    //game.physics.arcade.moveToObject(bat, player, 60, bat_follow);

    game.physics.arcade.moveToObject(bat, player, bat_follow);

    bat.play('fly_bat');

    //if (player.x < bat.x && bat.body.velocity.x >= 0) {
    //    bat.body.velocity.x = -100;
    //}
    //else if (player.x > bat.x && bat.body.velocity.x <= 0) {

    //    bat.body.velocity.x = 100;
    //}

    if (player.x - bat.x > 0) {
        bat.scale.x = -1;
    } else {
        bat.scale.x = 1;
    }


}

function detect_player_dweller(player, dweller) {

    dweller.anchor.set(0.5);

    //dweller.animations.add('run_dweller', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 15, true);
    dweller.animations.add('run_dweller', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 8, true);

    game.physics.arcade.moveToObject(dweller, player, dweller_follow);

    dweller.play('run_dweller');

    if (player.x - dweller.x > 0) {
        dweller.scale.x = 1;
    } else {
        dweller.scale.x = -1;
    }


}

function player_kill_bat(player, bat) {
    counter_enemy_bat++;

    if (counter_enemy_bat >= 10) {
        //bat.play('dead_bat');

        counter_enemy_bat = 0;
        bat.kill();
    }
    else {
        attack_player_bat(player, bat);
    }
}

function player_kill_dweller(player, dweller) {
    counter_enemy_dweller++;

    if (counter_enemy_dweller >= 50) {
        //bat.play('dead_bat');

        counter_enemy_dweller = 0;
        dweller.kill();
    }
    else {
        attack_player_dweller(player, dweller);
    }
}

function attack_player_bat(player, bat) {

    bat.anchor.set(0.5);

    bat.animations.add('attack_bat', [27, 28, 29, 30, 31], 10, true);


    //game.physics.arcade.moveToObject(bat, player, 60, bat_follow);
    game.physics.arcade.moveToObject(bat, player, bat_follow);

    bat.play('attack_bat');

    if (player.x - bat.x > 0) {
        bat.scale.x = -1;
    } else {
        bat.scale.x = 1;
    }

}


function attack_player_dweller(player, dweller) {

    dweller.anchor.set(0.5);

    dweller.animations.add('attack_dweller', [21], 8, true);


    //game.physics.arcade.moveToObject(bat, player, 60, bat_follow);
    game.physics.arcade.moveToObject(dweller, player, dweller_follow);

    dweller.play('attack_dweller');

    if (player.x - dweller.x > 0) {
        dweller.scale.x = 1;
    } else {
        dweller.scale.x = -1;
    }

}



function movement_player() {
    if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer) {

        player.body.velocity.y = -700;

        jumpTimer = game.time.now + 250;
        player.animations.play('jump');
    }

    else if (run.isDown && cursors.right.isDown) {
        player.body.velocity.x = walk * 1.5;

        player.scale.x = 1;
        if (player.body.onFloor()) {
            player.animations.play('run');
        }
    }
    else if (run.isDown && cursors.left.isDown) {
        player.body.velocity.x = -walk * 1.5;

        player.scale.x = -1;
        if (player.body.onFloor()) {
            player.animations.play('run');
        }

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
        if (player.scale.x == 1) {
            player.body.velocity.x = 5;
        }
        else if (player.scale.x == -1) {
            player.body.velocity.x = -5;
        }
        //player.body.velocity.x = 5;
        player.animations.play('attack');
        //game.physics.arcade.overlap(player, enemy_group_bat, player_bat, null, this);
    }

    else if (game.physics.arcade.overlap(player, group_ladder)) {
        //game.physics.arcade.gravity.y = 0;
        //game.physics.arcade.overlap(player, layer);
        player.body.velocity.x = 0;


        if (run.isDown && cursors.up.isDown) {
            //player.body.gravity.y = 0;
            //game.physics.arcade.gravity.y = 0;
            player.body.velocity.y = -climb * 2;
            player.animations.play('climb');

        } else if (run.isDown && cursors.down.isDown) {
            player.body.velocity.y = climb * 2;
            player.animations.play('climb');

        } else if (cursors.up.isDown) {
            //player.body.gravity.y = 0;
            //game.physics.arcade.gravity.y = 0;
            player.body.velocity.y = -climb;
            player.animations.play('climb');

        } else if (cursors.down.isDown) {
            player.body.velocity.y = climb;
            player.animations.play('climb');

        } else {
            //player.body.velocity.y = 0;
            player.animations.stop();
            player.body.gravity.y = 0;
            player.body.velocity.y = 0;
        }
    }

    else if (!game.physics.arcade.overlap(enemy_group_bat, player) && !attack.isDown && !game.physics.arcade.overlap(enemy_group_stalactite, player)) {
        player.body.velocity.x = 0;
        //player.animations.stop();
        if (player.body.onFloor()) {
            player.animations.play('idle');
            //player.animations.stop();
        }
    }

}


function bgm_loop() {

    bgm_music.shift();
    //bgm_level1.fadeIn(4000);
    bgm_level2.loopFull(0.6);

}

function player_effect_light() {
    game.shadowTexture.context.fillStyle = 'rgb(' + shading + ', ' + shading + ', ' + shading + ')';
    game.shadowTexture.context.fillRect(0, 0, (game.world.width), (game.world.height));
    game.shadowTexture.context.beginPath();
    game.shadowTexture.context.fillStyle = 'rgb(255, 255, 8)';
    game.shadowTexture.context.arc((player.body.x + 15), (player.body.y + 15), game.LIGHT_RADIUS, 0, Math.PI * 2);
    game.shadowTexture.context.fill();
    game.shadowTexture.dirty = true;
}

function object_player() {
    player = game.add.sprite(60, 40, 'Player');
    //player = game.add.sprite(10010, 190, 'Player');
    player.smoothed = false;
    //player.scale.setTo(4,2);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.body.friction = 0.2;
    ///player.body.width / 2;

    revive = game.add.sprite(player.worldPosition.x, player.worldPosition.y, 'revive');


    player.anchor.set(0.5, 0.5);
    player.body.gravity.y = 1500;
    player.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);
    player.animations.add('run', [12, 13, 14, 15, 16, 17], 10, true);
    player.animations.add('idle', [24, 25, 26, 27], 10, true);
    player.animations.add('jump', [36, 37, 38, 39, 40, 41], 6, false);
    player.animations.add('dead', [48, 49, 50, 51, 52, 53], 10, false);
    player.animations.add('attack', [60, 61, 62, 63, 64, 65], 10, false);
    player.animations.add('hurt', [72, 73, 74], 6, true);
    player.animations.add('climb', [84, 85, 86, 87, 88, 89], 10, true);

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    game.LIGHT_RADIUS = player_light_radius;

    game.shadowTexture = game.add.bitmapData((game.world.width), (game.world.height));
    lightSprite = game.add.image(0, 0, game.shadowTexture);


    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

}

function update() {
    player_effect_light();
    game.physics.arcade.collide(player, layer);

    game.physics.arcade.collide(enemy_group_bat, layer);
    game.physics.arcade.collide(enemy_group_dig, layer);
    game.physics.arcade.collide(enemy_group_dweller, layer);

    game.physics.arcade.collide(group_health_item, layer);
    game.physics.arcade.collide(group_battery_item, layer);
    game.physics.arcade.collide(group_ladder, layer);
    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    movement_player();

    /////////////////////////////////////////////////HEALTH//////////////////////////////////////////////////////////

    player_health_group.forEachDead(function (health) {
        if (game.physics.arcade.overlap(group_health_item, player)) {

            var delete_item_health;
            delete_item_health = group_health_item.getClosestTo(player);

            //var increase_health;
            //increase_health = player_health_group.getFirstDead();


            if (player_health_status < 4) {
                injuryTimer = 0;
                player_health_status = player_health_status + 1;
                health.revive();
                //increase_health.revive();
                delete_item_health.kill();
                //player_health();
            } else if (player_health_status >= 4) {
                player_health_status = 4;
                //player_health();
            }
        }

    });

    //////////////////////////////////////////////FALL ENEMY///////////////////////////////////////////////////////////////

    enemy_group_stalactite.forEachAlive(function (stalactite) {
        if (game.physics.arcade.overlap(stalactite, player)) {
            player.animations.play('hurt');
            game.physics.arcade.overlap(stalactite, layer);
            injuryTimer++;
            var reduce_health;
            reduce_health = player_health_group.getFirstAlive();
            //player.animations.play('hurt');

            if (injuryTimer >= 40) {
                if (player_health_status == 0) {

                    game_over_player();
                }
                else {
                    reduce_health.kill();
                    player_health_status = player_health_status - 1;
                    injuryTimer = 0;
                }
            }

        }
        else {
            game.physics.arcade.collide(stalactite, layer);
        }
    });

    /////////////////////////////////////////////DIG///////////////////////////////////////////////////////////////////

    enemy_group_dig.forEachAlive(function (dig) {

        if (game.physics.arcade.collide(dig, player) && attack.isDown) {

            digTimer++;

            //bgm_noise_dig();

            if (digTimer >= 20) {
                dig.kill();
                digTimer = 0;
            }

        }
        else {
            game.physics.arcade.collide(dig, player);
        }

    });

    ////////////////////////////////BAT/////////////////////////////////////////////////////////////////////

    enemy_group_bat.forEachAlive(function (bat) {


        if (player.bottom != bat.bottom && game.physics.arcade.distanceBetween(bat, player) >= 250) {
            //game.debug.text("Distance between bat: " + game.physics.arcade.distanceBetween(bat, player), 32, 256);

            bat.body.velocity.x = 0;
        }
        else if (player.bottom == bat.bottom && game.physics.arcade.distanceBetween(bat, player) <= 100) {
            //game.physics.arcade.moveToObject(bat, player, 60, bat_follow);
            detect_player_bat(player, bat);
            game.debug.text("Distance between bat: " + game.physics.arcade.distanceBetween(bat, player), 32, 224);
            //attack_bat.fadeIn(4000);
            //attack_bat.play();
            //game.sound.setDecodedCallback(bgm_bat_music, bgm_bat_loop, this);

        }

        if (game.physics.arcade.overlap(bat, player) && !attack.isDown) {
            injuryTimer++;
            attack_player_bat(player, bat);

            player.animations.play('hurt');
            // player.body.velocity.x = 0;

            var reduce_health;
            reduce_health = player_health_group.getFirstAlive();

            if (injuryTimer >= 30) {
                if (player_health_status == 0) {
                    //game_over_player();
                }
                else {
                    reduce_health.kill();
                    player_health_status = player_health_status - 1;
                    injuryTimer = 0;
                }

            }

        }
        else if (game.physics.arcade.overlap(bat, player) && attack.isDown) {
            //attack_player_bat(player, bat);
            player_kill_bat(player, bat);
        }

    });


    ////////////////////////////////DWELLER/////////////////////////////////////////////////////////////////////

    enemy_group_dweller.forEachAlive(function (dweller) {


        if (player.bottom != dweller.bottom && game.physics.arcade.distanceBetween(dweller, player) >= 650) {
            dweller.body.velocity.x = 0;
        }
        else if (player.bottom == dweller.bottom && game.physics.arcade.distanceBetween(dweller, player) <= 300) {
            detect_player_dweller(player, dweller);
            game.debug.text("Distance between dweller: " + game.physics.arcade.distanceBetween(dweller, player), 32, 224);

        }

        if (game.physics.arcade.overlap(dweller, player) && !attack.isDown) {
            injuryTimer++;
            attack_player_dweller(player, dweller);

            player.animations.play('hurt');

            var reduce_health;
            reduce_health = player_health_group.getFirstAlive();

            if (injuryTimer >= 20) {
                if (player_health_status == 0) {
                    //game_over_player();
                }
                else {
                    reduce_health.kill();
                    player_health_status = player_health_status - 1;
                    injuryTimer = 0;
                }

            }

        }
        else if (game.physics.arcade.overlap(dweller, player) && attack.isDown) {
            player_kill_dweller(player, dweller);
        }

    });

    //////////////////////////////////////////////////BATTERY///////////////////////////////////////////////////////////////////////////////

    battery_timer++;
    var battery;
    battery = player_battery_group.getFirstAlive();

    if (shading == 0 || player_battery_status == 0) {
        shading = 10;
        //player_battery_status = 0;
        battery_timer = 0;
        //var battery;
        //battery = player_battery_group.getFirstAlive();
        player_battery_status = 0;
        player_light_radius = 25;
        game.LIGHT_RADIUS = player_light_radius;
    }
    else if (battery_timer >= 800) {
        shading = shading - 20;
        //player_battery_status = player_battery_status - 1;

        battery.kill();
        player_battery_status--;
        player_light_radius = player_light_radius - 5;
        game.LIGHT_RADIUS = player_light_radius;
        battery_timer = 0;
    }

    player_battery_group.forEachDead(function (battery) {
        if (game.physics.arcade.overlap(group_battery_item, player)) {

            var delete_item_battery;
            delete_item_battery = group_battery_item.getClosestTo(player);


            if (player_battery_status < 4) {
                battery_timer = 0;
                shading = shading + 20;
                player_battery_status = player_battery_status + 1;
                battery.revive();
                delete_item_battery.kill();
                player_light_radius = player_light_radius + 5;
                game.LIGHT_RADIUS = player_light_radius;
                //player_health();
            } else if (player_battery_status >= 4) {
                player_battery_status = 4;
                //player_health();
            }
        }

    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (player.body.bottom >= game.world.bounds.bottom) {

        player_health_status = 0;
        //game_over_player();

        if (player_health_status == 0) {
            //game_over_player();
        }

    }

}

function render() {
    //game.debug.spriteInfo(player, 32, 450);
    game.debug.text('Time until event: ' + battery_timer, 32, 32);
    game.debug.text('Shading: ' + shading, 32, 64);
    game.debug.text('Injury: ' + injuryTimer, 32, 96);

    game.debug.text('player_health_status: ' + player_health_status, 32, 128);
    game.debug.text('player_battery_status: ' + player_battery_status, 32, 160);

    game.debug.text('Dig: ' + digTimer, 32, 192);

    game.debug.body(player);
    game.debug.body(enemy_group_dweller);
}
