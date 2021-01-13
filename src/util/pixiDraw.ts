import { add } from '@arekrado/vector-2d'
import { DrawState } from '../system/draw'

declare namespace PIXI {
  type Sprite = any
  type Application = any
  type Graphics = any
}

type EnhancedPixiImage = PIXI.Sprite & {
  id: string
  debugGraphics?: PIXI.Graphics
}

let isInitialized = false
let pixiApp: PIXI.Application | null = null
let images: Map<string, EnhancedPixiImage> = new Map()
let PIXI: any = null

const getGameContainerDimensions = (containerId: string) => {
  const element = document.querySelector(`#${containerId}`)

  return element ? [element.clientWidth, element.clientHeight] : [100, 100]
}

export const initialize = async (containerId = 'canvas-engine') => {
  // https://github.com/formium/tsdx/pull/367
  const module = await import('pixi.js')
  PIXI = module

  const [x, y] = getGameContainerDimensions(containerId)

  pixiApp = new PIXI.Application({
    width: x,
    height: y,
    backgroundColor: 0x1099bb,
  }) as PIXI.Application
  ;(pixiApp.renderer as any).autoResize = true

  if (!document || !document.body) {
    console.warn("Couldn't find document body")
  } else {
    const element = document.querySelector(`#${containerId}`)
    if (!element) {
      console.log(`Container with id ${containerId} doesn't exists`)
    } else {
      element.appendChild(pixiApp.view)
    }
  }

  images = new Map()

  isInitialized = true
}

type Render = (state: DrawState, devMode: boolean) => void
export const render: Render = (state, devMode = false) => {
  if (!isInitialized) {
    console.error('Pixi is not initialized')
    return
  }

  const pixiImage = images.get(state.sprite.entityId)

  if (pixiApp) {
    if (pixiImage) {
      if (
        (pixiImage.texture.baseTexture as any).imageUrl !== state.sprite.src
      ) {
        changeImage({ pixiImage, image: state })
      }
      drawImage({ pixiImage, image: state, devMode })
    } else {
      drawImage({
        pixiImage: createImage({ images, pixiApp, image: state }),
        image: state,
        devMode,
      })
    }
  }
}

type DrawImage = (params: {
  pixiImage: EnhancedPixiImage
  image: DrawState
  devMode: boolean
}) => void
const drawImage: DrawImage = ({ pixiImage, image, devMode }) => {
  const position = image.entity.position
  const rotation = image.entity.rotation
  const scale = image.entity.scale

  pixiImage.x = position[0]
  pixiImage.y = position[1]
  pixiImage.scale.x = scale[0]
  pixiImage.scale.y = scale[1]
  pixiImage.rotation = rotation

  pixiImage.anchor.set(0, 0)

  if (pixiImage.debugGraphics && devMode) {
    const debugGraphics = pixiImage.debugGraphics

    debugGraphics.clear()

    const collideBox = image.collideBox
    const collideCircle = image.collideCircle

    if (collideBox) {
      const collideBoxPosition = add(collideBox.position, position)

      debugGraphics.lineStyle(1, 0x0000ff, 0.5)
      debugGraphics.drawRect(
        collideBoxPosition[0],
        collideBoxPosition[1],
        collideBox.size[0],
        collideBox.size[1],
      )
    }

    if (collideCircle) {
      const collideCirclePosition = add(collideCircle.position, position)

      debugGraphics.lineStyle(1, 0x0000ff, 0.5)
      debugGraphics.drawCircle(
        collideCirclePosition[0],
        collideCirclePosition[1],
        collideCircle.radius,
      )
    }
  }
}
type CreateImage = (params: {
  images: Map<string, EnhancedPixiImage>
  pixiApp: PIXI.Application
  image: DrawState
}) => PIXI.Sprite

const createImage: CreateImage = ({ images, pixiApp, image }) => {
  const pixiImage = PIXI.Sprite.from(image.sprite.src) as EnhancedPixiImage
  pixiImage.id = image.sprite.entityId
  pixiImage.debugGraphics = new PIXI.Graphics() as PIXI.Graphics

  pixiApp.stage.addChild(pixiImage)
  pixiApp.stage.addChild(pixiImage.debugGraphics)

  images.set(pixiImage.id, pixiImage)

  return pixiImage
}

type ChangeImage = (params: {
  pixiImage: EnhancedPixiImage
  image: DrawState
}) => PIXI.Sprite
const changeImage: ChangeImage = ({ pixiImage, image }) => {
  pixiImage.texture = PIXI.Texture.from(image.sprite.src)
  return image
}
