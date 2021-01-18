import { add } from '@arekrado/vector-2d'
import { CollideBox, CollideCircle, Entity, Sprite } from '../type'

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
let debugGraphics: Map<string, PIXI.Graphics> = new Map()
let PIXI: any = null

const getGameContainerDimensions = (containerId: string) => {
  const element = document.querySelector(`#${containerId}`)

  return element ? [element.clientWidth, element.clientHeight] : [100, 100]
}

export const initialize = async (containerId = 'canvas-engine') => {
  // https://github.com/formium/tsdx/pull/367
  const module = await import('pixi.js')
  PIXI = module

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

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

type Render = (entity: Entity, sprite: Sprite) => void
export const renderSprite: Render = (entity, sprite) => {
  if (!isInitialized) {
    console.error('Pixi is not initialized')
    return
  }

  const pixiImage = images.get(entity.id)

  if (pixiApp) {
    if (pixiImage) {
      if (
        sprite !== undefined &&
        (pixiImage.texture.baseTexture as any).imageUrl !== sprite.src
      ) {
        changeImage({ pixiImage, sprite: sprite })
      }
      drawImage({ pixiImage, entity: entity })
    } else if (sprite) {
      drawImage({
        pixiImage: createImage({ images, pixiApp, sprite: sprite }),
        entity: entity,
      })
    }
  }
}

type DrawImage = (params: {
  pixiImage: EnhancedPixiImage
  entity: Entity
}) => void
const drawImage: DrawImage = ({ pixiImage, entity }) => {
  const position = entity.position
  const rotation = entity.rotation
  const scale = entity.scale

  pixiImage.x = position[0]
  pixiImage.y = position[1]
  pixiImage.scale.x = scale[0]
  pixiImage.scale.y = scale[1]
  pixiImage.rotation = rotation

  pixiImage.anchor.set(0, 0)
}

type CreateImage = (params: {
  images: Map<string, EnhancedPixiImage>
  pixiApp: PIXI.Application
  sprite: Sprite
}) => PIXI.Sprite

const createImage: CreateImage = ({ images, pixiApp, sprite }) => {
  const pixiImage = PIXI.Sprite.from(sprite.src) as EnhancedPixiImage
  pixiImage.id = sprite.entityId
  pixiImage.debugGraphics = new PIXI.Graphics() as PIXI.Graphics

  pixiApp.stage.addChild(pixiImage)
  pixiApp.stage.addChild(pixiImage.debugGraphics)

  images.set(pixiImage.id, pixiImage)

  return pixiImage
}

type ChangeImage = (params: {
  pixiImage: EnhancedPixiImage
  sprite: Sprite
}) => void
const changeImage: ChangeImage = ({ pixiImage, sprite }) => {
  pixiImage.texture = PIXI.Texture.from(sprite.src)
}

export const renderCollide = (
  entity: Entity,
  collideBox?: CollideBox,
  collideCircle?: CollideCircle,
) => {
  let debugGraphic = debugGraphics.get(entity.id)

  if (!debugGraphic) {
    debugGraphic = debugGraphics = new PIXI.Graphics() as PIXI.Graphics
    debugGraphics.set(entity.id, debugGraphic)
  }

  const { position } = entity

  debugGraphic.clear()

  if (collideBox) {
    const collideBoxPosition = add(collideBox.position, position)

    debugGraphic.lineStyle(1, 0x0000ff, 0.5)
    debugGraphic.drawRect(
      collideBoxPosition[0],
      collideBoxPosition[1],
      collideBox.size[0],
      collideBox.size[1],
    )
  }

  if (collideCircle) {
    const collideCirclePosition = add(collideCircle.position, position)

    debugGraphic.lineStyle(1, 0x0000ff, 0.5)
    debugGraphic.drawCircle(
      collideCirclePosition[0],
      collideCirclePosition[1],
      collideCircle.radius,
    )
  }
}
