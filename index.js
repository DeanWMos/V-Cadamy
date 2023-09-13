const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions0.length; i += 106){
    collisionsMap.push(collisions0.slice(i, 106+i))
}

const adminBuildingDoorMap = []
for (let i = 0; i < adminBuildingDoorData.length; i += 106) {
    adminBuildingDoorMap.push(adminBuildingDoorData.slice(i, 106 + i))
}

console.log(adminBuildingDoorMap)


const boundaries = []
const offset = {
    x: -3050,
    y: -5700
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 15894)
        boundaries.push(
            new Boundary({
            position: {
                x: j *Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
            }
        })
        )
    })
})

const adminBuildingDoors = [

]

adminBuildingDoorMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 38416)
            adminBuildingDoors.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})
console.log(adminBuildingDoors)

const image = new Image()
image.src = "./img/university map3.png"

const foregroundImage = new Image()
foregroundImage.src = "./img/foregroundObjects.png"

const playerDownImage = new Image()
playerDownImage.src = "./img/char1front1.png"

const playerBackImage = new Image()
playerBackImage.src = "./img/char1back1.png"

const playerLeftImage = new Image()
playerLeftImage.src = "./img/char1other1.png"

const playerRightImage = new Image()
playerRightImage.src = "./img/char1side1.png"


const player = new Sprite({
    position: {
        x: canvas.width/2 - 340/ 4/2,
        y: canvas.height / 2 - 76 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
    up: playerBackImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
    }
})
console.log(player)

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: { pressed: false },
    a: {pressed: false },
    s: { pressed: false },
    d: { pressed: false },
}

const movables = [background, ...boundaries, foreground, ...adminBuildingDoors]

function rectangularCollision({rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
        )
}

const adminBuildingDoorEntry = {
    initiated: false
}

function animate() {
   const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    adminBuildingDoors.forEach((adminBuildingDoor) => {
        adminBuildingDoor.draw()
    })

    player.draw()
    foreground.draw()

    let moving = true
    player.moving = false
    
    console.log(animationId)

    if (adminBuildingDoorEntry.initiated) return

    //walking through adminBuildingDoor
    if (keys.w.pressed) {
        for (let i = 0; i < adminBuildingDoors.length; i++) {
            const adminBuildingDoor = adminBuildingDoors[i]
            const overlappingArea =
                (Math.min(
                player.position.x + player.width,
                    adminBuildingDoor.position.x + adminBuildingDoor.width) -
                Math.max(
                    player.position.x,
                    adminBuildingDoor.position.x))
                * (Math.min(
                    player.position.y + player.height,
                    adminBuildingDoor.position.y + adminBuildingDoor.height) -
                Math.max(
                    player.position.y,
                    adminBuildingDoor.position.y))
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: adminBuildingDoor
                }) &&
                overlappingArea > (player.width * player.height)/4
            ) {
                console.log("adminBuildingDoor entered")

                //deactivate current animation
                window.cancelAnimationFrame(animationId)
               
                adminBuildingDoorEntry.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to("#overlappingDiv", {
                            opacity: 1,
                            duration: 0.4
                        })
                        //activate new animation loop
                        animateAdminBuilding()
                    }
                })
                break
            }
        }
    }

    // let moving = true
    // player.moving = false
    if (keys.w.pressed && lastKey === 'w') {
        player.moving = true
        player.image = player.sprites.up
       
        for (let i = 0; i < boundaries.length; i++){
            const boundary  = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y +3
                    } }
                })
            ) {
                console.log("colliding")
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach(movable => { movable.position.y += 3 })
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log("colliding")
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach(movable => { movable.position.x += 3 })
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                console.log("colliding")
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach(movable => { movable.position.y -= 3 })
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true
        player.image = player.sprites.right

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log("colliding")
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach(movable => { movable.position.x -= 3 })
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log("colliding")
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach(movable => { movable.position.x += 3 })
    }

    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log("colliding")
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach(movable => { movable.position.x += 3 })
    }
        

// console.log(keys.a)
}
animate()
function animateAdminBuilding() {
    window.requestAnimationFrame(animateAdminBuilding)
    console.log('animate admin building')
}
//creating movement
let lastKey = ""
window.addEventListener("keydown", (e)=> {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})
