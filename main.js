
// Objects to hold character data and important game state
let gameState = {
    mainActive: true,
    battleActive: false,
    menuActive: false,
    shopSelect: 0,
    currentScreen: 0,
    progression: 0
}
let character = {
    position: {
        x: 590,
        y: 350
    },
    money: 100,
    stats: {
        lvl: 1,
        maxHp: 100,
        hp: 100,
        maxMp: 30,
        mp: 30,
        exp: 0,
        expToNext: 40,
        atk: 20,
        power: 10,
        def: 15,
        spd: 10
    },
    magic: {
        fire: {
            power: 20,
            mp: 3
        },
        lightning: {
            power: 25,
            mp: 6
        },
        wind: {
            power: 15,
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
        hp: 50,
        atk: 10,
        def: 10,
        spd: 8,
        exp: 25,
        money: 13
    },
    1: {
        name: 'troll',
        hp: 100,
        atk: 15,
        def: 15,
        spd: 5,
        exp: 35,
        money: 20
    },
    2: {
        name: 'spider',
        hp: 30,
        atk: 7,
        def: 5,
        spd: 20,
        exp: 20,
        money: 15
    }
}


// Initiates canvas context
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Sets main screen offset for movable background to reference as well as game screen size
let offset = {
    x: -825,
    y: -1875
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
let allowBattleMenuNav = false
let magicMenuOpen = false
let magicMenuIndex = 0

let speedCheck = false
let characterTurn = false
let enemyTurn = false
let criticalChance = 0.15
let criticalBoost = 1.5

let keyFiredW = false
let keyFiredA = false
let keyFiredS = false
let keyFiredD = false
let keyFiredEnter = false
let keyFiredShift = false

let attacking = false
let useMagic = false

let pressedKeys = []


// General images for overworld, battle scene, menu scene, etc.
const image = new Image()
image.src = './img/map5.png'
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
const enemyImg = new Image()
enemyImg.src = './img/enemy.png'

// Player sprite images
const playerDown = new Image()
playerDown.src = './img/char-down.png'
const playerUp = new Image()
playerUp.src = './img/char-up.png'
const playerLeft = new Image()
playerLeft.src = './img/char-left.png'
const playerRight = new Image()
playerRight.src = './img/char-right.png'

// Menu item images
const menuPotionImg = new Image()
menuPotionImg.src = './img/menu-potion.png'


// Sprite list
const player = new Sprite({
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
        x: 1100,
        y: 350
    },
    image: playerLeft,
    frames: {
        max: 4
    }
})
let enemy = new Sprite({
    position: {
        x: 500,
        y: 350
    },
    image: enemyImg,
    frames: {
        max: 4
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
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})
let flowers = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: flowersImg
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
        y: -2000
    },
    image: battleBg
})
const menu = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: menuImage
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
const menuPotion = new Sprite({
    position: {
        x: 50,
        y: 50
    },
    image: menuPotionImg
})
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


function moveFlowers() {

    setInterval(() => {
        flowers.position.x -= 5
        setTimeout(() => {
            flowers.position.x += 5
        }, 1250)
    }, 2500)

}
moveFlowers()


// Function for collision checking
function rectangleCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}
// Generates collision maps for overworld
const collisionsMap = []
for (let i = 0; i < collisions.length; i+= 80) {
    collisionsMap.push(collisions.slice(i, 80 + i))
}
// const battleZonesMap = []
// for (let i = 0; i < battleZonesData.length; i+= 80) {
//     battleZonesMap.push(battleZonesData.slice(i, 80 + i))
// }
// Populates overworld collision maps
const boundaries = []
collisionsMap.forEach((row, i) => {
    row.forEach(((symbol, j) => {
        if (symbol === 59) {
            boundaries.push(new Boundary({position: {
                x: j * Boundary.width + (offset.x + 30),
                y: i * Boundary.height + (offset.y + 60)
            }}))
        }
    }))
})
// const battleZones = []
// battleZonesMap.forEach((row, i) => {
//     row.forEach(((symbol, j) => {
//         if (symbol === 59) {
//             battleZones.push(new Boundary({position: {
//                 x: j * Boundary.width + offset.x,
//                 y: i * Boundary.height + offset.y
//             }}))
//         }
//     }))
// })

