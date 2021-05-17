import { createGlobalSystem, systemPriority } from './createSystem'
import { State } from '../type'
import { getEntity } from '../entity'
import { DrawLine, createDrawLine } from '../draw/drawLine'
import { DrawRectangle, createDrawRectangle } from '../draw/drawRectangle'
import { DrawEllipse, createDrawEllipse } from '../draw/drawEllipse'

const doNothing = () => {}
let drawLine: DrawLine | (() => void) = doNothing
let drawRectangle: DrawRectangle | (() => void) = doNothing
let drawEllipse: DrawEllipse | (() => void) = doNothing

export const primitiveSystem = (state: State) =>
  createGlobalSystem({
    state,
    name: 'primitive',
    priority: systemPriority.primitive,
    create: ({ state }) => {
      if (state.isDrawEnabled && state.regl) {
        drawLine = createDrawLine(state.regl)
        drawRectangle = createDrawRectangle(state.regl)
        drawEllipse = createDrawEllipse(state.regl)
      }

      return state
    },
    tick: ({ state }) => {
      if (state.isDrawEnabled) {
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
      }

      return state
    },
  })
