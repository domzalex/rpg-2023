function chooseEnemy() {
    // const chosenEnemy = enemies[Math.floor(Math.random() * Object.keys(enemies).length)]
    const chosenEnemy = enemies[1]
    enemyImg.src = chosenEnemy.img
    enemy.name = chosenEnemy.name
    enemy.maxHp = chosenEnemy.hp
    enemy.health = chosenEnemy.hp
    enemy.exp = chosenEnemy.exp
    enemy.atk = chosenEnemy.atk
    enemy.def = chosenEnemy.def
    enemy.spd = chosenEnemy.spd
    enemy.money = chosenEnemy.money
    enemy.weakness = chosenEnemy.weakness

    document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 75) + 'px'
}

function resetAttackAnimation() {
    explosion.moving = false
    explosion.frames.elapsed = 0
    fireAttackAnimation.position.x = 750
    fireAttackAnimation.position.y = 350
}

function attackAnimation() {
    battlePlayer.moving = true
}

function damageCalc(magicType) {
    if (magicType == null) {
        magicMultiplier = 1
    } else {
        if (character.stats.mp >= magicType.mp) {
            character.stats.mp -= magicType.mp
            magicMultiplier = magicType.power
            if (magicType.name == enemy.weakness) {
                magicWeaknessBoost = 2
            } else {
                magicWeaknessBoost = 1
            }
        } else {
            alert('not enough MP')
        }
        
    }
    baseDamage = Math.round(((((((2 * character.stats.lvl * 1) / 5) + 2) * ((character.stats.power * magicMultiplier) * (character.stats.atk / enemy.def))) / 50) + 2) * magicWeaknessBoost)
    battleMessage.innerHTML = 'You hit the ' + enemy.name + ' for ' + baseDamage + ' points of damage!'
    finalDamage = baseDamage
    if (Math.random() < criticalChance) {
        finalDamage = Math.round(baseDamage * criticalBoost)
        battleMessage.innerHTML = 'Critical hit! You hit the ' + enemy.name + ' for ' + finalDamage + ' points of damage!'
    }
}

function playerAttack(magicType) {
    resetAttackAnimation()
    attackAnimation()
    damageCalc(magicType)
    enemy.health -= finalDamage
    magicMultiplier = 1
    magicWeaknessBoost = 1
    battleMenu.style.display = 'none'
    setTimeout(() => {
        battleMessage.style.display = 'flex'
    }, 1000)
    characterTurn = false
    setTimeout(() => {
        battleMessage.style.display = 'none'
        battleMenu.style.display = 'flex'
        if (enemy.health <= 0) {
            battleWon = true
            endBattle()
        } else {
            enemyTurn = true
        }
    }, 3000)
    
}

function endBattle() {
    enemyChosen = false

    if (battleWon) {
        character.stats.exp = character.stats.exp + enemy.exp
        character.money = character.money + enemy.money
        battleMenu.style.display = 'none'
        battleMenuPane.style.display = 'none'
        battleMenu.children[battleMenuIndex].className = 'battle-menu-item'
        battleMenuIndex = 0
        battleMenu.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
        window.cancelAnimationFrame(battleAnimationId)
        winScreen()
        speedCheck = false
        battleEnd = false
        battle.initiated = false
    } else {
        battleMenu.style.display = 'none'
        battleMenuPane.style.display = 'none'
        allowBattleMenuNav = false
        battleMenu.children[battleMenuIndex].className = 'battle-menu-item'
        battleMenuIndex = 0
        battleMenu.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
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

function enemyAttack() {
    magicType = null
    let damage
    if (Math.random() <= criticalChance) {
        damage = Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (enemy.atk * (enemy.atk / character.stats.def))) / 50) + 2) * criticalBoost
        character.stats.hp -= damage
        battleMenu.style.display = 'none'
        setTimeout(() => {
            battleMessage.innerHTML = 'Critical hit! The ' + enemy.name + ' attacks and deals ' + damage + ' points of damage!'
            battleMessage.style.display = 'flex'
        })
    } else {
        damage = Math.round((((((2 * character.stats.lvl * 1) / 5) + 2) * (enemy.atk * (enemy.atk / character.stats.def))) / 50) + 2)
        character.stats.hp -= damage
        battleMenu.style.display = 'none'
        setTimeout(() => {
            battleMessage.innerHTML = 'The ' + enemy.name + ' attacks and deals ' + damage + ' points of damage!'
            battleMessage.style.display = 'flex'
        }, 1000)
    }
    
    enemyTurn = false
    setTimeout(() => {
        battleMessage.style.display = 'none'
        battleMenu.style.display = 'flex'
        characterTurn = true
    }, 3000)
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

