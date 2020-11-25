import 'regenerator-runtime/runtime'
import { vector, Vector2D } from '@arekrado/vector-2d'
import { initialStateWithDisabledDraw } from '../util/initialState'
import { set as setEntity, generate } from '../util/entity'
import { runOneFrame } from '../util/runOneFrame'
import { defaultCollideBox, defaultTransform } from '../util/defaultComponents'
import { detectAABBcollision } from '../system/collideBox'
import { getComponent, setComponent } from '../component'
import { CollideBox } from '../type'
import { componentName } from '../component'

describe('collide', () => {
  describe('detectAABBcollision', () => {
    it('should detect edge collisions', () => {
      const edgeV1: Vector2D[] = [
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, 0],
        [1, -1],
      ]

      edgeV1.forEach((v1) => {
        expect(
          detectAABBcollision({
            v1,
            size1: vector(1, 1),
            v2: vector(0, 0),
            size2: vector(1, 1),
          }),
        ).toBeTruthy()
      })
    })

    it('should not detect collisions when object is outside', () => {
      const outsideV1: Vector2D[] = [
        [-2, 1],
        [-2, 0],
        [-2, -1],
        [0, 2],
        [0, -2],
        [2, 1],
        [2, 0],
        [2, -1],
      ]

      outsideV1.forEach((v1) => {
        expect(
          detectAABBcollision({
            v1,
            size1: vector(1, 1),
            v2: vector(0, 0),
            size2: vector(1, 1),
          }),
        ).toBeFalsy()
      })
    })

    it('should detect collisions when object inside', () => {
      const outsideV1: Vector2D[] = [
        [0, 0],
        [-0.5, 1],
        [-0.5, 0],
        [-0.5, -1],
        [0, 0.5],
        [0, -0.5],
        [0.5, 0.5],
        [0.5, 0],
        [0.5, -0.5],
      ]

      outsideV1.forEach((v1) => {
        expect(
          detectAABBcollision({
            v1,
            size1: vector(1, 1),
            v2: vector(0, 0),
            size2: vector(1, 1),
          }),
        ).toBeTruthy()
      })
    })
  })

  it('detect collisions box-box', () => {
    const entity1 = generate('e1')
    const entity2 = generate('e2')
    const entity3 = generate('e3')

    const v1 = setEntity({ entity: entity1, state: initialStateWithDisabledDraw })
    const v2 = setEntity({ entity: entity2, state: v1 })
    const v3 = setEntity({ entity: entity3, state: v2 })

    const v4 = setComponent({
      name: componentName.transform,
      state: v3,
      data: defaultTransform({
        entity: entity1,
        localPosition: vector(0, 0),
      }),
    })

    const v5 = setComponent({
      name: componentName.transform,
      state: v4,
      data: defaultTransform({
        entity: entity2,
        localPosition: vector(1, 1),
      }),
    })

    const v6 = setComponent({
      name: componentName.transform,
      state: v5,
      data: defaultTransform({
        entity: entity3,
        localPosition: vector(3.5, 3.5),
      }),
    })

    const v7 = setComponent({
      name: componentName.collideBox,
      state: v6,
      data: defaultCollideBox({
        entity: entity1,
        size: vector(1.5, 1.5),
        position: vector(1, 1),
      }),
    })

    const v8 = setComponent({
      name: componentName.collideBox,
      state: v7,
      data: defaultCollideBox({
        entity: entity2,
        size: vector(1, 1),
        position: vector(0, 0),
      }),
    })

    const v9 = setComponent({
      name: componentName.collideBox,
      state: v8,
      data: defaultCollideBox({
        entity: entity3,
        size: vector(1, 1),
        position: vector(-1, -1),
      }),
    })

    const state = runOneFrame({ state: v9, timeNow: 0 })

    const collisions1 =
      getComponent<CollideBox>({
        name: componentName.collideBox,
        state,
        entity: entity1,
      })?.collisions || []

    const collisions2 =
      getComponent<CollideBox>({
        name: componentName.collideBox,
        state,
        entity: entity2,
      })?.collisions || []

    const collisions3 =
      getComponent<CollideBox>({
        name: componentName.collideBox,
        state,
        entity: entity3,
      })?.collisions || []

    expect(collisions1[0].entity).toEqual(entity2)
    expect(collisions1[1]).not.toBeDefined()

    expect(collisions2[0].entity).toEqual(entity1)
    expect(collisions2[1].entity).toEqual(entity3)

    expect(collisions3[0].entity).toEqual(entity2)
    expect(collisions3[1]).not.toBeDefined()
  })
})
