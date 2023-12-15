// https://www.fesliyanstudios.com/royalty-free-sound-effects-download/
const variablesObj = {
  radiusValues: [30, 40, 50, 60, 70, 80, 90, 100],
  audioURLs: [
    "https://www.fesliyanstudios.com/play-mp3/5668",
    "https://www.fesliyanstudios.com/play-mp3/2963",
    "https://www.fesliyanstudios.com/play-mp3/7008",
    "https://www.fesliyanstudios.com/play-mp3/2411",
    "https://www.fesliyanstudios.com/play-mp3/7007",
    "https://www.fesliyanstudios.com/play-mp3/7012",
    "https://www.fesliyanstudios.com/play-mp3/7014",
    "https://www.fesliyanstudios.com/play-mp3/3518",
    "https://www.fesliyanstudios.com/play-mp3/5460",
  ],
}

type VariablesObjKeys = keyof typeof variablesObj

export const getRandomValue = (valuesArrName: VariablesObjKeys): any => {
  const itemsArr = variablesObj[valuesArrName]
  const randomIndex = Math.floor(Math.random() * itemsArr.length)
  return itemsArr[randomIndex]
}

export const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  Array.from({ length: 6 }).forEach(() => {
    color += letters[Math.floor(Math.random() * 16)]
  })
  return color
}

export const createAudio = (
  src?: string
): HTMLAudioElement & { customPlay(): void } => {
  const audio = new Audio(
    src || getRandomValue("audioURLs")
  ) as HTMLAudioElement & {
    customPlay(): void
  }

  audio.customPlay = () => {
    audio.currentTime = 0
    audio.play()
  }

  audio.src = src || getRandomValue("audioURLs")

  audio.addEventListener("canplaythrough", () => {
    audio.currentTime = 0
    audio.play()
  })

  return audio
}
