import 'regenerator-runtime/runtime'
import { initialStateWithDisabledDraw } from '../util/state'
import { set as setEntity, generate } from '../util/entity'
import {
  defaultBlueprint,
  defaultCollideBox,
  defaultTransform,
} from '../util/defaultComponents'
import { getComponent, setComponent } from '../component'
import { CollideBox, Entity, State, Transform } from '../type'
import { componentName } from '../component'
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
      const v2 = setComponent(componentName.transform, {
        state: v1,
        data: defaultTransform({
          entity,
        }),
      })
      const v3 = setComponent(componentName.collideBox, {
        state: v2,
        data: defaultCollideBox({
          entity,
        }),
      })

      return hasBlueprint
        ? setComponent(componentName.blueprint, {
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
            position: [1, 1],
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
      getComponent<Transform>(componentName.transform, {
        state,
        entity: entity1,
      })?.position,
    ).toEqual([0, 0])
    expect(
      getComponent<Transform>(componentName.transform, {
        state,
        entity: entity2,
      })?.position,
    ).toEqual([0, 0])

    // ALL Collidebox properties should be changed to match blueprint
    expect(
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entity: entity1,
      })?.position,
    ).toEqual([1, 1])
    expect(
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entity: entity2,
      })?.position,
    ).toEqual([1, 1])

    // entity3 doesn't have blueprint so should not be changed
    expect(
      getComponent<Transform>(componentName.transform, {
        state,
        entity: entity3,
      })?.position,
    ).toEqual([0, 0])
    expect(
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entity: entity3,
      })?.position,
    ).toEqual([0, 0])
  })
})
