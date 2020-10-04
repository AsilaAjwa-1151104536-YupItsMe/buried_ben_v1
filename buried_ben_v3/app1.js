var game = new Phaser.Game(800, 400, Phaser.AUTO, 'Buried Ben', {
    preload: preload,
    create: create,
    update: update,
    render: render
});
function preload() {
    game.load.tilemap('level1', 'TILED/PixelFantasy_Caves_1.0/map_level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'TILED/PixelFantasy_Caves_1.0/CaveTileset.png');
    game.load.image('tiles-2', 'TILED/PixelFantasy_Caves_1.0/props1.png');

    game.load.image('props4', 'TILED/PixelFantasy_Caves_1.0/props4.png');

    game.load.spritesheet('falling_objects', 'TILED/PixelFantasy_Caves_1.0/falling_objects.png');
    game.load.spritesheet('diggable_objects', 'TILED/PixelFantasy_Caves_1.0/diggable_objects.png');



    game.load.image('corpse_health', 'TILED/PixelFantasy_Caves_1.0/corpse_health.png');
    game.load.image('corpse_battery', 'TILED/PixelFantasy_Caves_1.0/corpse_battery.png');

    game.load.image('background', 'TILED/PixelFantasy_Caves_1.0/maxresdefault.jpg');
    game.load.spritesheet('Player', 'TILED/character-sprite-sheets/1 Woodcutter/Woodcutter_v2.png?v=1', 48, 48);

    game.load.audio('bgm_level1', ['BGM/BGM_cave_level_1/Cave-Loop-242562976.mp3', 'BGM/BGM_cave_level_1/Cave-Loop-242562976.ogg']);
    game.load.audio('attack', 'BGM/BGM_player/knife slash sound effect.mp3');

    game.load.spritesheet('droid', 'TILED/character-sprite-sheets/sprite_monster/Bat/Bat/droid.png?v=1', 32, 32);

    //game.load.atlas('corpse_1', 'TILED/PixelFantasy_Caves_1.0/corpse_1.png', 'TILED/PixelFantasy_Caves_1.0/map_level1.json');
    game.load.spritesheet('Bat', 'TILED/character-sprite-sheets/sprite_monster/Bat/Bat/bat_v1.png?v=1', 44, 92, 40);
    game.load.image('health_kit', 'TILED/character-sprite-sheets/health_kit.png?v=1');
    game.load.image('battery_flashlight', 'TILED/character-sprite-sheets/battery.png?v=1');

    game.load.image('button_quit', 'TILED/button_quit.png');

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
var cursors;
var bg;
var platforms;
var bgm_level1;
var attack;
var run;
var revive;

var attackTimer = 0;
var injuryTimer = 0;
var digTimer = 0;

var climb = 200;

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

var enemy_group_bat;
var lightSprite;
var enemies_bat;
var sprites_bat;
var enemy_bat;
var distance_bat = 0;
var batText;
var counter_enemy_bat = 0;
var bat_follow = 200;

var enemy_group_stalactite;
var enemy_stalactite;

var enemy_group_dig;
var enemy_dig;


var game_over;
var game_over_bg;
var button_retry;
var button_quit;
var game_over_text;


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 800, 400, 'background');
    bg.fixedToCamera = true;

    bgm_level1 = game.add.audio('bgm_level1');
    bgm_music = [bgm_level1];
    game.sound.setDecodedCallback(bgm_music, bgm_loop, this);

    //game_over_text = game.add.text(game.world.centerX, 400, 'Game Over', { font: "40px Courier New", fill: "#ffffff", align: "center" });

    //////////////////WORLD/////////////////////////////////////////////
    map = game.add.tilemap('level1');
    map.addTilesetImage('CaveTileset', 'tiles-1');
    map.addTilesetImage('corpse_1');
    map.addTilesetImage('props1', 'tiles-2');
    //map.addTilesetImage('props4');

    map.setCollisionBetween(0, 599, true, 'ground_v2');
    layer = map.createLayer('ground_v2');

    //map.setCollisionBetween(0, 740, true, 'object_climb');
    //layer_climb = map.createLayer('object_climb');
    //layer_climb = game.add.physicsGroup(Phaser.Physics.ARCADE);
    //layer_climb = map.createLayer('object_climb');
    //layer_climb.body.immovable = true;
    //map.createLayer('object_climb');
    //map.createLayer('health');
    map.createLayer('spike_pit_layer_1');
    map.createLayer('spike_pit_layer_2');
    //map.createLayer('object_climb');

    layer.resizeWorld();
    //layer_climb.resizeWorld();

    game.physics.arcade.gravity.y = 1500;

    /////////PLAYER//////////////////////////////////

    object_player();

    /////////////ENEMY_BAT/////////////////////////

    object_bat();

    //////BATTERY////////////////////////////
    player_battery();
    object_battery_item();
    ////HEALTH/////////////////////////

    player_health();
    object_health_item();


    ///////////OBJECT CLIMB///////////////////////////////////////////
    object_climb();

    ////////////////////////FALLING OBJECT//////////////////////////
    object_stalactite();


    //////////////////DIGGABLE OBJECT//////////////////////////////
    object_dig();

    /////////////////////////////////////////////////////////////

    cursors = game.input.keyboard.createCursorKeys();
    attack = game.input.keyboard.addKey(Phaser.Keyboard.D);
    run = game.input.keyboard.addKey(Phaser.Keyboard.W);

}

