import {
  getRandomValue,
  getRandomColor,
  createAudio,
  clonedObjectData,
} from "./util"

declare global {
  interface Window {
    requestAnimationFrame: (callback: FrameRequestCallback) => number
  }
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(callback, 1000 / 60)
  }
}

const canvas: HTMLCanvasElement = document.getElementById(
  "gravityCanvas"
) as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!

canvas.width = window.innerWidth
canvas.height = window.innerHeight

interface CircleData {
  canvasWidth: number
  canvasHeight: number
  xPos: number
  yPos: number
  gravity: number
  radius: number
  color: string
  velocityY: number
  xDelta: number
  isMoving: boolean
  isCircleClicked: boolean
  circles: Circle[]
}

interface Circle {
  draw: () => void
  update: () => void
  removeCircle: (e: MouseEvent) => void
}

const circlesData: CircleData = {
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

const createCircle = (): Circle => {
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
  const removeCircle = (e: MouseEvent) => {
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
        (circle: any) => circle !== circleObj
      )
    }
  }

  const circleObj: Circle = { draw, update, removeCircle }
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

  clonedCirclesData.circles.forEach((circle: any) => {
    circle.update()
  })
}

const updateCirclesData = (mouseX: number, mouseY: number) => {
  const canvasRect = canvas.getBoundingClientRect()
  clonedCirclesData.xPos = mouseX - canvasRect.left
  clonedCirclesData.yPos = mouseY - canvasRect.top
  clonedCirclesData.radius = getRandomValue("radiusValues")
  clonedCirclesData.color = getRandomColor()
}

const spawnCircle = (mouseX: number, mouseY: number) => {
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

canvas.addEventListener("click", (e: MouseEvent) => {
  if (clonedCirclesData.circles.length <= 14) {
    spawnCircle(e.clientX, e.clientY)
    createAudio()
  }
})

animate()
