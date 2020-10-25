import { Sprite } from '../component'

type EnhancedPixiImage = PIXI.Sprite & {
  id: string
}

let isInitialized = false
let pixiApp: PIXI.Application | null = null
let images: Map<string, EnhancedPixiImage> = new Map()
let debugGraphics: PIXI.Graphics | null = null
// let PIXI = null

let getGameContainerDimensions = () => {
  const element = document.querySelector('#engine-game')

  return element ? [element.clientWidth, element.clientHeight] : [100, 100]
}

let initialize = async () => {
  let PIXI = await import('pixi.js')

  const [x, y] = getGameContainerDimensions()

  pixiApp = new PIXI.Application({
    width: x,
    height: y,
    backgroundColor: 0x1099bb,
  })

  ;(pixiApp.renderer as any).autoResize = true

  if (!document || !document.body) {
    console.warn("Couldn't find document body")
  } else {
    const element = document.querySelector('#engine-game')
    element?.appendChild(pixiApp.view)
  }

  images = new Map()
  debugGraphics = new PIXI.Graphics()
  pixiApp.stage.addChild(debugGraphics)

  isInitialized = true
}

type Render = (data: Sprite[], devMode: boolean) => void
export const render: Render = (data, devMode = false) => {
  if (Array.isArray(data) === false) {
    return
  }

  if (!isInitialized || !debugGraphics) {
    console.error('Pixi not initialized')
    return
  }
  debugGraphics.clear()

  // const state = data.flat(Infinity).slice(0, -1)

  Object.values(data).forEach((image) => {
    const pixiImage = images.get(image.entity)

    if (pixiImage) {
      if ((pixiImage.texture.baseTexture as any).imageUrl !== image.data.src) {
        changeImage(pixiImage, image)
      }
      drawImage(pixiImage, image, devMode, debugGraphics)
    } else {
      drawImage(
        createImage(images, pixiApp, image),
        image,
        devMode,
        debugGraphics,
      )
    }
  })
}

const drawImage = (
  pixiImage: any,
  image: any,
  devMode: boolean,
  debugGraphic: any,
) => {
  // if (gameObject.image.stickToRigidbody) {
  //   image.x = gameObject.rigidbody.position.x
  //   image.y = gameObject.rigidbody.position.y
  // } else {
  pixiImage.x = image.x
  pixiImage.y = image.y
  // }

  // image.rotation = gameObject.rigidbody.rotation
  pixiImage.anchor.set(0, 0)

  if (devMode) {
    debugGraphic.lineStyle(1, 0x0000ff, 1)
    debugGraphic.drawRect(image.x, image.y, 20, 20)

    // debugGraphic.drawRect(r.position.x, r.position.y, r.size.x, r.size.y)
  }
}

const createImage = (images: any, pixiApp: any, image: any) => {
  const pixiImage = PIXI.Sprite.from(image.src) as EnhancedPixiImage
  pixiImage.id = image.entity
  pixiApp.stage.addChild(pixiImage)
  images.set(pixiImage.id, pixiImage)

  return pixiImage
}

const changeImage = (pixiImage: any, image: any) => {
  pixiImage.texture = PIXI.Texture.from(image.src)
  return image
}
