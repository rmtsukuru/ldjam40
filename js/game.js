const HEALTH_BAR_DELAY_FRAMES = 0.8 * FPS;
const HEALTH_BAR_DECAY_FRAMES = 0.02 * FPS;
const HEALTH_BAR_DECAY_RATE = 1;

var hudHP, hudHPTimer, hudHPDelayed;

var upgradesCollected = [];

function resetGame(initial) {
    if (initial) {
        player = new Player(300, 200); 
    }
    else {
        player.x = 300;
        player.y = 200;
        player.reset();
    }
    currentMap = STARTING_MAP;
    loadMap();

    for (var i = 0; i < FPS; i++) {
        update();
    }
}

function configureGame() {
    resetGame(true);
}

function update() {
    if (triggerKeyState.q) {
        minimapEnabled = !minimapEnabled;
    }
    entities.forEach(function(entity, i) {
        entity.update();
    });
    updateCamera(player);
    updateInput();
}

function drawHud() {
    hudHP = hudHP || player.health;
    if (hudHP > player.health) {
        if (hudHPTimer > 0) {
            hudHPTimer--;
        }
        else if (hudHPDelayed) {
            hudHPTimer = HEALTH_BAR_DELAY_FRAMES;
            hudHPDelayed = false;
        }
        else {
            hudHPTimer = HEALTH_BAR_DECAY_FRAMES;
            hudHP = Math.max(hudHP - HEALTH_BAR_DECAY_RATE, player.health);
        }
    }
    else {
        hudHP = player.health;
    }
    drawRect(0, 0, player.maxHP * 194 / 100 + 6, 20, '#000', true);
    drawRect(1, 1, player.maxHP * 194 / 100 + 4, 18, '#fff', true);
    drawRect(3, 3, player.maxHP * 194 / 100, 14, '#000', true);
    drawRect(3, 3, Math.max(0, hudHP * 194 / 100), 14, '#f00', true);
    drawRect(3, 3, Math.max(0, player.health * 194 / 100), 14, HEALTH_UPGRADE_COLOR, true);
    hudXP = player.experience % 100;
    level = player.level();
    drawText('LV ' + level, 3, 43, null, 28, '#fff', true);
    drawRect(50, 25, 149, 20, '#fff', true);
    drawRect(52, 27, 145, 16, '#000', true);
    drawRect(52, 27, 145 * hudXP / 100, 16, '#0de', true);
}

function drawDebugHud() {
    drawText('X: ' + player.x + ' Y: ' + player.y, 480, 15, null, 18, '#2f2', true);
    drawText('Tile X: ' + tileIndex(player.x) + ' Tile Y: ' + tileIndex(player.y), 480, 30, null, 18, '#f2f', true);
    if (minimapEnabled) {
        drawMinimap(true);
    }
}

function draw() {
    drawRect(0, 0, canvasWidth, canvasHeight, '#004247', true);
    drawBackgroundTiles();
    entities.forEach(function(entity, i) {
        entity.draw();
    });
    drawForegroundTiles();
    drawHud();
    if (DEBUG_DISPLAY) {
        drawDebugHud();
    }
}
