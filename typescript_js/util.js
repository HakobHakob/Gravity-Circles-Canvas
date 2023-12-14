const variablesObj = {
  radiusValues: [30, 40, 50, 60, 70, 80, 90, 100],
  audioURLs: [
    "https://www.fesliyanstudios.com/play-mp3/5668",
    "https://www.fesliyanstudios.com/play-mp3/2963",
    "https://www.fesliyanstudios.com/play-mp3/7005",
    "https://www.fesliyanstudios.com/play-mp3/7008",
    "https://www.fesliyanstudios.com/play-mp3/2411",
  ],
}
export const getRandomValue = (valuesArrName) => {
  const itemsArr = variablesObj[valuesArrName]
  const randomIndex = Math.floor(Math.random() * itemsArr.length)
  return itemsArr[randomIndex]
}
export const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  Array.from({ length: 6 }).forEach(() => {
    color += letters[Math.floor(Math.random() * 16)]
  })
  return color
}
export const createAudio = (src) => {
  const audio = new Audio(src || getRandomValue("audioURLs"))
  audio.customPlay = () => {
    audio.play()
  }
  audio.src = src || getRandomValue("audioURLs")
  audio.addEventListener("canplaythrough", () => {
    audio.play()
  })
  return audio
}