// All elements that are moved
const movables = [background, flowers, ...boundaries, foreground, ]


// Functions to create and read save files
function createSaveFile() {
    localStorage.clear()
    localStorage.setItem('offset', JSON.stringify(offset))
    localStorage.setItem('character', JSON.stringify(character))
}
// if (localStorage.length > 0) {
//     offsetData = localStorage.getItem('offset')
//     offset = JSON.parse(offsetData)
//     characterData = localStorage.getItem('character')
//     character = JSON.parse(characterData)
// } else {}



/////////////////////////
//                     //
// MAIN GAME LOOP CODE //
//                     //
/////////////////////////
let moving = true
player.moving = false
const battle = {
    initiated: false
}
function animate() {

    // if (keyFiredShift) {
    //     spd = 10
    // } else {
    //     spd = 5
    // }

    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    flowers.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    // battleZones.forEach((battleZone) => {
    //     battleZone.draw()
    // })

    player.draw() 
    foreground.draw()


    let moving = true
    player.moving = false

    if (battle.initiated) return

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        // for (let i = 0; i < battleZones.length; i++) {
        //     const battleZone = battleZones[i]
        //     const overlappingArea = 
        //         (Math.min(
        //             player.position.x + player.width, 
        //             battleZone.position.x + battleZone.width
        //         ) - 
        //         Math.max(player.position.x, battleZone.position.x)) * 
        //         (Math.min(
        //             player.position.y + player.height, 
        //             battleZone.position.y + battleZone.height
        //         ) - 
        //         Math.max(player.position.y, battleZone.position.y))
        //     if (
        //         rectangleCollision({
        //             rectangle1: player,
        //             rectangle2: battleZone
        //         }) && 
        //         overlappingArea > (player.width * player.height) / 2 &&
        //         Math.random() < 0.02
        //     ) {

        //         window.cancelAnimationFrame(animationId)
        //         battle.initiated = true
        //         startBattle()
                
        //         break
        //     }
        // }
    }

    if (menuOpen == true) {
        window.cancelAnimationFrame(animationId)
        animateMenu()
    }

    
    if (keys.w.pressed && pressedKeys[pressedKeys.length - 1] === 'w') {
        
        player.image = player.sprites.up
        player.moving = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + spd
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        
        }
        if (moving) {
            offset.y += spd
            movables.forEach((movable) => {
                movable.position.y += spd
            })
        }
    }
    else if (keys.a.pressed && pressedKeys[pressedKeys.length - 1] === 'a') {
        player.image = player.sprites.left
        player.moving = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + spd,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            offset.x += spd
            movables.forEach((movable) => {
                movable.position.x += spd
            })
        }
    }
    else if (keys.s.pressed && pressedKeys[pressedKeys.length - 1] === 's') {
        player.image = player.sprites.down
        player.moving = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - spd
                        }
                    }
                })
            ) {
                moving = false
                break
            }
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: enemy
                })
            ) {
                moving = false
                break
            }
        }
        if (moving) {
            offset.y -= spd
            movables.forEach((movable) => {
                movable.position.y -= spd
            })
        }
    }
    else if (keys.d.pressed && pressedKeys[pressedKeys.length - 1] === 'd') {
        player.image = player.sprites.right
        player.moving = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - spd,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false
                break
            }
            if (
            rectangleCollision({
                rectangle1: player,
                rectangle2: enemy
            })
        ) {
            moving = false
            break
        }
        }
        if (moving) {
            offset.x -= spd
            movables.forEach((movable) => {
                movable.position.x -= spd
            })
        }
    }
    // else if (keys.w.pressed && pressedKeys[pressedKeys.length - 1] === 'W') {
        
    //     player.image = player.sprites.up
    //     player.moving = true
    //     for (let i = 0; i < boundaries.length; i++) {
    //         const boundary = boundaries[i]
    //         if (
    //             rectangleCollision({
    //                 rectangle1: player,
    //                 rectangle2: {
    //                     ...boundary,
    //                     position: {
    //                         x: boundary.position.x,
    //                         y: boundary.position.y + spd
    //                     }
    //                 }
    //             })
    //         ) {
    //             moving = false
    //             break
    //         }
        
    //     }
    //     if (moving) {
    //         offset.y += spd
    //         movables.forEach((movable) => {
    //             movable.position.y += spd
    //         })
    //     }
    // }
    // else if (keys.a.pressed && pressedKeys[pressedKeys.length - 1] === 'A') {
    //     player.image = player.sprites.left
    //     player.moving = true
    //     for (let i = 0; i < boundaries.length; i++) {
    //         const boundary = boundaries[i]
    //         if (
    //             rectangleCollision({
    //                 rectangle1: player,
    //                 rectangle2: {
    //                     ...boundary,
    //                     position: {
    //                         x: boundary.position.x + spd,
    //                         y: boundary.position.y
    //                     }
    //                 }
    //             })
    //         ) {
    //             moving = false
    //             break
    //         }
    //     }
    //     if (moving) {
    //         offset.x += spd
    //         movables.forEach((movable) => {
    //             movable.position.x += spd
    //         })
    //     }
    // }
    // else if (keys.s.pressed && pressedKeys[pressedKeys.length - 1] === 'S') {
    //     player.image = player.sprites.down
    //     player.moving = true
    //     for (let i = 0; i < boundaries.length; i++) {
    //         const boundary = boundaries[i]
    //         if (
    //             rectangleCollision({
    //                 rectangle1: player,
    //                 rectangle2: {
    //                     ...boundary,
    //                     position: {
    //                         x: boundary.position.x,
    //                         y: boundary.position.y - spd
    //                     }
    //                 }
    //             })
    //         ) {
    //             moving = false
    //             break
    //         }
    //         if (
    //             rectangleCollision({
    //                 rectangle1: player,
    //                 rectangle2: enemy
    //             })
    //         ) {
    //             moving = false
    //             break
    //         }
    //     }
    //     if (moving) {
    //         offset.y -= spd
    //         movables.forEach((movable) => {
    //             movable.position.y -= spd
    //         })
    //     }
    // }
    // else if (keys.d.pressed && pressedKeys[pressedKeys.length - 1] === 'D') {
    //     player.image = player.sprites.right
    //     player.moving = true
    //     for (let i = 0; i < boundaries.length; i++) {
    //         const boundary = boundaries[i]
    //         if (
    //             rectangleCollision({
    //                 rectangle1: player,
    //                 rectangle2: {
    //                     ...boundary,
    //                     position: {
    //                         x: boundary.position.x - spd,
    //                         y: boundary.position.y
    //                     }
    //                 }
    //             })
    //         ) {
    //             moving = false
    //             break
    //         }
    //         if (
    //         rectangleCollision({
    //             rectangle1: player,
    //             rectangle2: enemy
    //         })
    //     ) {
    //         moving = false
    //         break
    //     }
    //     }
    //     if (moving) {
    //         offset.x -= spd
    //         movables.forEach((movable) => {
    //             movable.position.x -= spd
    //         })
    //     }
    // }
    else {}
}



