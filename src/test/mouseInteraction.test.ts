import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { getInitialState } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import {
  collideBox as defaultCollideBox,
  collideCircle as defaultCollideCircle,
  mouseInteraction as defaultMouseInteraction,
  transform,
} from '../util/defaultComponents'
import { getComponent, setComponent } from '../component'
import { CollideBox, CollideCircle, MouseInteraction } from '../type'
import { componentName } from '../component'
import { isMouseOver } from '../system/mouseInteraction'
import { getMouse, setMouse } from '../system/mouse'
import { Transform } from '..'

describe('mouseInteraction', () => {
  it('isMouseOver', () => {
    const entity = createEntity({ name: '' })
    const mouse = getMouse({
      state: getInitialState({}),
    })

    if (!mouse) return

    // Mouse is not over collide
    expect(
      isMouseOver({
        mouse: {
          ...mouse,
          position: vector(-10, -10),
        },
        collideBox: defaultCollideBox({ entity }),
        transform: transform({ entity }),
      }),
    ).toBeFalsy()

    // Mouse is over collideBox
    expect(
      isMouseOver({
        mouse: {
          ...mouse,
          position: vector(5, 5),
        },
        collideBox: defaultCollideBox({ entity, size: vector(10, 10) }),
        transform: transform({ entity }),
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
        collideCircle: defaultCollideCircle({ entity, radius: 10 }),
        transform: transform({ entity }),
      }),
    ).toBeTruthy()
  })

  it('should set proper mouse interaction values', () => {
    const entity = createEntity({ name: 'entity' })

    let state = setEntity({
      entity,
      state: getInitialState({}),
    })
    state = setEntity({ entity, state })

    state = setComponent<MouseInteraction>({
      state,
      data: defaultMouseInteraction({ entity }),
    })

    state = setComponent<Transform>({
      state,
      data: transform({
        entity,
      }),
    })

    state = setComponent<CollideBox>({
      state,
      data: defaultCollideBox({
        entity,
        position: vector(200, 200),
        size: vector(10, 10),
      }),
    })

    state = setComponent<CollideCircle>({
      state,
      data: defaultCollideCircle({
        entity,
        position: vector(100, 100),
        radius: 10,
      }),
    })

    // Mouse is not over element
    state = setMouse({
      state,
      data: {
        position: vector(0, 0),
      },
    })
    state = runOneFrame({ state })

    const mouseInteraction1 = getComponent<MouseInteraction>({
      name: componentName.mouseInteraction,
      state,
      entity,
    })

    expect(mouseInteraction1?.isMouseOver).toBeFalsy()
    expect(mouseInteraction1?.isMouseEnter).toBeFalsy()
    expect(mouseInteraction1?.isMouseLeave).toBeFalsy()

    // Mouse is over collideBox
    state = setMouse({
      state,
      data: {
        position: vector(100, 100),
      },
    })
    state = runOneFrame({ state })

    const mouseInteraction2 = getComponent<MouseInteraction>({
      name: componentName.mouseInteraction,
      state,
      entity,
    })

    expect(mouseInteraction2?.isMouseOver).toBeTruthy()
    expect(mouseInteraction2?.isMouseEnter).toBeTruthy()
    expect(mouseInteraction2?.isMouseLeave).toBeFalsy()

    // Mouse is over collideCircle
    state = setMouse({
      state,
      data: {
        position: vector(200, 200),
      },
    })

    const mouseInteraction3 = getComponent<MouseInteraction>({
      name: componentName.mouseInteraction,
      state,
      entity,
    })

    expect(mouseInteraction3?.isMouseOver).toBeTruthy()
    expect(mouseInteraction3?.isMouseEnter).toBeFalsy()
    expect(mouseInteraction3?.isMouseLeave).toBeFalsy()

    // Mouse is not over element again
    state = setMouse({
      state,
      data: {
        position: vector(300, 300),
      },
    })

    const mouseInteraction4 = getComponent<MouseInteraction>({
      name: componentName.mouseInteraction,
      state,
      entity,
    })

    expect(mouseInteraction4?.isMouseOver).toBeFalsy()
    expect(mouseInteraction4?.isMouseEnter).toBeFalsy()
    expect(mouseInteraction4?.isMouseLeave).toBeTruthy()
  })
})