function startBattle() {

    battleWon = false
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
    battleMenuPane.style.display = 'flex'

    document.querySelector('#player-stats-battle').children[1].innerHTML = 'HP: ' + character.stats.hp
    document.querySelector('#player-stats-battle').children[2].innerHTML = 'MP: ' + character.stats.mp

    if (!speedCheck) {
        speedCheck = true
        if (character.stats.spd > enemy.spd) {
            characterTurn = true
        } else {
            enemyTurn = true
        }
    }

    if (characterTurn) {
        battleMenu.style.display = 'flex'
    } else if (enemyTurn && enemy.health > 0) {
        enemyAttack()
    }

    if (allowBattleMenuNav && !magicMenuOpen) {
        if (keys.d.pressed) {
            if (!keyFiredD) {
                keyFiredD = true
                keys.d.pressed = false
                if (battleMenuIndex < 3) {
                    battleMenu.children[battleMenuIndex].className = 'battle-menu-item'
                    battleMenuIndex += 1
                    battleMenu.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
                }
            }
        }
        if (keys.a.pressed) {
            if (!keyFiredA) {
                keyFiredA = true
                keys.a.pressed = false
                if (battleMenuIndex > 0) {
                    battleMenu.children[battleMenuIndex].className = 'battle-menu-item'
                    battleMenuIndex -= 1
                    battleMenu.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
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
            
            magicType = character.magic[Object.keys(character.magic)[magicMenuIndex]]

            if (character.stats.mp >= magicType.mp) {
                keyFiredEnter = false
                magicMenu.style.display = 'none'
                magicMenuOpen = false
                playerAttack(magicType)
            } else {
                battleMessage.innerHTML = 'Not enough MP!'
                battleMessage.style.display = 'flex'
                setTimeout(() => {
                    battleMessage.style.display = 'none'
                }, 1500)
            }
            
        }

                    
    }
    else if (!magicMenuOpen) {
        if (keyFiredEnter) {
            keyFiredEnter = false
            if (battleMenuIndex === 0) {
                playerAttack()
            }
            else if (battleMenuIndex === 1) {
                magicMenuOpen = true
            }
            else if (battleMenuIndex === 2) {

            }
            else if (battleMenuIndex === 3) {
                if (Math.random() > 0.10) {
                    endBattle()
                } else {
                    alert('failed to flee!')
                    battleMenu.children[battleMenuIndex].className = 'battle-menu-item'
                    battleMenuIndex = 0
                    battleMenu.children[battleMenuIndex].className = 'battle-menu-item battle-menu-hovered'
                    characterTurn = false
                    enemyTurn = true
                }
            }
        }
    }


    if (battlePlayer.frames.elapsed == 60) {
        battlePlayer.moving = false
        battlePlayer.frames.elapsed = 0
        readyMagicAnimation = true
    }

    if (magicType && magicType.name === 'fire' && explosion.moving == false && readyMagicAnimation == true) {
        fireAttackAnimation.draw()
        fireAttackAnimation.moving = true
        if (fireAttackAnimation.position.x > 400) {
            fireAttackAnimation.position.x -= 12
            fireAttackAnimation.position.y -= 1
        }
    }
    
    if (fireAttackAnimation.position.x <= 400 && explosion.frames.elapsed < 60) {
        readyMagicAnimation = false
        explosion.draw()
        explosion.moving = true
        if (enemy.health <= 0) {
            document.querySelector('#enemy-health').style.width = '0px'
        } else {
            document.querySelector('#enemy-health').style.width = ((enemy.health / enemy.maxHp) * 75) + 'px'
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