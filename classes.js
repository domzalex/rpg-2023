class Sprite {
    constructor({
        position,
        velocity,
        image,
        frames = { max: 1 },
        sprites,
        maxHp,
        health,
        atk,
        def,
        spd,
        exp,
        money
    }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
        this.maxHp = maxHp
        this.health = health
        this.atk = atk
        this.def = def
        this.spd = spd
        this.exp = exp
        this.money = money
    }
    draw() {
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        
        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

class Boundary {
    static width = 80
    static height = 80
    constructor({position}) {
        this.position = position
        this.width = 20
        this.height = 20
    }
    draw() {
        ctx.fillStyle = 'rgba(255,0,0,0.3)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}