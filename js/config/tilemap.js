const mapTileWidth = 20;
const mapTileHeight = 15;

const TILE_SIZE = 32;
const STARTING_MAP = 0;

var tiles = [];

var mapData = {
    0: {
        tileWidth: mapTileWidth,
        tileHeight: mapTileHeight,
        tiles: [
            [0, 11, 0],
            [1, 11, 0],
            [0, 12, 0],
            [1, 12, 0],
        ],
        entities: [
            function() { return new Warp(-32, 352, 32, 64, 1, 1180, 352); },
        ],
        onStartup: function() {
            console.log('Level 0 loaded');
        }
    },
    1: {
        tileWidth: mapTileWidth * 2,
        tileHeight: mapTileHeight,
        tiles: [
            [38, 11, 0],
            [39, 11, 0],
            [38, 12, 0],
            [39, 12, 0],
            [15, 9, 1],
            [16, 9, 1],
            [17, 9, 1],
            [18, 9, 1],
        ],
        entities: [
            function() { return new Enemy(500, 232, false) },
            function() { return new Enemy(100, 200, true, 3) },
            function() { return new Enemy(700, 300, false, 2) },
            function() { return new Warp(1280, 352, 32, 64, 0, 64, 352); },
        ],
    },
};

function fetchTiles(mapId) {
    mapId = mapId || currentMap;
    tileWidth = mapData[mapId].tileWidth || mapTileWidth;
    if (tileWidth < mapTileWidth) {
        tileWidth = mapTileWidth;
    }
    tileHeight = mapData[mapId].tileHeight || mapTileHeight;
    if (tileHeight < mapTileHeight) {
        tileHeight = mapTileHeight;
    }
    tiles = [];
    for (var i = 0; i < tileHeight; i++) {
        var row = [];
        for (var j = 0; j < tileWidth; j++) {
            row.push(0);
        }
        tiles.push(row);
    }

    

    var baseTiles = [
    ];
    for (var i = 0; i < tileWidth; i++) {
        for (var j = 0; j < tileHeight; j++) {
            if (i < 2 || i > tileWidth - 3 || j < 2 || j > tileHeight - 3) {
                baseTiles.push([i, j, 1]);
            }
        }
    }
    baseTiles.forEach(function(data, i) {
        tiles[data[1]][data[0]] = data[2];
    });

    mapData[mapId].tiles.forEach(function(data, i) {
        tiles[data[1]][data[0]] = data[2];
    });
    mapWidth = TILE_SIZE * tileWidth;
    mapHeight = TILE_SIZE * tileHeight;
}

function fetchEntities(mapId) {
    mapId = mapId || currentMap;
    entities = [];
    mapData[mapId].entities.forEach(function(entity, i) {
        if (typeof entity == 'function') {
            entities.push(entity());
        }
        else {
            entities.push(entity);
        }
    });
    entities.push(player);
}

function handleMapStartup(mapId) {
    mapId = mapId || currentMap;
    startupFunction = mapData[mapId].onStartup;
    if (startupFunction) {
        startupFunction();
    }
}
