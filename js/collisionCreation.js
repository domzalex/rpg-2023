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
function createCollisions(setCollisionMap) {
    if (!collisionsSet) {
        collisionsMap = []
        for (let i = 0; i < setCollisionMap.length; i+= 80) {
            collisionsMap.push(setCollisionMap.slice(i, 80 + i))
        }
        createBoundaries()
    }
}
for (let i = 0; i < battleZonesData.length; i+= 80) {
    battleZonesMap.push(battleZonesData.slice(i, 80 + i))
}
// Populates overworld collision maps
function createBoundaries() {
    boundaries = []
    collisionsMap.forEach((row, i) => {
        row.forEach(((symbol, j) => {
            if (symbol === 59) {
                boundaries.push(new Boundary({position: {
                    x: j * Boundary.width + (offset.x + 30),
                    y: i * Boundary.height + (offset.y + 85)
                }}))
            }
        }))
    })
}
function checkCollisionChange() {
    if (!collisionsSet) {
        switch (whichCollision) {
            case collisions :
                createCollisions(collisions)
                collisionsSet = true
                break

            case secretForestCollisions :
                createCollisions(secretForestCollisions)
                collisionsSet = true
                break
        }
    }
}
battleZonesMap.forEach((row, i) => {
    row.forEach(((symbol, j) => {
        if (symbol === 59) {
            battleZones.push(new BattleZone({position: {
                x: j * BattleZone.width + offset.x,
                y: i * BattleZone.height + offset.y
            }}))
        }
    }))
})