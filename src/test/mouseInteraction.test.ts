import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { initialStateWithDisabledDraw } from '../util/state'
import { set as setEntity, generate } from '../util/entity'
import { runOneFrame } from '../util/runOneFrame'
import {
  defaultCollideBox,
  defaultCollideCircle,
  defaultMouseInteraction,
  defaultTransform,
} from '../util/defaultComponents'
import { getComponent, setComponent } from '../component'
import { Entity, MouseInteraction, State, Transform } from '../type'
import { componentName } from '../component'
import { isClicked, isMouseOver } from '../system/mouseInteraction'

const getBase = (entity: Entity): State => {
  const v1 = setEntity({
    entity,
    state: initialStateWithDisabledDraw,
  })
  const v2 = setEntity({ entity, state: v1 })

  const v3 = setComponent(componentName.mouseInteraction, {
    state: v2,
    data: defaultMouseInteraction({
      entity,
    }),
  })

  const v4 = setComponent(componentName.transform, {
    state: v3,
    data: defaultTransform({
      entity,
    }),
  })

  return v4
}

describe('mouseInteraction', () => {
  it('isMouseOver', () => {
    const entity = generate('entity')
    const mouse = initialStateWithDisabledDraw.mouse

    // Mouse is not over collide
    expect(
      isMouseOver({
        mouse: {
          ...mouse,
          position: vector(-10, -10),
        },
        collideBox: defaultCollideBox({ entity }),
        transform: defaultTransform({ entity }),
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
        transform: defaultTransform({ entity }),
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
        transform: defaultTransform({ entity }),
      }),
    ).toBeTruthy()
  })

  it('isClicked', () => {
    const mouse = initialStateWithDisabledDraw.mouse

    // Mouse is not clicked but is over
    expect(
      isClicked({
        mouse,
        isMouseOver: true,
      }),
    ).toBeFalsy()

    // Mouse is clicked but not over collide
    expect(
      isClicked({
        mouse: {
          ...mouse,
          buttons: 1,
        },
        isMouseOver: false,
      }),
    ).toBeFalsy()

    // Mouse is clicked and over collideBox
    expect(
      isClicked({
        mouse: {
          ...mouse,
          buttons: 1,
        },
        isMouseOver: true,
      }),
    ).toBeTruthy()
  })
  
  it('isClickedDown', () => {
    const mouse = initialStateWithDisabledDraw.mouse

    // Mouse is not clicked but is over
    expect(
      isClicked({
        mouse,
        isMouseOver: true,
      }),
    ).toBeFalsy()

    // Mouse is clicked but not over collide
    expect(
      isClicked({
        mouse: {
          ...mouse,
          buttons: 1,
        },
        isMouseOver: false,
      }),
    ).toBeFalsy()

    // Mouse is clicked and over collideBox
    expect(
      isClicked({
        mouse: {
          ...mouse,
          buttons: 1,
        },
        isMouseOver: true,
      }),
    ).toBeTruthy()
  })

  // describe('isDoubleClicked', () => {})
  // describe('isClickedDown', () => {})
  // describe('isClickedUp', () => {})
  // describe('isMouseEnter', () => {})
  // describe('isMouseLeave', () => {})
  // describe('isMouseMove', () => {})
  // it('should set proper position using fromParentPosition and parent.position - simple example', () => {
  //   const entity = generate('e')

  //   const v1 = getBase(entity)

  //   const state = runOneFrame({ state: v1, timeNow: 0 })

  //   const component = getComponent<MouseInteraction>(
  //     componentName.mouseInteraction,
  //     {
  //       state,
  //       entity,
  //     },
  //   )

  //   expect(component?.position).toEqual(vector(1, 1))
  //   expect(component?.fromParentPosition).toEqual(vector(0, 0))

  //   expect(component?.position).toEqual(vector(3, 3))
  //   expect(component?.fromParentPosition).toEqual(vector(2, 2))
  // })
})
