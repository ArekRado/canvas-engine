import 'jest-canvas-mock'
import 'jest-webgl-canvas-mock'
import 'regenerator-runtime/runtime'

import { initialState } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { initializeEngine } from '../util/initializeEngine'
import { generateEntity, setEntity } from '../util/entity'
import { componentName, setComponent } from '../component'
import { collideBox, sprite } from '../util/defaultComponents'
import { vector } from '@arekrado/vector-2d'
import { CollideBox, Sprite } from '../type'

describe('pixiDraw', () => {
  beforeEach(() => {
    document.body.innerHTML = ''

    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }))
  })

  it('initializeEngine should mount canvas with pixi and create div with default id', async () => {
    await initializeEngine()

    expect(document.body.innerHTML).toMatchSnapshot()
  })

  it('initializeEngine should mount canvas with pixi and create div with id passed as param', async () => {
    await initializeEngine({ containerId: 'containerId' })

    expect(document.body.innerHTML).toMatchSnapshot()
  })

  it('initializeEngine should not create new container when it already exists', async () => {
    document.body.innerHTML = '<div id="containerId"/>'

    await initializeEngine({ containerId: 'containerId' })

    expect(document.body.innerHTML).toMatchSnapshot()
  })

  it('initializeEngine should mount canvas with pixi and create div with proper id', async () => {
    await initializeEngine()

    const entity1 = generateEntity('e1', {
      position: vector(50, 50),
    })
    const entity2 = generateEntity('e2', {
      position: vector(50, 50),
    })

    const v1 = setEntity({
      entity: entity1,
      state: initialState,
    })

    const v2 = setEntity({
      entity: entity1,
      state: v1,
    })

    const v3 = setComponent<CollideBox>(componentName.collideBox, {
      state: v2,
      data: collideBox({
        entityId: entity1.id,
        size: vector(1.5, 1.5),
        position: vector(1, 1),
      }),
    })

    const v4 = setComponent<Sprite>(componentName.sprite, {
      state: v3,
      data: sprite({
        entityId: entity2.id,
        src: './asset/testImage.png',
      }),
    })

    runOneFrame({ state: v4, timeNow: 0 })

    const canvas = document.querySelector('canvas')

    if (canvas) {
      // TODO: why it's empty?
      expect(canvas.toDataURL('image/jpeg', 1.0)).toBe(
        'data:image/jpeg;base64,00',
      )
    }
  })

  it('should not throw error when sprite src has been changed', async () => {
    await initializeEngine()

    const entity = generateEntity('')

    let state = setEntity({
      entity,
      state: initialState,
    })

    state = setEntity({
      entity,
      state,
    })

    state = setComponent<Sprite>(componentName.sprite, {
      state,
      data: sprite({
        entityId: entity.id,
        src: 'data:image/png;base64,01',
      }),
    })

    runOneFrame({ state, timeNow: 0 })

    state = setComponent<Sprite>(componentName.sprite, {
      state,
      data: sprite({
        entityId: entity.id,
        src: 'data:image/png;base64,02',
      }),
    })

    runOneFrame({ state, timeNow: 0 })

    expect(true).toBeTruthy()
  })
})