////////////////////
//                //
// MENU LOOP CODE //
//                //
////////////////////
// Function that generates player stats to be used in menu
function populateStats() {
    document.querySelector('#player-level').innerHTML = 'Lvl: ' + character.stats.lvl
    document.querySelector('#player-exp').innerHTML = 'EXP: ' + character.stats.exp
    document.querySelector('#player-health').innerHTML = 'HP: ' + character.stats.hp
    document.querySelector('#player-magic').innerHTML = 'MP: ' + character.stats.mp
    document.querySelector('#player-money').innerHTML = 'Money: ' + character.money
    document.querySelector('#player-exp-next').innerHTML = 'EXP to Lvl: ' + character.stats.expToNext
    document.querySelector('#player-atk').innerHTML = 'ATK: ' + character.stats.atk
    document.querySelector('#player-def').innerHTML = 'DEF: ' + character.stats.def
    document.querySelector('#player-spd').innerHTML = 'SPD: ' + character.stats.spd
    document.querySelector('#player-power').innerHTML = 'Power: ' + character.stats.power
}
// Menu loop code
function animateMenu() {

    

    keyFiredW = false
    keyFiredA = false
    keyFiredS = false
    keyFiredD = false

    const menuAnimationId = window.requestAnimationFrame(animateMenu)
    menu.draw()
    populateStats()
    document.querySelector('#menu').style.display = 'flex'
    document.querySelector('#player-stats').style.display = 'flex'

    if (keys.w.pressed) {
        if (!keyFiredW) {
            keyFiredW = true
            keys.w.pressed = false
            if (menuIndex > 0) {
                document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
                menuIndex -= 1
                document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
            }
        }
    }
    if (keys.s.pressed) {
        if (!keyFiredS) {
            keyFiredS = true
            keys.s.pressed = false
            if (menuIndex < 2) {
                document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
                menuIndex += 1
                document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
            }
        }
    }

    if (menuIndex === 2 && keyFiredEnter) {
        createSaveFile()
        document.querySelector('#save-alert').style.opacity = '1'
        setTimeout(() => {
            document.querySelector('#save-alert').style.opacity = '0'
        }, 2000)
    } else if (menuIndex === 0 && keyFiredEnter) {
        itemOpen = true
    }

    if (itemOpen) {
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
        menuIndex = 0
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
        window.cancelAnimationFrame(menuAnimationId)
        document.querySelector('#menu').style.display = 'none'
        itemIndex = 0
        animateMenuItems()
    }

    if (!menuOpen && !itemOpen) {
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button'
        menuIndex = 0
        document.querySelector('#menu-buttons').children[menuIndex].className = 'menu-button menu-hovered'
        window.cancelAnimationFrame(menuAnimationId)
        document.querySelector('#menu').style.display = 'none'
        document.querySelector('#player-stats').style.display = 'none'
        animate()
    }
}
// Activates items list within menu loop
function animateMenuItems() {

    

    keyFiredW = false
    keyFiredA = false
    keyFiredS = false
    keyFiredD = false

    
    const menuItemAnimationId = window.requestAnimationFrame(animateMenuItems)
    menuItems.draw()
    populateStats()
    populateItems()
    itemsPane.style.display = 'flex'

    // Handles specific item to hover over
    if (keys.d.pressed) {
        if (!keyFiredD) {
            keyFiredD = true
            keys.d.pressed = false
            if (itemIndex < 4) {
                itemsPane.children[itemIndex].className = 'item'
                itemIndex += 1
                itemsPane.children[itemIndex].className = 'item item-hovered'
            }
        }
    }
    if (keys.a.pressed) {
        if (!keyFiredA) {
            keyFiredA = true
            keys.a.pressed = false
            if (itemIndex > 0) {
                itemsPane.children[itemIndex].className = 'item'
                itemIndex -= 1
                itemsPane.children[itemIndex].className = 'item item-hovered'
            }
        }
    }


    // Handles item selection/use
    window.addEventListener('keypress', (e) => {
        switch (e.key) {
            case 'Enter' :
                if (keyFiredEnter && itemOpen === true) {
                    keyFiredEnter = false
                    if (itemIndex === 0 && (character.stats.hp < character.stats.maxHp) && (character.items.potions.healthPotion.quantity > 0)) {
                        character.stats.hp += character.items.potions.healthPotion.restore
                        character.items.potions.healthPotion.quantity -= 1
                        if (character.stats.hp > character.stats.maxHp) {
                            character.stats.hp = character.stats.maxHp
                        }
                    }
                    else if (itemIndex === 1 && (character.stats.hp < character.stats.maxHp) && (character.items.potions.bigHealthPotion.quantity > 0)) {
                        character.stats.hp += character.items.potions.bigHealthPotion.restore
                        character.items.potions.bigHealthPotion.quantity -= 1
                        if (character.stats.hp > character.stats.maxHp) {
                            character.stats.hp = character.stats.maxHp
                        }
                    }
                    else if (itemIndex === 2 && (character.stats.mp < character.stats.maxMp) && (character.items.potions.magicPotion.quantity > 0)) {
                        character.stats.mp += character.items.potions.magicPotion.restore
                        character.items.potions.magicPotion.quantity -= 1
                        if (character.stats.mp > character.stats.maxMp) {
                            character.stats.mp = character.stats.maxMp
                        }
                    }
                    else if (itemIndex === 3 && (character.stats.mp < character.stats.maxMp) && (character.items.potions.bigMagicPotion.quantity > 0)) {
                        character.stats.mp += character.items.potions.bigMagicPotion.restore
                        character.items.potions.bigMagicPotion.quantity -= 1
                        if (character.stats.mp > character.stats.maxMp) {
                            character.stats.mp = character.stats.maxMp
                        }
                    }
                    else if (itemIndex === 4) {
                        alert('you cannot use this now')
                    }
                }
        }

    })
    

    // Handles exiting of item screen
    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            itemOpen = false
            itemsPane.children[itemIndex].className = 'item'
            itemsPane.children[0].className = 'item item-hovered'
        }
    })
    if (!itemOpen) {
        itemsPane.style.display = 'none'
        window.cancelAnimationFrame(menuItemAnimationId)
        animateMenu()
    }

}
// Populates item list within menu loop
const itemsPane = document.querySelector('#all-items')
function populateItems() {
    itemsPane.children[0].children[1].innerHTML = character.items.potions.healthPotion.quantity
    itemsPane.children[1].children[1].innerHTML = character.items.potions.bigHealthPotion.quantity
    itemsPane.children[2].children[1].innerHTML = character.items.potions.magicPotion.quantity
    itemsPane.children[3].children[1].innerHTML = character.items.potions.bigMagicPotion.quantity
    itemsPane.children[4].children[1].innerHTML = character.items.potions.antidote.quantity
}



