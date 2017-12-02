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
            [1, 11, 0],
        ],
        entities: [
            function() { return new Warp(-32, 608, 32, 96, 3, 950, 640); },
        ],
        onStartup: function() {
            console.log('Level 0 loaded');
        }
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
