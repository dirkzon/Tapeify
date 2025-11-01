import type { ImageDTO } from "@/types/spotify/dto"

export function GetSmallestImage(images: ImageDTO[]): URL | undefined {
  if (images === null || images === undefined) return undefined
  if (images.length === 0) return undefined
  let smallestHeight = images[0].height
  let smallesImageIndex = 0
  for (let i = 0; i < images.length; i++) {
    if (images[i].height < smallestHeight) {
      smallestHeight = images[i].height
      smallesImageIndex = i
    }
  }
  return new URL(images[smallesImageIndex].url)
}
