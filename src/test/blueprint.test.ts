import 'regenerator-runtime/runtime'
import { vector, Vector2D } from '@arekrado/vector-2d'
import { initialStateWithDisabledDraw } from '../util/initialState'
import { set as setEntity, generate } from '../util/entity'
import { runOneFrame } from '../util/runOneFrame'
import {
  defaultBlueprint,
  defaultCollideBox,
  defaultTransform,
} from '../util/defaultComponents'
import { detectAABBcollision } from '../system/collideBox'
import { getComponent, setComponent } from '../component'
import { CollideBox, Entity, State, Transform } from '../type'
import { componentName } from '../component'
import { v4 } from 'uuid'
import { syncBlueprint } from '../util/blueprint'
import { addBlueprint } from '../util/asset'

describe('blueprint', () => {
  it('should update all components connected with blueprint', () => {
    const entity1 = generate('e1')
    const entity2 = generate('e2')
    const entity3 = generate('e3')

    const gameObjectCreator = (
      entity: Entity,
      state: State,
      hasBlueprint: boolean,
    ): State => {
      const v1 = setEntity({
        entity,
        state,
      })
      const v2 = setComponent({
        name: componentName.transform,
        state: v1,
        data: defaultTransform({
          entity,
        }),
      })
      const v3 = setComponent({
        name: componentName.collideBox,
        state: v2,
        data: defaultCollideBox({
          entity,
        }),
      })

      return hasBlueprint
        ? setComponent({
            name: componentName.blueprint,
            state: v3,
            data: defaultBlueprint({
              entity,
              id: 'testBlueprint',
            }),
          })
        : v3
    }

    const stateWithBlueprint = addBlueprint({
      state: initialStateWithDisabledDraw,
      data: {
        entity: generate('-'),
        name: 'test',
        data: {
          collideBox: defaultCollideBox({
            entity: generate('-'),
          }),
        },
      },
    })

    const v1 = gameObjectCreator(entity1, stateWithBlueprint, true)
    const v2 = gameObjectCreator(entity2, v1, true)
    const v3 = gameObjectCreator(entity3, v2, false)

    const state = syncBlueprint(v3)

    // Transform should not be touched by blueprint
    expect(
      getComponent<Transform>({
        state,
        entity: entity1,
        name: componentName.transform,
      })?.position,
    ).toEqual([0, 0])
    expect(
      getComponent<Transform>({
        state,
        entity: entity2,
        name: componentName.transform,
      })?.position,
    ).toEqual([0, 0])

    // Collidebox should be changed by blueprint
    expect(
      getComponent<CollideBox>({
        state,
        entity: entity1,
        name: componentName.collideBox,
      })?.position,
    ).toEqual([0, 0])
    expect(
      getComponent<CollideBox>({
        state,
        entity: entity2,
        name: componentName.collideBox,
      })?.position,
    ).toEqual([0, 0])

    // entity3 doesn't have blueprint so should not be changed
    expect(
      getComponent<Transform>({
        state,
        entity: entity3,
        name: componentName.transform,
      })?.position,
    ).toEqual([0, 0])
    expect(
      getComponent<CollideBox>({
        state,
        entity: entity3,
        name: componentName.collideBox,
      })?.position,
    ).toEqual([0, 0])
  })
})
