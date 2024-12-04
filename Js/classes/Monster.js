class Monster extends Sprite{
    constructor({ collisionBlocks = [], imageSrc, frameRate, frameBuffer, animations,loop}) {
        super({imageSrc, frameRate, loop, frameBuffer, animations})
        this.position = {
            x: 500,
            y: 270,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.sides  = {
            bottom: this.position.y + this.height
        }

        this.collisionBlocks = collisionBlocks
    }

    update(){
        //blue box
        //c.fillStyle = 'rgba(0, 0, 255, 0.5)'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)

        this.updateHitbox();
        this.touchHitbox();

        //c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
    }

    switchSprite(name){
        if (this.image === this.animations[name].image) return
        this.currentFrame = 0
        this.image = this.animations[name].image
        this.frameRate = this.animations[name].frameRate
        this.frameBuffer = this.animations[name].frameBuffer
        this.loop = this.animations[name].loop
        this.currentAnimation = this.animations[name]
    }

    updateHitbox(){
        this.hitbox = {
            position: {
                x: this.position.x + 35, //right of box
                y: this.position.y + 26, //bottom of box
            },
            width: 50,
            height: 50,
        }
    }

    touchHitbox(){
        //console.log("box: " + parseInt(this.hitbox.position.y - 34)) //297 top of box
        //console.log("player: " + parseInt(player.position.y + 34)) //+34 = 330
        //let hits = 0; 
        if (this.hitbox.position.x - 35 <= player.position.x + 58 &&
            this.hitbox.position.x >= player.position.x  &&
            parseInt(player.position.y + 34) >= parseInt(this.hitbox.position.y - 34)
            )
            {
                this.switchSprite('onHit')
                player.position.x = this.position.x;
                player.position.y = this.position.y -10;
            }
    }
    
}