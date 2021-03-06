import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { initialStateWithDisabledDraw } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import {
  collideBox as defaultCollideBox,
  collideCircle as defaultCollideCircle,
  mouseInteraction as defaultMouseInteraction
} from '../util/defaultComponents'
import { getComponent, setComponent } from '../component'
import { CollideBox, CollideCircle, MouseInteraction } from '../type'
import { componentName } from '../component'
import { isMouseOver } from '../system/mouseInteraction'

describe('mouseInteraction', () => {
  it('isMouseOver', () => {
    const entity = createEntity('entity')
    const entityId = entity.id
    const mouse = initialStateWithDisabledDraw.mouse

    // Mouse is not over collide
    expect(
      isMouseOver({
        mouse: {
          ...mouse,
          position: vector(-10, -10),
        },
        collideBox: defaultCollideBox({ entityId }),
        entity
      }),
    ).toBeFalsy()

    // Mouse is over collideBox
    expect(
      isMouseOver({
        mouse: {
          ...mouse,
          position: vector(5, 5),
        },
        collideBox: defaultCollideBox({ entityId, size: vector(10, 10) }),
        entity
      }),
    ).toBeTruthy()

    // Mouse is over collideCircle
    expect(
      isMouseOver({
        mouse: {
          ...mouse,
          buttons: 1,
          position: vector(5, 5),
        },
        collideCircle: defaultCollideCircle({ entityId, radius: 10 }),
        entity
      }),
    ).toBeTruthy()
  })

  it('should set proper mouse interaction values', () => {
    const entity = createEntity('entity')
    const entityId = entity.id

    const v1 = setEntity({
      entity,
      state: initialStateWithDisabledDraw,
    })
    const v2 = setEntity({ entity, state: v1 })

    const v3 = setComponent<MouseInteraction>(componentName.mouseInteraction, {
      state: v2,
      data: defaultMouseInteraction({
        entityId,
      }),
    })

    const v5 = setComponent<CollideBox>(componentName.collideBox, {
      state: v3,
      data: defaultCollideBox({
        entityId,
        position: vector(200, 200),
        size: vector(10, 10),
      }),
    })

    const v6 = setComponent<CollideCircle>(componentName.collideCircle, {
      state: v5,
      data: defaultCollideCircle({
        entityId,
        position: vector(100, 100),
        radius: 10,
      }),
    })

    // Mouse is not over element
    const v7 = runOneFrame({
      state: {
        ...v6,
        mouse: {
          ...v6.mouse,
          position: vector(0, 0),
        },
      },
      timeNow: 0,
    })

    const mouseInteraction1 = getComponent<MouseInteraction>(
      componentName.mouseInteraction,
      {
        state: v7,
        entityId,
      },
    )

    expect(mouseInteraction1?.isMouseOver).toBeFalsy()
    expect(mouseInteraction1?.isMouseEnter).toBeFalsy()
    expect(mouseInteraction1?.isMouseLeave).toBeFalsy()

    // Mouse is over collideBox
    const v8 = runOneFrame({
      state: {
        ...v7,
        mouse: {
          ...v7.mouse,
          position: vector(100, 100),
        },
      },
      timeNow: 0,
    })

    const mouseInteraction2 = getComponent<MouseInteraction>(
      componentName.mouseInteraction,
      {
        state: v8,
        entityId,
      },
    )

    expect(mouseInteraction2?.isMouseOver).toBeTruthy()
    expect(mouseInteraction2?.isMouseEnter).toBeTruthy()
    expect(mouseInteraction2?.isMouseLeave).toBeFalsy()

    // Mouse is over collideCircle
    const v9 = runOneFrame({
      state: {
        ...v8,
        mouse: {
          ...v8.mouse,
          position: vector(200, 200),
        },
      },
      timeNow: 0,
    })

    const mouseInteraction3 = getComponent<MouseInteraction>(
      componentName.mouseInteraction,
      {
        state: v9,
        entityId,
      },
    )

    expect(mouseInteraction3?.isMouseOver).toBeTruthy()
    expect(mouseInteraction3?.isMouseEnter).toBeFalsy()
    expect(mouseInteraction3?.isMouseLeave).toBeFalsy()

    // Mouse is not over element again
    const v10 = runOneFrame({
      state: {
        ...v9,
        mouse: {
          ...v9.mouse,
          position: vector(300, 300),
        },
      },
      timeNow: 0,
    })

    const mouseInteraction4 = getComponent<MouseInteraction>(
      componentName.mouseInteraction,
      {
        state: v10,
        entityId,
      },
    )

    expect(mouseInteraction4?.isMouseOver).toBeFalsy()
    expect(mouseInteraction4?.isMouseEnter).toBeFalsy()
    expect(mouseInteraction4?.isMouseLeave).toBeTruthy()
  })
})