//////////////////////
//                  //
// BATTLE LOOP CODE //
//                  //
//////////////////////
function chooseEnemy() {
    const chosenEnemy = enemies[Math.floor(Math.random() * Object.keys(enemies).length)]
    enemy.name = chosenEnemy.name
    enemy.maxHp = chosenEnemy.hp
    enemy.health = chosenEnemy.hp
    enemy.exp = chosenEnemy.exp
    enemy.atk = chosenEnemy.atk
    enemy.def = chosenEnemy.def
    enemy.spd = chosenEnemy.spd
    enemy.money = chosenEnemy.money
}
function enemyAttack() {
    if (Math.random() > criticalChance) {
        character.stats.hp -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (enemy.atk * (enemy.atk / character.stats.def))) / 50) + 2) * criticalBoost
    } else {
        character.stats.hp -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (enemy.atk * (enemy.atk / character.stats.def))) / 50) + 2)
    }
    enemyTurn = false
    characterTurn = true
}
function checkLevelUp() {
    levelChecked = true
    if (character.stats.exp >= character.stats.expToNext) {
        document.querySelector('#level-up-modal').style.display = 'flex'
        character.stats.lvl++
        character.stats.maxHp = Math.round(character.stats.maxHp * 1.1)
        character.stats.maxMp = Math.round(character.stats.maxMp * 1.1)
        character.stats.hp = character.stats.maxHp
        character.stats.mp = character.stats.maxMp
        character.stats.atk = Math.round(character.stats.atk * 1.1)
        character.stats.def = Math.round(character.stats.def * 1.1)
        character.stats.spd = Math.round(character.stats.spd * 1.1)
        character.stats.power = Math.round(character.stats.power * 1.1)
        character.stats.expToNext = Math.round(character.stats.expToNext * 2) - Math.round(character.stats.expToNext / 4)
    } else {
        document.querySelector('#level-up-modal').style.display = 'none'
        document.querySelector('#win-screen').style.display = "none"
        window.cancelAnimationFrame(winScreenAnimationId)
        animate()
    }
}
const hpBarWidth = 75
let battleWon
let enemyChosen = false
let levelChecked
const battleMenuPane = document.querySelector('#battle-menu')
let battleAnimationId
let winScreenAnimationId
function startBattle() {

    levelChecked = false

    if (enemyChosen === false) {
        chooseEnemy()
        enemyChosen = true
    }

    allowBattleMenuNav = true

    keyFiredW = false
    keyFiredA = false
    keyFiredS = false
    keyFiredD = false

    battleAnimationId = window.requestAnimationFrame(startBattle)
    battleBackground.draw()
    enemy.draw()
    battlePlayer.draw()

    document.querySelector('#player-stats-battle').children[1].innerHTML = 'HP: ' + character.stats.hp
    document.querySelector('#player-stats-battle').children[2].innerHTML = 'MP: ' + character.stats.mp
    document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 75) + 'px'

    if (!speedCheck) {
        speedCheck = true
        if (character.stats.spd > enemy.spd) {
            characterTurn = true
        } else {
            enemyTurn = true
        }
    }

    if (characterTurn) {
        battleMenuPane.style.display = 'flex'
    } else if (enemyTurn && enemy.health > 0) {
        enemyAttack()
    }
    if (enemy.health <= 0) {
        battleEnd = true
        battleWon = true
    }

    if (battleEnd) {

        enemyChosen = false

        if (battleWon) {
            character.stats.exp = character.stats.exp + enemy.exp
            character.money = character.money + enemy.money
            document.querySelector('#battle-menu').style.display = 'none'
            battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item'
            battleMenuIndex = 0
            battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
            window.cancelAnimationFrame(battleAnimationId)
            winScreen()
            speedCheck = false
            battleEnd = false
            battle.initiated = false
        } else {
            document.querySelector('#battle-menu').style.display = 'none'
            allowBattleMenuNav = false
            battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item'
            battleMenuIndex = 0
            battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
            window.cancelAnimationFrame(battleAnimationId)
            animate()
            speedCheck = false
            battleEnd = false
            battle.initiated = false
            if (character.stats.hp <= 0) {
                character.stats.hp = character.stats.maxHp
            }
        }

        
    }
    if (allowBattleMenuNav && !magicMenuOpen) {
        if (keys.d.pressed) {
            if (!keyFiredD) {
                keyFiredD = true
                keys.d.pressed = false
                if (battleMenuIndex < 3) {
                    battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item'
                    battleMenuIndex += 1
                    battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
                }
            }
        }
        if (keys.a.pressed) {
            if (!keyFiredA) {
                keyFiredA = true
                keys.a.pressed = false
                if (battleMenuIndex > 0) {
                    battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item'
                    battleMenuIndex -= 1
                    battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
                }
            }
        }
    }

    if (magicMenuOpen) {
        document.querySelector('#magic-menu').style.display = 'flex'
        if (keys.d.pressed) {
            if (!keyFiredD) {
                keyFiredD = true
                keys.d.pressed = false
                if (magicMenuIndex < 2) {
                    document.querySelector('#magic-menu').children[magicMenuIndex].className = 'battle-menu-item'
                    magicMenuIndex += 1
                    document.querySelector('#magic-menu').children[magicMenuIndex].className = 'battle-menu-item battle-menu-hovered'
                }
            }
        }
        if (keys.a.pressed) {
            if (!keyFiredA) {
                keyFiredA = true
                keys.a.pressed = false
                if (magicMenuIndex > 0) {
                    document.querySelector('#magic-menu').children[magicMenuIndex].className = 'battle-menu-item'
                    magicMenuIndex -= 1
                    document.querySelector('#magic-menu').children[magicMenuIndex].className = 'battle-menu-item battle-menu-hovered'
                }
            }
        }
    } else {
        document.querySelector('#magic-menu').style.display = 'none'
    }
    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            magicMenuOpen = false
        }
    })
    
    if (magicMenuOpen) {
        if (keyFiredEnter) {
            keyFiredEnter = false
            if (magicMenuIndex === 0 && character.stats.mp >= character.magic.fire.mp) {
                character.stats.mp -= character.magic.fire.mp
                if (Math.random() < criticalChance) {
                    enemy.health -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (character.magic.fire.power * (character.stats.atk / enemy.def))) / 50) + 2) * criticalBoost
                } else {
                    enemy.health -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (character.magic.fire.power * (character.stats.atk / enemy.def))) / 50) + 2)
                }
                document.querySelector('#enemy-health').style.width = hpBarWidth + 'px'
                document.querySelector('#magic-menu').style.display = 'none'
                magicMenuOpen = false
                characterTurn = false
                enemyTurn = true
            }
            else if (magicMenuIndex === 1 && character.stats.mp >= character.magic.lightning.mp) {
                character.stats.mp -= character.magic.lightning.mp
                if (Math.random() < criticalChance) {
                    enemy.health -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (character.magic.lightning.power * (character.stats.atk / enemy.def))) / 50) + 2) * criticalBoost
                } else {
                    enemy.health -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (character.magic.lightning.power * (character.stats.atk / enemy.def))) / 50) + 2)
                }
                document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 75) + 'px'
                document.querySelector('#magic-menu').style.display = 'none'
                magicMenuOpen = false
                characterTurn = false
                enemyTurn = true
            }
            else if (magicMenuIndex === 2 && character.stats.mp >= character.magic.wind.mp) {
                character.stats.mp -= character.magic.wind.mp
                if (Math.random() < criticalChance) {
                    enemy.health -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (character.magic.wind.power * (character.stats.atk / enemy.def))) / 50) + 2) * criticalBoost
                } else {
                    enemy.health -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (character.magic.wind.power * (character.stats.atk / enemy.def))) / 50) + 2)
                }
                document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 75) + 'px'
                document.querySelector('#magic-menu').style.display = 'none'
                magicMenuOpen = false
                characterTurn = false
                enemyTurn = true
            }
        }

                    
    }
    else if (!magicMenuOpen) {
        if (keyFiredEnter) {
            keyFiredEnter = false
            if (battleMenuIndex === 0) {
                if (Math.random() < criticalChance) {
                    enemy.health -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (character.stats.power * (character.stats.atk / enemy.def))) / 50) + 2) * criticalBoost
                } else {
                    enemy.health -= Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (character.stats.power * (character.stats.atk / enemy.def))) / 50) + 2)
                }
                document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 75) + 'px'
                characterTurn = false
                enemyTurn = true
            }
            else if (battleMenuIndex === 1) {
                magicMenuOpen = true
            }
            else if (battleMenuIndex === 2) {

            }
            else if (battleMenuIndex === 3) {
                if (Math.random() > 0.25) {
                    battleEnd = true
                } else {
                    alert('failed to flee!')
                    battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item'
                    battleMenuIndex = 0
                    battleMenuPane.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
                    characterTurn = false
                    enemyTurn = true
                }
            }
        }
    }
}
function winScreen() {
    winScreenAnimationId = window.requestAnimationFrame(winScreen)
    winPane.draw()
    document.querySelector('#win-screen').style.display = "flex"
    document.querySelector('#exp-gain').innerHTML = 'EXP Gained: ' + enemy.exp
    document.querySelector('#money-gain').innerHTML = 'Money Gained: ' + enemy.money
    if (keyFiredEnter) {
        keyFiredEnter = false
        if (!levelChecked) {
            checkLevelUp()
        } else if (levelChecked) {
            document.querySelector('#level-up-modal').style.display = 'none'
            document.querySelector('#win-screen').style.display = "none"
            window.cancelAnimationFrame(winScreenAnimationId)
            animate()
        }
    }
    
}




