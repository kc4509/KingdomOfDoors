
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let audio = new Audio('../others/bgm.mp3');

canvas.width = 64 * 16 //1024
canvas.height = 64 * 9 //576

const collisionsLevel1 = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 0,
    0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
    0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
    0, 292, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
    0, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]

const collisionsLevel2 = [292, 292, 292, 292, 292, 292, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    292, 0, 0, 0, 0, 0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    292, 0, 0, 0, 0, 0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    292, 292, 292, 292, 0, 0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 292, 0, 0, 292, 0, 0, 292, 292, 292, 292, 292, 292, 0,
    0, 292, 292, 292, 0, 0, 292, 292, 292, 292, 0, 0, 0, 0, 292, 0,
    0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
    0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 292, 292, 292, 292, 292, 0,
    0, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 0, 0, 0, 0
]

const collisionsLevel3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 0,
    0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250, 0,
    0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250, 0,
    0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 250, 250, 250, 250, 250, 0,
    0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250, 0, 0,
    0, 250, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250, 250, 0, 0,
    0, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]


let parsedCollisions
let collisionBlocks
let background
let doors
let monster

//plays bgm
audio.play();
audio.addEventListener('ended', function(){
    this.currentTime = 0;
    this.play();
}, false);

//creates a new monster
const enemy = new Monster({
    imageSrc: './img/Monster/monsterAttack2.png',
    frameRate: 9,
    frameBuffer: 7,
    animations: {
        idle: {
            imageSrc: './img/Monster/monsterAttack2.png',
            frameRate: 9,
            frameBuffer: 7,
            loop: true,
        },
        onHit:{
            imageSrc: './img/Monster/monsterAttack2.png',
            frameRate: 9,
            frameBuffer: 7,
            loop: false,
            onComplete: () => {
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level = 1
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false;
                        enemy.switchSprite('idle')
                        enemy.preventInput = false;
                        gsap.to(overlay, {
                            opacity: 0
                        })
                    }
                })
            },
        } 
    }
})


//creates a new player 
const player = new Player({
    imageSrc: './img/king/idle.png',
    frameRate: 11,
    animations: {
        idleRight: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/idle.png',
        },
        idleLeft: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/idleLeft.png',
        },
        runRight: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: './img/king/runRight.png',
        },
        runLeft: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: './img/king/runLeft.png',
        },
        enterDoor: {
            frameRate: 8,
            frameBuffer: 4,
            loop: false,
            imageSrc: './img/king/enterDoor.png',
            onComplete: () => {
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++
                        if (level === 4) level = 1
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false;
                        gsap.to(overlay, {
                            opacity: 0
                        })
                    }
                })
            },
        }
    }
})




let level = 1
let levels = {
    2: {
        init: () => {
            parsedCollisions = collisionsLevel1.parse2D()
            collisionBlocks = parsedCollisions.createObjectFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 200
            player.position.y = 200
            enemy.position.x = 500
            enemy.position.y = 305
            if (player.currentAnimation) player.currentAnimation.isActive = false
            if (enemy.currentAnimation) enemy.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/backgroundLevel1.png',
            })


            doors = [
                new Sprite({
                    position: {
                        x: 767,
                        y: 270,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                })
            ]
        }
    },
    3: {
        init: () => {
            parsedCollisions = collisionsLevel2.parse2D()
            collisionBlocks = parsedCollisions.createObjectFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 96
            player.position.y = 140
            enemy.position.x = 200
            enemy.position.y = 435
            if (player.currentAnimation) player.currentAnimation.isActive = false
            if (enemy.currentAnimation) enemy.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/backgroundLevel2.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 772,
                        y: 340,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                })
            ]
        }
    },
    1: {
        init: () => {
            parsedCollisions = collisionsLevel3.parse2D()
            collisionBlocks = parsedCollisions.createObjectFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 720
            player.position.y = 150
            enemy.position.x = 350
            enemy.position.y = 370
            if (player.currentAnimation) player.currentAnimation.isActive = false
            if (enemy.currentAnimation) enemy.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/backgroundLevel3.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 176,
                        y: 335,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                })
            ]
        }
    }
}








const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    }
}

const overlay = {
    opacity: 0
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.draw()
    //collisionBlocks.forEach(collisionBlock => {
        //collisionBlock.draw()
    //})

    doors.forEach((door) => {
        door.draw()
    })



    player.handleInput(keys)
    player.draw()
    enemy.draw()
    enemy.update()
    enemy.touchHitbox()
    player.update()

    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
}

levels[level].init()
animate()



