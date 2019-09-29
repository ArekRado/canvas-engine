import { createGameObject } from '../engine/gameObject'
import { emit } from '../eventBus'

let last2ClickedAreas = []

export const area = params => {
  return createGameObject({
    ...params,
    state: {
      player: params.player,
      resources: [],
      size: 100,
      tags: ['area'].concat(params.tags),
      units: [],
      ...params.state,
    },
    rigidbody: {
      mouseActionsEnabled: true,
      onClick: (go, app) => {
        last2ClickedAreas.unshift(go.id)
        last2ClickedAreas = last2ClickedAreas.slice(0, 2)
        const firstArea = app.gameObjects[last2ClickedAreas[0]]
        const secondArea = app.gameObjects[last2ClickedAreas[1]]

        if (firstArea && secondArea) {
          if (firstArea.id !== secondArea.id) {
            if (
              firstArea.rigidbody.isSelected ||
              secondArea.rigidbody.isSelected
            ) {
              emit('displayTwoAreaData', {
                firstArea,
                secondArea,
              })
            }
          } else {
            last2ClickedAreas = []
            emit('displayAreaData', go)
          }
        }

        if (last2ClickedAreas.length !== 2) {
          emit('displayAreaData', go)
        }

        // emit('selectArea', go.id)
      },
      ...params.rigidbody,
    },
    // tick(go, app) {
    // params.tick(go, app)
    // },
    // reducer: (state, action) => {
    //   switch (action.type) {
    //     case 'select':
    //       return {
    //         createUnitTick: action.payload.now,
    //       }

    //     default:
    //       return state
    //   }
    // },
  })
}