// Listening for specific keypresses for movement and enter/esc
window.addEventListener('keypress', (e) => {
    switch (e.key) {
        case 'e' :
            if (menuOpen == false) {
                menuOpen = true
            } else if (menuOpen == true && !itemOpen) {
                menuOpen = false
            }
            break
        // case 'E' :
        //     if (menuOpen == false) {
        //         menuOpen = true
        //     } else if (menuOpen == true && !itemOpen) {
        //         menuOpen = false
        //     }
        //     break
    }
})
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w' :
            if (!keyFiredW) {
                keyFiredW = true
                pressedKeys.push(e.key)
            }
            keys.w.pressed = true
            lastKey = 'w'
            
            break

        case 'a' :
            if (!keyFiredA) {
                keyFiredA = true
                pressedKeys.push(e.key)
            }
            keys.a.pressed = true
            lastKey = 'a'
            
            break

        case 's' :
            if (!keyFiredS) {
                keyFiredS = true
                pressedKeys.push(e.key)
            }
            keys.s.pressed = true
            lastKey = 's'
            
            break

        case 'd' :
            if (!keyFiredD) {
                keyFiredD = true
                pressedKeys.push(e.key)
            }
            keys.d.pressed = true
            lastKey = 'd'
            
            break
        // case 'W' :
        //     if (!keyFiredW) {
        //         keyFiredW = true
        //         pressedKeys.push(e.key)
        //     }
        //     keys.w.pressed = true
        //     lastKey = 'w'
            
        //     break

        // case 'A' :
        //     if (!keyFiredA) {
        //         keyFiredA = true
        //         pressedKeys.push(e.key)
        //     }
        //     keys.a.pressed = true
        //     lastKey = 'a'
            
        //     break

        // case 'S' :
        //     if (!keyFiredS) {
        //         keyFiredS = true
        //         pressedKeys.push(e.key)
        //     }
        //     keys.s.pressed = true
        //     lastKey = 's'
            
        //     break

        // case 'D' :
        //     if (!keyFiredD) {
        //         keyFiredD = true
        //         pressedKeys.push(e.key)
        //     }
        //     keys.d.pressed = true
        //     lastKey = 'd'
            
        //     break

        case 'Enter' :
            if (!keyFiredEnter) {
                keyFiredEnter = true
            }
            
            break
        case 'Shift' :
            if (!keyFiredShift) {
                keyFiredShift = true
            }
            
            break
    }

})
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w' :
            keyFiredW = false
            keys.w.pressed = false
            for (let i = 0; i < pressedKeys.length; i++) {
                if (pressedKeys[i] === 'w') {
                    pressedKeys.splice(i, 1)
                }
            }
            break

        case 'a' :
            keyFiredA = false
            keys.a.pressed = false
            for (let i = 0; i < pressedKeys.length; i++) {
                if (pressedKeys[i] === 'a') {
                    pressedKeys.splice(i, 1)
                }
            }
            break

        case 's' :
            keyFiredS = false
            keys.s.pressed = false
            for (let i = 0; i < pressedKeys.length; i++) {
                if (pressedKeys[i] === 's') {
                    pressedKeys.splice(i, 1)
                }
            }
            break

        case 'd' :
            keyFiredD = false
            keys.d.pressed = false
            for (let i = 0; i < pressedKeys.length; i++) {
                if (pressedKeys[i] === 'd') {
                    pressedKeys.splice(i, 1)
                }
            }
            break
        // case 'W' :
        //     keyFiredW = false
        //     keys.w.pressed = false
        //     for (let i = 0; i < pressedKeys.length; i++) {
        //         if (pressedKeys[i] === 'W') {
        //             pressedKeys.splice(i, 1)
        //         }
        //     }
        //     break

        // case 'A' :
        //     keyFiredA = false
        //     keys.a.pressed = false
        //     for (let i = 0; i < pressedKeys.length; i++) {
        //         if (pressedKeys[i] === 'A') {
        //             pressedKeys.splice(i, 1)
        //         }
        //     }
        //     break

        // case 'S' :
        //     keyFiredS = false
        //     keys.s.pressed = false
        //     for (let i = 0; i < pressedKeys.length; i++) {
        //         if (pressedKeys[i] === 'S') {
        //             pressedKeys.splice(i, 1)
        //         }
        //     }
        //     break

        // case 'D' :
        //     keyFiredD = false
        //     keys.d.pressed = false
        //     for (let i = 0; i < pressedKeys.length; i++) {
        //         if (pressedKeys[i] === 'D') {
        //             pressedKeys.splice(i, 1)
        //         }
        //     }
        //     break

        case 'Enter' :
            if (keyFiredEnter) {
                keyFiredEnter = false
            }
            
            break

        case 'Shift' :
            if (keyFiredShift) {
                keyFiredShift = false
            }
            
            break
    }

})


// Run main game loop
animate()