const FLASH_TIMER_FRAMES = 0.05 * FPS;
const ENEMY_JUMP_MAX = 0.36 * FPS;
const ENEMY_FLINCH_FRAMES = 0.3 * FPS;

const ENEMY_LEVELS = {
    1: { behavior: 0, color: '#047', size: 32, hp: 3, damage: 1, xp: 20, speed: 3},
    2: { behavior: 1, color: '#047', size: 64, hp: 6, damage: 2, xp: 50, speed: 2},
    3: { behavior: 2, color: '#047', size: 128, hp: 20, damage: 4, xp: 100, speed: 5},
    4: { behavior: 0, color: '#074', size: 32, hp: 15, damage: 6, xp: 20},
};

const behaviors = {
    strafe: 0,
    jump: 1,
    charge: 2,
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
        else if (this.behavior == behaviors.jump) {
            this.jump();
        }
        else if (this.behavior == behaviors.charge) {
            this.charge();
        }
    }
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

Enemy.prototype.detectionZone = function() {
    const x = this.x - (this.facingRight ? TILE_SIZE * 2 : TILE_SIZE * 6);
    return {x: x, y: this.y - TILE_SIZE, width: this.width + TILE_SIZE * 8, height: this.height + TILE_SIZE * 2};
};

Enemy.prototype.strafe = function() {
    this.xVelocity = ENEMY_LEVELS[this.level].speed;
    if (!this.facingRight) {
        this.xVelocity *= -1;
    }
    if (isTilePassable(this.nextTileX(), tileIndex(this.y) + 1) ||
        !isTilePassable(this.nextTileX(), tileIndex(this.y))) {
        this.facingRight = !this.facingRight;
    }
    this.yVelocity = 0;
    this.handleGravity();
};

Enemy.prototype.jump = function() {
    if (areColliding(player, this.detectionZone())) {
        this.xVelocity = ENEMY_LEVELS[this.level].speed;
        if (this.onGround) {
            this.facingRight = player.x >= this.x;
            this.onGround = false;
            this.jumpTimer = ENEMY_JUMP_MAX;
            this.jumping = true
        }
        if (!this.facingRight) {
            this.xVelocity *= -1;
        }
    }
    else if (this.onGround) {
        this.xVelocity = 0;
        this.handleGravity();
    }
    if (this.jumpTimer > 0 && !this.onGround && this.jumping) {
        this.jumpTimer--;
        this.handleGravity(true);
    }
    else {
        this.jumpTimer = 0;
        this.jumping = false;
        this.handleGravity();
    }
};

Enemy.prototype.charge = function() {
    if (areColliding(player, this.detectionZone())) {
        this.xVelocity = ENEMY_LEVELS[this.level].speed;
        this.facingRight = player.x >= this.x;
        if (!this.facingRight) {
            this.xVelocity *= -1;
        }
    }
    else {
        this.xVelocity = 0;
    }
    this.yVelocity = 0;
    this.handleGravity();
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
        this.xVelocity = ENEMY_LEVELS[this.level].speed + 1;
        if (entity.x > this.x) {
            this.xVelocity *= -1;
        }
        else {
            this.facingRight = false;
        }
        this.flinchTimer = ENEMY_FLINCH_FRAMES;
    }
};

Enemy.prototype.damage = function(entity) {
    return ENEMY_LEVELS[this.level].damage;
}

Enemy.prototype.draw = function() {
    if (SHOW_HITBOXES) {
        if (SHOW_DETECTION_ZONES && this.behavior != behaviors.strafe) {
            const detectionZone = this.detectionZone();
            drawRect(detectionZone.x, detectionZone.y, detectionZone.width, detectionZone.height, '#e00');
        }
        Entity.prototype.draw.call(this);
    }
    if (this.facingRight) {
        drawImage('enemy-stand-right.png', this.x, this.y - 12, false, this.filter);
    }
    else {
        drawImage('enemy-stand-left.png', this.x, this.y - 12, false, this.filter);
    }
};
