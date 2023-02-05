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



function animate() {

    //rudimentary map switching
    if ((offset.y > -355) && (offset.x >= -4185 && offset.x <= -4055)) {
        collisionsSet = false
        whichCollision = secretForestCollisions

        foregroundImage.src = './img/secret-forest-top.png'
        backgroundImage.src = './img/secret-forest.png'
        offset.x = -2600
        offset.y = -2750
        background.position.x = offset.x
        background.position.y = offset.y
        foreground.position.x = offset.x
        foreground.position.y = offset.y

        checkCollisionChange()

        player.image = playerUp
    }
    if ((offset.y < -2795) && (offset.x >= -2745 && offset.x <= -2455)) {
        collisionsSet = false
        whichCollision = collisions

        foregroundImage.src = './img/map-test-top.png'
        backgroundImage.src = './img/map5.png'
        offset.x = -4125
        offset.y = -360
        background.position.x = offset.x
        background.position.y = offset.y
        foreground.position.x = offset.x
        foreground.position.y = offset.y

        checkCollisionChange()

        player.image = playerDown
    }
    

    checkCollisionChange()
    movables = [background, ...boundaries, foreground, ...battleZones]

    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    battleZones.forEach((battleZone) => {
        battleZone.draw()
    })

    player.draw() 
    foreground.draw()


    let moving = true
    player.moving = false

    if (battle.initiated) return

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = 
                (Math.min(
                    player.position.x + player.width, 
                    battleZone.position.x + battleZone.width
                ) - 
                Math.max(player.position.x, battleZone.position.x)) * 
                (Math.min(
                    player.position.y + player.height, 
                    battleZone.position.y + battleZone.height
                ) - 
                Math.max(player.position.y, battleZone.position.y))
            if (
                rectangleCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) && 
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.02
            ) {

                window.cancelAnimationFrame(animationId)
                battle.initiated = true
                startBattle()
                
                break
            }
        }
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
}


// Run main game loop
animate()