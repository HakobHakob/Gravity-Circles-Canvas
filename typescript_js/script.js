import {
  getRandomValue,
  getRandomColor,
  createAudio,
  clonedObjectData,
} from "./util.js"
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 1000 / 60)
  }
}
const canvas = document.getElementById("gravityCanvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const circlesData = {
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  xPos: 0,
  yPos: 0,
  gravity: 0.8,
  radius: 0,
  color: "",
  velocityY: 0,
  xDelta: 1,
  isMoving: true,
  isCircleClicked: false,
  circles: [],
}
const clonedCirclesData = clonedObjectData(circlesData)
const createCircle = () => {
  let {
    canvasWidth,
    canvasHeight,
    xPos,
    yPos,
    gravity,
    radius,
    color,
    velocityY,
    xDelta,
    isMoving,
    isCircleClicked,
  } = clonedCirclesData
  xDelta = getRandomValue("randomVelocityValues")
  const draw = () => {
    ctx.beginPath()
    ctx.arc(xPos, yPos, radius, 0, Math.PI * 2, false)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
  }
  const update = () => {
    // Gravity effect
    velocityY += gravity
    yPos += velocityY
    if (yPos + radius > canvasHeight) {
      yPos = canvasHeight - radius
      velocityY *= -0.8
    }
    // Move circles horizontally based on the direction
    if (isMoving && yPos + radius === canvasHeight) {
      xPos += xDelta
      if (xPos + radius >= canvasWidth) {
        isMoving = false
        createAudio()
      }
    } else if (!isMoving) {
      xPos -= xDelta
      if (xPos - radius <= 0) {
        isMoving = true
        createAudio()
      }
    }
    draw()
  }
  // Remove circle from canvas
  const removeCircle = (e) => {
    if (isCircleClicked) {
      return
    }
    const mouseX = e.clientX
    const mouseY = e.clientY
    const distance = Math.sqrt(
      Math.pow(mouseX - xPos, 2) + Math.pow(mouseY - yPos, 2)
    )
    if (distance <= radius) {
      isCircleClicked = true
      canvas.removeEventListener("click", removeCircle)
      clonedCirclesData.circles = clonedCirclesData.circles.filter(
        (circle) => circle !== circleObj
      )
    }
  }
  const circleObj = { draw, update, removeCircle }
  canvas.addEventListener("click", removeCircle)
  return circleObj
}
const animate = () => {
  requestAnimationFrame(animate)
  ctx.clearRect(
    0,
    0,
    clonedCirclesData.canvasWidth,
    clonedCirclesData.canvasHeight
  )
  clonedCirclesData.circles.forEach((circle) => {
    circle.update()
  })
}
const updateCirclesData = (mouseX, mouseY) => {
  const canvasRect = canvas.getBoundingClientRect()
  clonedCirclesData.xPos = mouseX - canvasRect.left
  clonedCirclesData.yPos = mouseY - canvasRect.top
  clonedCirclesData.radius = getRandomValue("radiusValues")
  clonedCirclesData.color = getRandomColor()
}
const spawnCircle = (mouseX, mouseY) => {
  updateCirclesData(mouseX, mouseY)
  clonedCirclesData.circles.push(createCircle())
}
const updateCanvasDimensions = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
const resizeWindow = () => {
  updateCanvasDimensions()
  createAudio()
}
window.addEventListener("resize", resizeWindow)
canvas.addEventListener("click", (e) => {
  if (clonedCirclesData.circles.length <= 14) {
    spawnCircle(e.clientX, e.clientY)
    createAudio()
  }
})
animate()
