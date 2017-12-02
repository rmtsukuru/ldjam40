var cameraX = 0;
var cameraY = 0;

var canvas, graphicsContext;
var canvasWidth, canvasHeight;
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
    canvas.width = Math.floor(canvas.height * ASPECT_RATIO);
    scalingFactor = Math.round(canvas.height / BASE_HEIGHT * 10) / 10;
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
        graphicsContext.fillRect((x - cameraX) * scalingFactor, (y - cameraY) * scalingFactor, width * scalingFactor, height * scalingFactor);
    }
}

function drawText(text, x, y, font, fontSize, color, ignoreCamera) {
    font = font || 'VT323';
    graphicsContext.font = fontSize + ' ' + font;
    graphicsContext.fillStyle = color;
    if (ignoreCamera) {
        graphicsContext.fillText(text, x, y);
    }
    else {
        graphicsContext.fillText(text, (x - cameraX) * scalingFactor, (y - cameraY) * scalingFactor);
    }
}

updateCamera = function(target) {
    cameraX = target.x - canvasWidth / 2;
    cameraY = target.y - canvasHeight / 2;

    if (cameraX < 0) {
        cameraX = 0;
    }
    else if (cameraX + canvasWidth > mapWidth) {
        cameraX = mapWidth - canvasWidth;
    }

    if (cameraY < 0) {
        cameraY = 0;
    }
    else if (cameraY + canvasHeight > mapHeight) {
        cameraY = mapHeight - canvasHeight;
    }
}
