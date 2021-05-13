import { createGlobalSystem, systemPriority } from './createSystem'
import { State } from '../type'
import { getEntity } from '../entity'
import { drawLine } from '../draw/drawLine'
import { drawRectangle } from '../draw/drawRectangle'
import { drawEllipse } from '../draw/drawEllipse'

export const primitiveSystem = (state: State) =>
  createGlobalSystem({
    state,
    name: 'primitive',
    priority: systemPriority.primitive,

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

        // Object.values(state.component.collideBox).forEach((collideBox) => {
        //   const entity = getEntity({ entityId: collideBox.entityId, state })
        //   entity && renderCollideBox(entity, collideBox)
        // })
        // Object.values(state.component.collideCircle).forEach(
        //   (collideCircle) => {
        //     const entity = getEntity({
        //       entityId: collideCircle.entityId,
        //       state,
        //     })
        //     entity && renderCollideCircle(entity, collideCircle)
        //   },
        // )
      }

      return state
    },
  })
