import { createGlobalSystem, systemPriority } from './createSystem'
import { State } from '../type'
import { getEntity } from '../entity'
import { DrawLine, createDrawLine } from '../draw/drawLine'
import { DrawRectangle, createDrawRectangle } from '../draw/drawRectangle'
import { DrawEllipse, createDrawEllipse } from '../draw/drawEllipse'
import { createDrawSprite, DrawSprite } from '../draw/drawSprite'
import { createCamera, DrawCamera } from '../draw/camera'

const doNothing = () => {}
let drawLine: DrawLine | (() => void) = doNothing
let drawRectangle: DrawRectangle | (() => void) = doNothing
let drawEllipse: DrawEllipse | (() => void) = doNothing
let drawSprite: DrawSprite | (() => void) = doNothing
let camera: DrawCamera | (() => void) = doNothing

export const drawSystem = (state: State) =>
  createGlobalSystem({
    state,
    name: 'draw',
    priority: systemPriority.draw,
    initialize: ({ state }) => {
      if (state.isDrawEnabled && state.regl) {
        drawSprite = createDrawSprite(state.regl)
        drawLine = createDrawLine(state.regl)
        drawRectangle = createDrawRectangle(state.regl)
        drawEllipse = createDrawEllipse(state.regl)
        camera = createCamera(state.regl)
      }

      return state
    },
    tick: ({ state }) => {
      if (state.regl && state.isDrawEnabled) {
        state.regl.poll();
        
        state.regl?.clear({
          color: [0, 0, 0, 1],
        })
        camera(state, () => {
          Object.values(state.component.line).forEach((line) => {
            const entity = getEntity({ state, entityId: line.entityId })
            entity &&
              drawLine({
                entity,
                line,
              })
          })

          Object.values(state.component.rectangle).forEach((rectangle) => {
            const entity = getEntity({ state, entityId: rectangle.entityId })
            entity &&
              drawRectangle({
                entity,
                rectangle,
              })
          })

          Object.values(state.component.ellipse).forEach((ellipse) => {
            const entity = getEntity({ state, entityId: ellipse.entityId })
            entity &&
              drawEllipse({
                entity,
                ellipse,
              })
          })

          Object.values(state.component.sprite).forEach((sprite) => {
            const entity = getEntity({ state, entityId: sprite.entityId })
            if (entity && sprite.texture) {
              drawSprite({ entity, sprite })
            }
          })
        })
      }

      return state
    },
  })
