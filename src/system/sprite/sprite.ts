import { InternalInitialState, Transform, Sprite, Entity } from '../../type'
import { createSystem } from '../createSystem'
import { componentName } from '../../component/componentName'
import { getMaterial } from '../material/materialCrud'
import { getTransform } from '../transform/transformCrud'
import { Sprite as ThreeSprite, SpriteMaterial } from 'three'
import { getThreeMaterial } from '../material/material'
import { getScene } from '../../util/state'

const spriteObject: Record<Entity, ThreeSprite | undefined> = {}

export const getThreeSprite = (entity: Entity): ThreeSprite | undefined =>
  spriteObject[entity]

export const updateSpriteTransform = ({
  sprite,
  transform,
}: {
  sprite: ThreeSprite
  transform: Transform
}) => {
  sprite.position.x = transform.position[0]
  sprite.position.y = transform.position[1]
  sprite.position.z = transform.position[2]

  // sprite.rotation.x = transform.rotation[0]
  // sprite.rotation.y = transform.rotation[1]
  // sprite.rotation.z = transform.rotation[2]

  sprite.scale.x = transform.scale[0]
  sprite.scale.y = transform.scale[1]
  sprite.scale.z = transform.scale[2] ?? 1
}

const createOrUpdateSprite = ({
  spriteInstance,
  material,
}: {
  sprite: Sprite
  spriteInstance: ThreeSprite | undefined
  material: SpriteMaterial | undefined
}) => {
  // const { PlaneGeometry, sceneRef, Vector3, Color4 } = state.three
  // if (!(PlaneGeometry && sceneRef && Vector3 && Color4)) {
  //   if (process.env.NODE_ENV === 'development') {
  //     console.warn('To use Sprite engine requires all properties to be defined', {
  //       PlaneGeometry,
  //       sceneRef,
  //       Vector3,
  //       Color4,
  //     })
  //   }

  //   return undefined
  // }

  if (spriteInstance || !material) {
    return undefined
  }

  return new ThreeSprite(material)
}

export const spriteSystem = (state: InternalInitialState) =>
  createSystem<Sprite, InternalInitialState>({
    state,
    name: componentName.sprite,
    componentName: componentName.sprite,
    create: ({ state, component, entity }) => {
      const sceneRef = getScene()
      if (!sceneRef) return state

      const materialComponent = getMaterial({
        state,
        entity,
      })

      if (!materialComponent) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Sprite has been created without material component. Sprite entity: ${entity}`,
          )
        }
      }

      const sprite = createOrUpdateSprite({
        sprite: component,
        spriteInstance: undefined,
        material: getThreeMaterial(entity) as SpriteMaterial | undefined,
      })

      if (!sprite) {
        return state
      }

      sprite.name = entity
      spriteObject[entity] = sprite

      sceneRef.add(sprite)

      const transform = getTransform({
        state,
        entity,
      })

      if (transform) {
        updateSpriteTransform({
          sprite,
          transform,
        })
      }

      return state
    },
    remove: ({ state, entity }) => {
      const sceneRef = getScene()
      const sprite = getThreeSprite(entity)

      if (sceneRef && sprite) {
        sceneRef.remove(sprite)
        if (sprite instanceof ThreeSprite && sprite.geometry) {
          sprite.geometry.dispose()
        }
        spriteObject[entity] = undefined
      }

      return state
    },
    update: ({ state, entity, component }) => {
      const spriteInstance = getThreeSprite(entity)

      if (spriteInstance) {
        createOrUpdateSprite({
          sprite: component,
          spriteInstance,
          material: getThreeMaterial(entity) as SpriteMaterial | undefined,
        })

        const transform = getTransform({ state, entity })
        if (transform) {
          updateSpriteTransform({
            sprite: spriteInstance,
            transform,
          })
        }
      }

      return state
    },
  })
