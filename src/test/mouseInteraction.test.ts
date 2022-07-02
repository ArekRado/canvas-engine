/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { vector } from '@arekrado/vector-2d'
import { getInitialState, getSystems } from '../util/state'
import { createEntity } from '../entity/createEntity'
import { generateEntity } from '../entity/generateEntity'
import { runOneFrame } from '../util/runOneFrame'
import {
  defaultCollider,
  defaultMouseInteraction,
  defaultTransform,
} from '../util/defaultComponents'
import {
  Collider,
  InternalInitialState,
  Mouse,
  MouseInteraction,
} from '../type'
import { createComponent } from '../component/createComponent'
import { getComponent } from '../component/getComponent'
import { componentName } from '../component/componentName'
import { isMouseOver } from '../system/mouseInteraction/mouseInteraction'
import { Transform } from '../index'
import { getMouse } from '../system/mouse/mouseCrud'

describe('mouseInteraction', () => {
  let mousemoveCallback: Function
  let mouseenterCallback: Function
  let mouseleaveCallback: Function
  let mouseupCallback: Function
  let mousedownCallback: Function
  // let wheelCallback: Function

  const getInitialStateWithMouse = () =>
    getSystems({
      state: getInitialState(),
      containerId: 'containerId',
      document: {
        getElementById: (() => ({
          getBoundingClientRect: (() => ({
            left: 0,
            top: 0,
          })) as Element['getBoundingClientRect'],
          addEventListener: ((
            type: keyof HTMLElementEventMap,
            callback: Function,
          ) => {
            switch (type) {
              case 'mousemove':
                mousemoveCallback = callback
                break
              case 'mouseenter':
                mouseenterCallback = callback
                break
              case 'mouseleave':
                mouseleaveCallback = callback
                break
              case 'mouseup':
                mouseupCallback = callback
                break
              case 'mousedown':
                mousedownCallback = callback
                break
            }
          }) as Document['addEventListener'],
        })) as unknown as Document['getElementById'],
        addEventListener: (() => {}) as Document['addEventListener'],
      } as Document,
    })

  beforeEach(() => {
    mousemoveCallback = () => {}
    mouseenterCallback = () => {}
    mouseleaveCallback = () => {}
    mouseupCallback = () => {}
    mousedownCallback = () => {}
  })

  it('isMouseOver', () => {
    const state = getInitialStateWithMouse()

    const entity = generateEntity()
    const mouse = getMouse({
      entity,
      state,
    })

    if (!mouse) return

    // Mouse is not over collide
    expect(
      isMouseOver({
        mouse: {
          ...mouse,
          position: vector(-10, -10),
        },
        collider: defaultCollider(),
        transform: defaultTransform(),
      }),
    ).toBeFalsy()

    // Mouse is over rectangle
    expect(
      isMouseOver({
        mouse: {
          ...mouse,
          position: vector(5, 5),
        },
        collider: defaultCollider({
          data: [
            {
              position: [0, 0],
              type: 'rectangle',
              size: vector(10, 10),
            },
          ],
        }),
        transform: defaultTransform(),
      }),
    ).toBeTruthy()

    // Mouse is over circle
    expect(
      isMouseOver({
        mouse: {
          ...mouse,
          buttons: 1,
          position: vector(5, 5),
        },
        collider: defaultCollider({
          data: [
            {
              position: [0, 0],
              type: 'circle',
              radius: 10,
            },
          ],
        }),
        transform: defaultTransform(),
      }),
    ).toBeTruthy()
  })

  it('should set proper mouse interaction values', () => {
    let state = getInitialStateWithMouse()

    const entity = generateEntity()

    state = createEntity({
      entity,
      state,
    })

    state = createEntity({ entity, state })

    state = createComponent<MouseInteraction, InternalInitialState>({
      state,
      entity,
      name: componentName.mouseInteraction,
      data: defaultMouseInteraction(),
    })

    state = createComponent<Transform, InternalInitialState>({
      state,
      entity,
      name: componentName.transform,
      data: defaultTransform({}),
    })

    state = createComponent<Collider, InternalInitialState>({
      state,
      entity,
      name: componentName.collider,
      data: defaultCollider({
        data: [
          {
            position: vector(200, 200),
            type: 'circle',
            radius: 10,
          },
          {
            position: vector(100, 100),
            type: 'rectangle',
            size: vector(10, 10),
          },
        ],
      }),
    })

    // Mouse is not over element
    mousemoveCallback({ pageX: 0, pageY: 0 })
    state = runOneFrame({ state })

    const mouseInteraction1 = getComponent<MouseInteraction>({
      name: componentName.mouseInteraction,
      state,
      entity,
    })

    expect(mouseInteraction1?.isMouseOver).toBeFalsy()
    expect(mouseInteraction1?.isMouseEnter).toBeFalsy()
    expect(mouseInteraction1?.isMouseLeave).toBeFalsy()

    // Mouse is over rectangle
    mousemoveCallback({ pageX: 105, pageY: 105 })
    state = runOneFrame({ state })

    const mouseInteraction2 = getComponent<MouseInteraction>({
      name: componentName.mouseInteraction,
      state,
      entity,
    })

    expect(mouseInteraction2?.isMouseOver).toBeTruthy()
    expect(mouseInteraction2?.isMouseEnter).toBeTruthy()
    expect(mouseInteraction2?.isMouseLeave).toBeFalsy()

    // Mouse is over circle
    mousemoveCallback({ pageX: 200, pageY: 200 })
    state = runOneFrame({ state })

    const mouseInteraction3 = getComponent<MouseInteraction>({
      name: componentName.mouseInteraction,
      state,
      entity,
    })

    expect(mouseInteraction3?.isMouseOver).toBeTruthy()
    expect(mouseInteraction3?.isMouseEnter).toBeFalsy()
    expect(mouseInteraction3?.isMouseLeave).toBeFalsy()

    // Mouse is not over element again
    mousemoveCallback({ pageX: 300, pageY: 300 })
    state = runOneFrame({ state })

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