function object_climb() {
    root = game.add.sprite(9800, 400, 'props4');
    root.smoothed = false;
    game.physics.enable(root, Phaser.Physics.ARCADE);
    root.body.collideWorldBounds = true;
    root.anchor.set(0.5, 0.5);
    root.body.immovable = true;
}

function object_player() {
    player = game.add.sprite(32, 600, 'Player');
    player.smoothed = false;
    //player.scale.setTo(4,2);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;

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



function object_bat() {
    enemy_group_bat = game.add.physicsGroup(Phaser.Physics.ARCADE);

    //enemy_group_bat = game.add.group();
    //enemy_group_bat.enableBody = true;
    //enemy_group_bat.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 100; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        enemy_bat = enemy_group_bat.create(game.world.randomX, game.world.randomY, 'Bat');
        enemy_bat.animations.add('idle_bat', [0, 1, 2, 3, 4, 5, 6], 3, true);
        enemy_bat.scale.setTo(1.1);
        enemy_bat.name = 'bat' + i;
        enemy_bat.body.immovable = true;
        enemy_bat.animations.play('idle_bat');

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

    for (var i = 0; i < 50; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        enemy_dig = enemy_group_dig.create(game.world.randomX, game.world.randomY, 'diggable_objects');
        ///enemy_dig.scale.setTo(1.1);
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

    //enemy_group_bat = game.add.group();
    //enemy_group_bat.enableBody = true;
    //enemy_group_bat.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 50; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        battery_item = group_battery_item.create(game.world.randomX, game.world.randomY, 'corpse_battery');
        //health_item.animations.add('idle_bat', [0, 1, 2, 3, 4, 5, 6], 3, true);

        battery_item.name = 'battery_item' + i;
        battery_item.body.immovable = true;
        //health_item.animations.play('idle_bat');
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

    //enemy_group_bat = game.add.group();
    //enemy_group_bat.enableBody = true;
    //enemy_group_bat.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 50; i++) {
        //Try this later
        // Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        health_item = group_health_item.create(game.world.randomX, game.world.randomY, 'corpse_health');
        //health_item.animations.add('idle_bat', [0, 1, 2, 3, 4, 5, 6], 3, true);

        health_item.name = 'health_item' + i;
        health_item.body.immovable = true;
        //health_item.animations.play('idle_bat');
        health_item.scale.setTo(1);

    }

}



function game_over_player() {
    game.paused = true;
    game.stage.backgroundColor = '#000000';
    game_over_bg = game.add.tileSprite(0, 0, 800, 400, 'background');
    game_over_bg.fixedToCamera = true;
    game_over_text = game.add.text(400, 300, 'Game Over', { font: "80px Courier New", fontWeight: "bold", fill: "#ffffff", align: "center" });
    game_over_text.anchor.setTo(0.5, 0.5);

    //game_over_text.text = 'Game Over';
    game_over_text.visible = true;

    button_quit = game.add.button(400, 550, 'button_quit');
    button_quit.anchor.setTo(0.5, 0.5);
}

//function create_group_bat() {

//    enemies_bat = enemy_bat.create(game.world.randomX, game.world.randomY, 'Bat');
//    enemies_bat.body.gravity.y = 6;
//    enemies_bat.body.bounce.y = 0.7 + Math.random() * 0.2;
//}


function detect_player_bat(player, bat) {

    bat.anchor.set(0.5);
    //bat.body.velocity.x = bat_follow;
    //bat.animations.add('idle_bat', [0, 1, 2, 3, 4, 5, 6], 3, true);
    //bat.animations.add('alert', [8, 9, 10, 11, 12, 13], 6, false);
    ////bat.animations.add('fly_bat', [16, 17, 18, 19, 20, 21, 22], 10, true);
    //bat.animations.add('attack_bat', [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
    //bat.animations.add('dead_bat', [32, 33, 34, 35, 36, 37], 10, false);
    bat.animations.add('fly_bat', [16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31], 15, true);


    //game.physics.arcade.moveToObject(bat, player, 60, bat_follow);
    game.physics.arcade.moveToObject(bat, player, bat_follow);

    bat.play('fly_bat');

    if (player.x - bat.x > 0) {
        bat.scale.x = -1;
    } else {
        bat.scale.x = 1;
    }


}

function checkOverlap_player_bat(player, bat) {

    var bounds_bat = bat.getBounds();
    var bounds_player = player.getBounds();

    return Phaser.Rectangle.intersects(bounds_player, bounds_bat);

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


function attack_player_bat(player, bat) {

    bat.anchor.set(0.5);
    //bat.animations.add('idle_bat', [0, 1, 2, 3, 4, 5, 6], 3, true);
    //bat.animations.add('alert', [8, 9, 10, 11, 12, 13], 6, false);
    //bat.animations.add('fly_bat', [16, 17, 18, 19, 20, 21, 22], 10, true);
    ///bat.animations.add('attack_bat', [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
    //bat.animations.add('dead_bat', [32, 33, 34, 35, 36, 37], 10, false);

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





function bgm_loop() {
    bgm_music.shift();

    bgm_level1.loopFull(0.6);

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

function movement_player() {
    if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer) {

        player.body.velocity.y = -500;

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
        player.body.velocity.x = 5;
        player.animations.play('attack');
        //game.physics.arcade.overlap(player, enemy_group_bat, player_bat, null, this);
    }

    else if (game.physics.arcade.overlap(player, root)) {
        //game.physics.arcade.gravity.y = 0;
        player.body.velocity.x = 0;

        if (run.isDown && cursors.up.isDown) {
        //player.body.gravity.y = 0;
        //game.physics.arcade.gravity.y = 0;
            player.body.velocity.y = -climb * 2;
            player.animations.play('climb');

        }else if (run.isDown && cursors.down.isDown) {
            player.body.velocity.y = climb* 2;
            player.animations.play('climb');

        }else if (cursors.up.isDown) {
            //player.body.gravity.y = 0;
            //game.physics.arcade.gravity.y = 0;
            player.body.velocity.y = -climb;
            player.animations.play('climb');

        }else if (cursors.down.isDown) {
            player.body.velocity.y = climb;
            player.animations.play('climb');

        }else {
            //player.body.velocity.y = 0;
            player.animations.stop();
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


function update() {

    player_effect_light();
    //player_health();
    game.physics.arcade.collide(player, layer);
    //game.physics.arcade.overlap(player, root, player_climb_obstacle);
    game.physics.arcade.collide(layer, root);

    //game.physics.arcade.overlap(player, enemy_group_bat);
    game.physics.arcade.collide(enemy_group_bat, layer);

    game.physics.arcade.collide(group_health_item, layer);
    game.physics.arcade.collide(group_battery_item, layer);

    game.physics.arcade.collide(enemy_group_dig, layer);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    movement_player();


    player_health_group.forEachDead(function (health) {
        if (game.physics.arcade.overlap(group_health_item, player)) {

            var delete_item_health;
            delete_item_health = group_health_item.getClosestTo(player);


            if (player_health_status < 4) {
                injuryTimer = 0;
                player_health_status = player_health_status + 1;
                health.revive();
                delete_item_health.kill();
                //player_health();
            } else if (player_health_status >= 4) {
                player_health_status = 4;
                //player_health();
            }
        }

    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                    player_health_status = player_health_status-1;
                    injuryTimer = 0;
                }
            }

        }
        else {
            game.physics.arcade.collide(stalactite, layer);
        }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    enemy_group_dig.forEachAlive(function (dig) {

        if (game.physics.arcade.collide(dig, player) && attack.isDown) {

            digTimer++;

            if (digTimer >= 40) {
                dig.kill();
                digTimer = 0;
            }

        }
        else {
            game.physics.arcade.collide(dig, player);
        }

    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    enemy_group_bat.forEachAlive(function (bat) {

        if (player.bottom == bat.bottom && game.physics.arcade.distanceBetween(bat, player) <= 70) {
            //game.physics.arcade.moveToObject(bat, player, 60, bat_follow);
            detect_player_bat(player, bat);

        }

        var reduce_health;
        reduce_health = player_health_group.getFirstAlive();

        if (game.physics.arcade.overlap(bat, player) && !attack.isDown) {
            injuryTimer++;
            attack_player_bat(player, bat);

            player.animations.play('hurt');

            if (injuryTimer >= 30) {
                if (player_health_status == 0) {
                    game_over_player();
                }
                else {
                    reduce_health.kill();
                    player_health_status = player_health_status-1;
                    injuryTimer = 0;
                }

            }

        }
        else if (game.physics.arcade.overlap(bat, player) && attack.isDown) {
            //attack_player_bat(player, bat);
            player_kill_bat(player, bat);
        }

    });

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
    else if (battery_timer >= 900) {
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
                //player_health();
            } else if (player_battery_status >= 4) {
                player_battery_status = 4;
                //player_health();
            }
        }

    });


    if (player.body.bottom >= game.world.bounds.bottom) {

        player_health_status = 0;
        //game_over_player();

        if (player_health_status == 0) {
            game_over_player();
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



}