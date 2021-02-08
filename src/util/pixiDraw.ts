import { add } from '@arekrado/vector-2d'
import { Camera, CollideBox, CollideCircle, Entity, Sprite } from '../type'
declare namespace PIXI {
  type Sprite = any
  type Application = any
  type Graphics = any
}

type EnhancedPixiImage = PIXI.Sprite & {
  id: string
  debugGraphics?: PIXI.Graphics
}

let pixiApp: PIXI.Application | null = null
let images: Map<string, EnhancedPixiImage> = new Map()
let debugGraphics: Map<string, PIXI.Graphics> = new Map()
let PIXI: any = null

const getGameContainerDimensions = (containerId: string) => {
  const element = document.querySelector(`#${containerId}`)

  const { width, height } = element
    ? element.getBoundingClientRect()
    : { width: 0, height: 0 }

  return [width, height]
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
  })
  ;(pixiApp.renderer as any).autoResize = true

  if (!document || !document.body) {
    console.warn("Couldn't find document body")
  } else {
    const element = document.querySelector(`#${containerId}`)
    if (!element) {
      console.warn(`Container with id ${containerId} doesn't exists`)
    } else {
      element.appendChild(pixiApp.view)
    }
  }

  debugGraphics = new Map()
  images = new Map()
}

export const drawSprite = (entity: Entity, sprite: Sprite): void => {
  const pixiImage = images.get(sprite.entityId)

  if (
    sprite !== undefined &&
    (pixiImage.texture.baseTexture as any).imageUrl !== sprite.src
  ) {
    changeSprite(pixiImage, sprite)
  }

  pixiImage.x = entity.position[0]
  pixiImage.y = -entity.position[1]
  pixiImage.scale.x = sprite.scale[0]
  pixiImage.scale.y = sprite.scale[1]

  pixiImage.rotation = sprite.rotation

  pixiImage.anchor.set(sprite.anchor[0], sprite.anchor[1])
}

export const createSprite = (sprite: Sprite): void => {
  let debugGraphic = debugGraphics.get(sprite.entityId)

  if (!debugGraphic) {
    const pixiImage = PIXI.Sprite.from(sprite.src) as EnhancedPixiImage
    pixiImage.id = sprite.entityId
    pixiApp.stage.addChild(pixiImage)

    images.set(pixiImage.id, pixiImage)
  }
}

type ChangeImage = (pixiImage: EnhancedPixiImage, sprite: Sprite) => void
const changeSprite: ChangeImage = (pixiImage, sprite): void => {
  pixiImage.texture = PIXI.Texture.from(sprite.src)
}

export const removeSprite = (pixiImage: EnhancedPixiImage): void => {
  pixiApp.stage.removeChild(pixiImage)
  images.delete(pixiImage.id)
}

export const renderCollide = (
  entity: Entity,
  collideBox?: CollideBox,
  collideCircle?: CollideCircle,
): void => {
  let debugGraphic = debugGraphics.get(entity.id)

  if (!debugGraphic) {
    debugGraphic = debugGraphics = new PIXI.Graphics() as PIXI.Graphics
    debugGraphics.set(entity.id, debugGraphic)
  }

  const { position } = entity

  debugGraphic.clear()
  debugGraphic.rotation = entity.rotation

  if (collideBox) {
    const collideBoxPosition = add(collideBox.position, position)

    debugGraphic.lineStyle(1, 0x0000ff, 0.5)
    debugGraphic.drawRect(
      collideBoxPosition[0],
      -collideBoxPosition[1],
      collideBox.size[0],
      -collideBox.size[1],
    )
  }

  if (collideCircle) {
    const collideCirclePosition = add(collideCircle.position, position)

    debugGraphic.lineStyle(1, 0x0000ff, 0.5)
    debugGraphic.drawCircle(
      collideCirclePosition[0],
      -collideCirclePosition[1],
      -collideCircle.radius,
    )
  }
}

export const createCollide = (collide: CollideBox): void => {
  let debugGraphic = debugGraphics.get(collide.entityId)

  if (!debugGraphic) {
    debugGraphic = new PIXI.Graphics() as PIXI.Graphics
    pixiApp.stage.addChild(debugGraphic)
    debugGraphics.set(collide.entityId, debugGraphic)
  }
}

export const removeCollide = (collide: CollideBox): void => {
  const debugGraphic = debugGraphics.get(collide.entityId)

  if (debugGraphic) {
    pixiApp.stage.removeChild(debugGraphic)
    debugGraphics.delete(debugGraphic.id)
  }
}

export const setCamera = (camera: Camera): void => {
  pixiApp.stage.position.set(
    pixiApp.renderer.screen.width / 2,
    pixiApp.renderer.screen.height / 2,
  )
  pixiApp.stage.scale.set(camera.zoom)
  pixiApp.stage.pivot.set(camera.position[0], -camera.position[1])
}

export const extractImage = (): HTMLImageElement => {
  return pixiApp.renderer.plugins.extract.base64(pixiApp.stage)
}
