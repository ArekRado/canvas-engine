import { DrawState } from 'system/draw'

declare namespace PIXI {
  type Sprite = any
  type Application = any
  type Graphics = any
}

type EnhancedPixiImage = PIXI.Sprite & {
  id: string
}

let isInitialized = false
let pixiApp: PIXI.Application | null = null
let images: Map<string, EnhancedPixiImage> = new Map()
let debugGraphics: PIXI.Graphics | null = null
let PIXI: any = null

const getGameContainerDimensions = () => {
  const element = document.querySelector('#canvas-game')

  return element ? [element.clientWidth, element.clientHeight] : [100, 100]
}

export const initialize = async () => {
  PIXI = import('pixi.js')

  const [x, y] = getGameContainerDimensions()

  pixiApp = new PIXI.Application({
    width: x,
    height: y,
    backgroundColor: 0x1099bb,
  }) as PIXI.Application
  ;(pixiApp.renderer as any).autoResize = true

  if (!document || !document.body) {
    console.warn("Couldn't find document body")
  } else {
    const element = document.querySelector('#canvas-game')
    element?.appendChild(pixiApp.view)
  }

  images = new Map()
  debugGraphics = new PIXI.Graphics() as PIXI.Graphics
  pixiApp.stage.addChild(debugGraphics)

  isInitialized = true
}

type Render = (data: DrawState[], devMode: boolean) => void
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

  data.forEach((image) => {
    const pixiImage = images.get(image.sprite.entity)

    if (pixiApp) {
      if (pixiImage) {
        if (
          (pixiImage.texture.baseTexture as any).imageUrl !==
          image.sprite.data.src
        ) {
          changeImage({ pixiImage, image })
        }
        drawImage({ pixiImage, image, devMode, debugGraphics })
      } else {
        drawImage({
          pixiImage: createImage({ images, pixiApp, image }),
          image,
          devMode,
          debugGraphics,
        })
      }
    }
  })
}

type DrawImage = (params: {
  pixiImage: EnhancedPixiImage
  image: DrawState
  devMode: boolean
  debugGraphics: PIXI.Graphics
}) => void
const drawImage: DrawImage = ({ pixiImage, image, devMode, debugGraphics }) => {
  // if (gameObject.image.stickToRigidbody) {
  //   image.x = gameObject.rigidbody.position.x
  //   image.y = gameObject.rigidbody.position.y
  // } else {
  pixiImage.x = image.transform.data.position[0]
  pixiImage.y = image.transform.data.position[1]
  // }

  // image.rotation = gameObject.rigidbody.rotation
  pixiImage.anchor.set(0, 0)

  if (devMode) {
    debugGraphics.lineStyle(1, 0x0000ff, 1)
    debugGraphics.drawRect(
      image.transform.data.position[0],
      image.transform.data.position[1],
      20,
      20,
    )

    // debugGraphics.drawRect(r.position.x, r.position.y, r.size.x, r.size.y)
  }
}
type CreateImage = (params: {
  images: Map<string, EnhancedPixiImage>
  pixiApp: PIXI.Application
  image: DrawState
}) => PIXI.Sprite

const createImage: CreateImage = ({ images, pixiApp, image }) => {
  const pixiImage = PIXI.Sprite.from(image.sprite.data.src) as EnhancedPixiImage
  pixiImage.id = image.sprite.entity
  pixiApp.stage.addChild(pixiImage)
  images.set(pixiImage.id, pixiImage)

  return pixiImage
}

type ChangeImage = (params: {
  pixiImage: EnhancedPixiImage
  image: DrawState
}) => PIXI.Sprite
const changeImage: ChangeImage = ({ pixiImage, image }) => {
  pixiImage.texture = PIXI.Texture.from(image.sprite.data.src)
  return image
}
