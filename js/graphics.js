var cameraX = 0;
var cameraY = 0;

var canvas, graphicsContext;
var canvasWidth, canvasHeight;
var baseWidth, baseHeight;
var scalingFactor;

var mapWidth = mapTileWidth * TILE_SIZE;
var mapHeight = mapTileHeight * TILE_SIZE;

var images = {};

var updateCamera;

function loadImage(filename) {
    var image = {loaded: false};
    image.data = document.createElement('img');
    image.data.onload = function() {
        image.loaded = true;
    };
    image.data.src = 'img/' + filename;
    images[filename] = image;
}

function imageLoaded(filename) {
    if (images[filename] && images[filename].loaded) {
        return true;
    }
    if (!images[filename]) {
        loadImage(filename);
    }
}

function fetchImage(filename) {
    if (imageLoaded(filename)) {
        return images[filename].data;
    }
}

function configureGraphics(player) {
    canvas = document.getElementById('gameCanvas');
    graphicsContext = canvas.getContext('2d');
    canvas.height = document.body.clientHeight;
    scalingFactor = Math.round(canvas.height / BASE_HEIGHT * 1000) / 1000;
    if (Math.abs(Math.round(scalingFactor) - scalingFactor) < 0.01) {
        scalingFactor = Math.round(scalingFactor);
    }
    baseWidth = BASE_HEIGHT * ASPECT_RATIO;
    baseHeight = BASE_HEIGHT;
    canvas.width = baseWidth * scalingFactor;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    if (player) {
        updateCamera(player);
    }
}

function drawTiledImage(filename, x, y, ignoreCamera, sourceX, sourceY, sourceWidth, sourceHeight, width, height, filter) {
    if (imageLoaded(filename)) {
        var image = fetchImage(filename);
        sourceWidth = sourceWidth || image.width;
        sourceHeight = sourceHeight || image.height;
        width = width || image.width;
        height = height || image.height;
        graphicsContext.filter = filter || 'none';
        if (ignoreCamera) {
            graphicsContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
        }
        else {
            graphicsContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x - cameraX, y - cameraY, width, height);
        }
        graphicsContext.filter = 'none';
    }
}

function drawImage(filename, x, y, ignoreCamera, filter) {
    drawTiledImage(filename, x, y, ignoreCamera, 0, 0, null, null, null, null, filter);
}

function drawRect(x, y, width, height, color, ignoreCamera) {
    graphicsContext.fillStyle = color;
    if (ignoreCamera) {
        graphicsContext.fillRect(x * scalingFactor, y * scalingFactor, width * scalingFactor, height * scalingFactor);
    }
    else {
        graphicsContext.fillRect(Math.floor((x - cameraX) * scalingFactor), Math.floor((y - cameraY) * scalingFactor), Math.ceil(width * scalingFactor), Math.ceil(height * scalingFactor));
    }
}

function drawText(text, x, y, font, fontSize, color, ignoreCamera) {
    font = font || 'VT323';
    fontSize = fontSize * scalingFactor + 'px';
    graphicsContext.font = fontSize + ' ' + font;
    graphicsContext.fillStyle = color;
    if (ignoreCamera) {
        graphicsContext.fillText(text, x * scalingFactor, y * scalingFactor);
    }
    else {
        graphicsContext.fillText(text, (x - cameraX) * scalingFactor, (y - cameraY) * scalingFactor);
    }
}

updateCamera = function(target) {
    cameraX = target.x - baseWidth / 2;
    cameraY = target.y - baseHeight / 2;

    if (cameraX < 0) {
        cameraX = 0;
    }
    else if (cameraX + baseWidth > mapWidth) {
        cameraX = Math.max(0, mapWidth - baseWidth);
    }

    if (cameraY < 0) {
        cameraY = 0;
    }
    else if (cameraY + baseHeight > mapHeight) {
        cameraY = Math.max(0, mapHeight - baseHeight);
    }
}
