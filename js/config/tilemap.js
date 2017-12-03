const mapTileWidth = 20;
const mapTileHeight = 15;

const TILE_SIZE = 32;
const STARTING_MAP_X = 1;
const STARTING_MAP_Y = 0;

var tiles = [];

var metaMap = [
    [1, 0],
    [2, 3],
];

var mapData = {
    0: {
        tileWidth: mapTileWidth,
        tileHeight: mapTileHeight,
        tiles: [
            [0, 11, 0],
            [1, 11, 0],
            [0, 12, 0],
            [1, 12, 0],
            [15, 13, 0],
            [16, 13, 0],
            [15, 14, 0],
            [16, 14, 0],
        ],
        entities: [
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
        ],
    },
    2: {
        tileWidth: mapTileWidth,
        tileHeight: mapTileHeight,
        tiles: [
        ],
        entities: [
        ],
    },
    3: {
        tileWidth: mapTileWidth,
        tileHeight: mapTileHeight,
        tiles: [
            [15, 0, 0],
            [16, 0, 0],
            [15, 1, 0],
            [16, 1, 0],
        ],
        entities: [
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

function getWarps(mapX, mapY) {
    var warps = [];
    map = mapData[metaMap[currentMapY][currentMapX]];
    if (metaMap[currentMapY][currentMapX - 1]) {
        leftMap = mapData[metaMap[currentMapY][currentMapX - 1]];
        warps.push(new Warp(-1 * TILE_SIZE, 0, TILE_SIZE, map.tileHeight * TILE_SIZE, currentMapX - 1, currentMapY, leftMap.tileWidth * TILE_SIZE - 3 * TILE_SIZE, null));
    }
    warps.push(new Warp(map.tileWidth * TILE_SIZE, 0, TILE_SIZE, map.tileHeight * TILE_SIZE, currentMapX + 1, currentMapY, 2 * TILE_SIZE, null));
    if (metaMap[currentMapY - 1] && metaMap[currentMapY - 1][currentMapX]) {
        topMap = mapData[metaMap[currentMapY - 1][currentMapX]];
        warps.push(new Warp(0, -1 * TILE_SIZE, map.tileWidth * TILE_SIZE, TILE_SIZE, currentMapX, currentMapY - 1, null, topMap.tileHeight * TILE_SIZE - 4 * TILE_SIZE));
    }
    warps.push(new Warp(0, map.tileHeight * TILE_SIZE, map.tileWidth * TILE_SIZE, TILE_SIZE, currentMapX, currentMapY + 1, null, TILE_SIZE * 2));
    return warps;
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
    getWarps(currentMapX, currentMapY).forEach(function(warp, i) {
        entities.push(warp);
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
