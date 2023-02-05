// MAIN GAME VARIABLES //

// Objects to hold character data and important game state
let gameState = {
    mainActive: true,
    battleActive: false,
    menuActive: false,
    shopSelect: 0,
    currentScreen: 0,
    progression: 0
}
let currentMap = {
    bg: './img/map5.png'
}
let character = {
    position: {
        x: 590,
        y: 350
    },
    money: 100,
    stats: {
        lvl: 1,
        maxHp: 50,
        hp: 50,
        maxMp: 30,
        mp: 30,
        exp: 0,
        expToNext: 40,
        atk: 45,
        power: 45,
        def: 150,
        spd: 10
    },
    magic: {
        fire: {
            name: 'fire',
            power: 1.5,
            mp: 3
        },
        lightning: {
            name: 'lightning',
            power: 1.75,
            mp: 6
        },
        wind: {
            name: 'wind',
            power: 1.25,
            mp: 1
        }
    },
    equipment: {
        head: null,
        body: null,
        hands: null,
        shoes: null,
        weapon: null
    },
    items: {
        potions: {
            healthPotion: {
                quantity: 5,
                restore: 30
            },
            bigHealthPotion: {
                quantity: 5,
                restore: 100
            },
            magicPotion: {
                quantity: 5,
                restore: 10
            },
            bigMagicPotion: {
                quantity: 5,
                restore: 30
            },
            antidote: {
                quantity: 5
            }
        },
        misc: [
            'lockpick',
            'letter from old man'
        ]
    }

}
const enemies = {
    0: {
        name: 'goblin',
        hp: 25,
        atk: 10,
        def: 10,
        spd: 8,
        exp: 25,
        money: 13,
        weakness: 'wind'
    },
    1: {
        name: 'troll',
        img: 'img/troll.png',
        hp: 40,
        atk: 15,
        def: 15,
        spd: 5,
        exp: 35,
        money: 20,
        weakness: 'lightning'
    },
    2: {
        name: 'spider',
        hp: 15,
        atk: 7,
        def: 5,
        spd: 20,
        exp: 20,
        money: 15,
        weakness: 'fire'
    }
}

// Initiates canvas context
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Sets main screen offset for movable background to reference as well as game screen size
let offset = {
    x: -4100,
    y: -570
}
canvas.width = 1280
canvas.height = 800

// Initiating primary variables
let menuOpen = false
let menuIndex = 0
let itemOpen = false
let itemIndex = 0
let battleMenuIndex = 0
let battleEnd = false
let battleMessage = document.querySelector('#battle-message')
let allowBattleMenuNav = false
let magicMenuOpen = false
let magicMenuIndex = 0
let speedCheck = false
let characterTurn = false
let enemyTurn = false
let keyFiredW = false
let keyFiredA = false
let keyFiredS = false
let keyFiredD = false
let keyFiredEnter = false
let keyFiredShift = false
let attacking = false
let useMagic = false
let pressedKeys = []
let whichCollision = collisions
let collisionsSet = false
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
    e: {
        pressed: false
    },
    shift: {
        pressed: false
    }
}
let spd = 5
let moving = true
const battle = {
    initiated: false
}
let collisionsMap = []
const battleZonesMap = []
const battleZones = []
let boundaries = []


// General images for overworld, battle scene, menu scene, etc.
let backgroundImage = new Image()
backgroundImage.src = currentMap.bg
const flowersImg = new Image()
flowersImg.src = './img/flowers.png'
const foregroundImage = new Image()
foregroundImage.src = './img/map-test-top.png'
const menuImage = new Image() 
menuImage.src = './img/menu2.png'
const menuItemImage = new Image() 
menuItemImage.src = './img/menu3.png'
const winScreenImage = new Image() 
winScreenImage.src = './img/menu4.png'
const battleBg = new Image()
battleBg.src = './img/battle-bg.png'
const playerAttackImage = new Image()
playerAttackImage.src = './img/char-attack.png'
const enemyImg = new Image()
enemyImg.src = './img/enemy.png'
const fireAttack = new Image()
fireAttack.src = './img/fire1.png'
const explosionImg = new Image()
explosionImg.src = './img/explosion1.png'

// Player sprite images
const playerDown = new Image()
playerDown.src = './img/char-down.png'
const playerUp = new Image()
playerUp.src = './img/char-up.png'
const playerLeft = new Image()
playerLeft.src = './img/char-left.png'
const playerRight = new Image()
playerRight.src = './img/char-right.png'

// Sprite list
let player = new Sprite({
    position: {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
    image: playerDown,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUp,
        down: playerDown,
        left: playerLeft,
        right: playerRight
    }
})
const battlePlayer = new Sprite({
    position: {
        x: 800,
        y: 350
    },
    image: playerAttackImage,
    frames: {
        max: 6
    }
})
let enemy = new Sprite({
    position: {
        x: 355,
        y: 270
    },
    image: enemyImg,
    frames: {
        max: 1
    },
    name: '',
    maxHp: 20,
    health: 20,
    atk: 5,
    def: 5,
    spd: 5,
    exp: 50,
    money: 25
})
let background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backgroundImage
})
const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})
const battleBackground = new Sprite({
    position: {
        x: -2315,
        y: -2050
    },
    image: battleBg
})
const menuItems = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: menuItemImage
})
const winPane = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: winScreenImage
})
const fireAttackAnimation = new Sprite({
    position: {
        x: 750,
        y: 350
    },
    image: fireAttack,
    frames: {
        max: 4
    }
})
const explosion = new Sprite({
    position: {
        x: 355,
        y: 270
    },
    image: explosionImg,
    frames: {
        max: 6
    }
})

player.moving = false

// All elements that are moved
let movables = [background, ...boundaries, foreground, ...battleZones]


// BATTLE CODE VARIABLES //

const hpBarWidth = 75
let explosionToggle = false
let magicType = null
let baseDamage
let magicMultiplier = 1
let magicWeaknessBoost = 1
let finalDamage
let criticalChance = 0.15
let criticalBoost = 1.5
let battleWon
let enemyChosen = false
let levelChecked
let readyMagicAnimation = false
const battleMenuPane = document.querySelector('#battle-pane')
const battleMenu = document.querySelector('#battle-menu')
const magicMenu = document.querySelector('#magic-menu')
let battleAnimationId
let winScreenAnimationId