import { Text } from '../type'
import { createSystem, systemPriority } from './createSystem'
import { State } from '../type'
import { componentName } from '../component'
import { getEntity } from '..'

export const textSystem = (state: State) =>
  createSystem<Text>({
    state,
    name: componentName.text,
    priority: systemPriority.text,
    create: ({ state }) => {
      if (state.isDrawEnabled) {
        // createText(component)
      }

      return state
    },
    remove: ({ state }) => {
      if (state.isDrawEnabled) {
        // removeText(component.entityId)
      }

      return state
    },
    tick: ({ state, component }) => {
      if (state.isDrawEnabled) {
        const entity = getEntity({
          state,
          entityId: component.entityId,
        })

        if (entity) {
          // drawText(entity, component)
        }
      }

      return state
    },
  })
