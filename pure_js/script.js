import { getRandomValue, getRandomColor, createAudio } from "./util.js"
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
  circles: [],
}
const createCircle = (x, y, radius, color) => {
  let velocityY = 0
  let xDelta = 1
  let isMoving = true
  let isCircleClicked = false
  const draw = () => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2, false)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
  }
  const update = () => {
    // Gravity effect
    velocityY += circlesData.gravity
    y += velocityY
    if (y + radius > circlesData.canvasHeight) {
      y = circlesData.canvasHeight - radius
      velocityY *= -0.8
    }
    // Move circles horizontally based on the direction
    if (isMoving && y + radius === circlesData.canvasHeight) {
      x += xDelta
      if (x + radius >= circlesData.canvasWidth) {
        isMoving = false
      }
    } else if (!isMoving) {
      x -= xDelta
      if (x - radius <= 0) {
        isMoving = true
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
      Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)
    )
    if (distance <= radius) {
      isCircleClicked = true
      canvas.removeEventListener("click", removeCircle)
      circlesData.circles = circlesData.circles.filter(
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
  ctx.clearRect(0, 0, circlesData.canvasWidth, circlesData.canvasHeight)
  circlesData.circles.forEach((circle) => {
    circle.update()
  })
}
const updateCirclesData = (mouseX, mouseY) => {
  const canvasRect = canvas.getBoundingClientRect()
  circlesData.xPos = mouseX - canvasRect.left
  circlesData.yPos = mouseY - canvasRect.top
  circlesData.radius = getRandomValue("radiusValues")
  circlesData.color = getRandomColor()
}
const spawnCircle = (mouseX, mouseY) => {
  updateCirclesData(mouseX, mouseY)
  const { xPos, yPos, radius, color } = circlesData
  circlesData.circles.push(createCircle(xPos, yPos, radius, color))
}
const updateCanvasDimensions = () => {
  circlesData.canvasWidth = window.innerWidth
  circlesData.canvasHeight = window.innerHeight
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
const resizeWindow = () => {
  updateCanvasDimensions()
  createAudio()
}
window.addEventListener("resize", resizeWindow)
canvas.addEventListener("click", (e) => {
  if (circlesData.circles.length <= 14) {
    spawnCircle(e.clientX, e.clientY)
    createAudio()
  }
})
animate()
