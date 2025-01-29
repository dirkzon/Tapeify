interface SpotifyImage {
    height: number,
    url: string,
    width: number
}

export function GetSmallestImage(images: SpotifyImage[]): URL {
    let smallestHeight = images[0].height
    let smallesImageIndex = 0
    for (let i = 0; i < images.length; i++) { 
        if(images[i].height < smallestHeight) {
            smallestHeight = images[i].height
            smallesImageIndex = i
        }
    }
    return new URL(images[smallesImageIndex].url)
}