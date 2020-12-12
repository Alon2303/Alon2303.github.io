const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const contextWidth = canvas.width
const contextHeight = canvas.height
context.font = '30px Ariel'
let offsetX, offsetY
const coordinates = []
let isDone = false

const startCoordinatesTracking = () => {
    context.canvas.addEventListener('mousemove', function (event) {
        const mouseX = event.clientX - context.canvas.offsetLeft
        const mouseY = event.clientY - context.canvas.offsetTop
        const status = document.getElementById('status')
        status.innerHTML = mouseX + ' | ' + mouseY
    })
}

startCoordinatesTracking()

const getCanvasBorders = () => {
    const canvasBorders = canvas.getBoundingClientRect()
    offsetX = canvasBorders.left
    offsetY = canvasBorders.top
}

getCanvasBorders()

context.lineWidth = 4
context.strokeStyle = 'black'

document.getElementById('calc').addEventListener('click', () => {
    if (context.fillStyle === '#000000') {
        context.fillStyle = getRandomColor()
        context.lineTo(coordinates[0].x, coordinates[0].y)
        context.stroke()
        context.fill()
    }
    isDone = true
    calculateSurfaceOfPolygon(coordinates)
})

document.getElementById('clear').addEventListener('click', () => {
    isDone = false
    coordinates.splice(0, coordinates.length)
    context.fillStyle = '#000000'
    context.clearRect(0, 0, contextWidth, contextHeight)
})

canvas.addEventListener('mousedown', function (e) {
    handleMouseDown(e)
})

const handleMouseDown = (e) => {
    if (isDone || coordinates.length > 30) {
        return
    }

    e.preventDefault()
    e.stopPropagation()

    mouseX = parseInt(e.clientX - offsetX)
    mouseY = parseInt(e.clientY - offsetY)
    coordinates.push({ x: mouseX, y: mouseY })
    drawPolygon()
}

const drawPolygon = () => {
    context.clearRect(0, 0, contextWidth, contextHeight)
    context.beginPath()
    context.moveTo(coordinates[0].x, coordinates[0].y)
    for (index = 1; index < coordinates.length; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y)
    }
    context.stroke()
}

const getRandomColor = () => {
    const red = Math.floor(Math.random() * 255)
    const green = Math.floor(Math.random() * 255)
    const blue = Math.floor(Math.random() * 255)

    return 'rgb(' + red + ',' + green + ',' + blue + ' )'
}

const calculateSurfaceOfPolygon = (coordinatesArray) => {
    let total = 0
    const length = coordinatesArray.length

    for (let index = 0; index < length; index++) {
        const addX = coordinatesArray[index].x
        const addY = coordinatesArray[(index + 1) % length].y
        const subX = coordinatesArray[(index + 1) % length].x
        const subY = coordinatesArray[index].y

        total += addX * addY * 0.5
        total -= subX * subY * 0.5
    }

    const percentageOfArea = ((Math.abs(total) / 250000) * 100).toFixed(2)
    context.fillText(`Area: ${Math.abs(total)}`, 10, 50)
}