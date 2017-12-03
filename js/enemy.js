const FLASH_TIMER_FRAMES = 0.05 * FPS;
const STRAFE_TIMER_FRAMES = 1.8 * FPS;
const ENEMY_FLINCH_SPEED = 4;
const ENEMY_FLINCH_FRAMES = 0.3 * FPS;
const ENEMY_SPEED = 3;

const ENEMY_LEVELS = {
    1: { behavior: 0, color: '#047', size: 32, hp: 3, damage: 1, xp: 20},
    4: { behavior: 0, color: '#074', size: 32, hp: 15, damage: 6, xp: 20},
};

const behaviors = {
    strafe: 0,
};

function Enemy(x, y, facingRight, level) {
    Entity.call(this, x, y);
    level = level || 1;
    this.level = level;
    this.width = ENEMY_LEVELS[this.level].size;
    this.height = ENEMY_LEVELS[this.level].size;
    this.health = ENEMY_LEVELS[this.level].hp;
    this.experience = ENEMY_LEVELS[this.level].xp;
    this.behavior = ENEMY_LEVELS[this.level].behavior;
    this.facingRight = facingRight || false;
    loadImage('enemy-stand.png');
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.nextTileX = function() {
    return this.facingRight ? tileIndex(this.x) + 1 : tileIndex(this.x - 1);
}

Enemy.prototype.update = function() {
    if (this.flinching) {
        if (this.flinchTimer > 0) {
            this.flinchTimer--;
        }
        else {
            this.flinching = false;
            this.xVelocity = 0;
        }
    }
    else {
        if (this.behavior == behaviors.strafe) {
            this.strafe();
        }
    }
    this.yVelocity = 0;
    this.handleGravity();
    handleTileCollision(this);
    if (this.flashTimer > 0) {
        this.color = '#f22';
        this.filter = 'contrast(0) sepia() saturate(100)';
        this.flashTimer--;
    }
    else{
        this.color = ENEMY_LEVELS[this.level].color;
        this.filter = null;
    }
    handleEntityCollision(this);
    Entity.prototype.update.call(this);
};

Enemy.prototype.strafe = function(entity) {
    this.xVelocity = ENEMY_SPEED;
    if (!this.facingRight) {
        this.xVelocity *= -1;
    }
    if (isTilePassable(this.nextTileX(), tileIndex(this.y) + 1) ||
        !isTilePassable(this.nextTileX(), tileIndex(this.y))) {
        this.facingRight = !this.facingRight;
    }
};

Enemy.prototype.handleEntityCollision = function(entity) {
    if (entity.active) {
        this.health -= entity.damage(this);
        this.flashTimer = FLASH_TIMER_FRAMES;
        if (this.health <= 0) {
            this.remove();
            player.gainXP(this.experience, this.level);
        }
        this.flinching = true;
        if (entity.x > this.x) {
            this.xVelocity = -1 * ENEMY_FLINCH_SPEED;
            this.facing = directions.right;
        }
        else {
            this.xVelocity = ENEMY_FLINCH_SPEED;
            this.facing = directions.left;
        }
        this.flinchTimer = ENEMY_FLINCH_FRAMES;
    }
};

Enemy.prototype.damage = function(entity) {
    return ENEMY_LEVELS[this.level].damage;
}

Enemy.prototype.draw = function() {
    if (SHOW_HITBOXES) {
        Entity.prototype.draw.call(this);
    }
    if (this.facingRight) {
        drawImage('enemy-stand-right.png', this.x, this.y - 12, false, this.filter);
    }
    else {
        drawImage('enemy-stand-left.png', this.x, this.y - 12, false, this.filter);
    }
};
