import 'regenerator-runtime/runtime'
import { initialStateWithDisabledDraw } from '../util/state'
import { setEntity, generateEntity } from '../util/entity'
import {
  blueprint as defaultBlueprint,
  collideBox as defaultCollideBox,
  sprite as defaultSprite,
} from '../util/defaultComponents'
import { getComponent, setComponent } from '../component'
import { Blueprint, CollideBox, Entity, State, Sprite } from '../type'
import { componentName } from '../component'
import { syncBlueprint } from '../util/blueprint'
import { addBlueprint } from '../util/asset'

describe('blueprint', () => {
  it('should update all components connected with blueprint', () => {
    const entity1 = generateEntity('e1')
    const entity2 = generateEntity('e2')
    const entity3 = generateEntity('e3')

    const entityId1 = entity1.id
    const entityId2 = entity2.id
    const entityId3 = entity3.id

    const gameObjectCreator = (
      entity: Entity,
      state: State,
      hasBlueprint: boolean,
    ): State => {
      const v1 = setEntity({
        entity,
        state,
      })
      const v2 = setComponent<Sprite>(componentName.sprite, {
        state: v1,
        data: defaultSprite({
          entityId: entity.id,
        }),
      })
      const v3 = setComponent<CollideBox>(componentName.collideBox, {
        state: v2,
        data: defaultCollideBox({
          entityId: entity.id,
        }),
      })

      return hasBlueprint
        ? setComponent<Blueprint>(componentName.blueprint, {
            state: v3,
            data: defaultBlueprint({
              entityId: entity.id,
              id: 'testBlueprint',
            }),
          })
        : v3
    }

    const stateWithBlueprint = addBlueprint({
      state: initialStateWithDisabledDraw,
      data: {
        entityId: generateEntity('-').id,
        name: 'test',
        data: {
          collideBox: defaultCollideBox({
            entityId: generateEntity('-').id,
            position: [1, 1],
          }),
        },
      },
    })

    const v1 = gameObjectCreator(entity1, stateWithBlueprint, true)
    const v2 = gameObjectCreator(entity2, v1, true)
    const v3 = gameObjectCreator(entity3, v2, false)

    const state = syncBlueprint(v3)

    // Sprite should not be touched by blueprint
    expect(
      getComponent<Sprite>(componentName.sprite, {
        state,
        entityId: entity1.id,
      })?.scale,
    ).toEqual([1, 1])
    expect(
      getComponent<Sprite>(componentName.sprite, {
        state,
        entityId: entity2.id,
      })?.scale,
    ).toEqual([1, 1])

    // ALL Collidebox properties should be changed to match blueprint
    expect(
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entityId: entity1.id,
      })?.position,
    ).toEqual([1, 1])
    expect(
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entityId: entity2.id,
      })?.position,
    ).toEqual([1, 1])

    // entity3 doesn't have blueprint so should not be changed
    expect(
      getComponent<Sprite>(componentName.sprite, {
        state,
        entityId: entity3.id,
      })?.scale,
    ).toEqual([1, 1])
    expect(
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entityId: entity3.id,
      })?.position,
    ).toEqual([0, 0])
  })
})
