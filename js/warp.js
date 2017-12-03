function Warp(x, y, width, height, destinationMapX, destinationMapY, destinationX, destinationY) {
    Entity.call(this, x, y);
    this.color = '#3f0';
    this.width = width || TILE_SIZE;
    this.height = height || TILE_SIZE;
    this.destinationMapX = destinationMapX;
    this.destinationMapY = destinationMapY;
    this.destinationX = destinationX;
    this.destinationY = destinationY;
}

Warp.prototype = Object.create(Entity.prototype);

Warp.prototype.update = function() {
    Entity.prototype.update.call(this);
}

Warp.prototype.draw = function() {
    Entity.prototype.draw.call(this);
}
