import {
  add,
  normalize,
  scale,
  sub,
  vectorZero,
  distance,
} from '../utils/vector'
import { createGameObject } from '../engine/gameObject'
import human from '../assets/human.png'
import { subscribe } from '../eventBus'

export const SET_GOAL_POSITION = 'unit.SET_GOAL_POSITION'

export const player = ({ id } = {}) =>
  createGameObject({
    id,
    state: {
      resources: {
        // rocks and minerals
        stone: 0,
        sandstone: 0,
        coal: 0,
        adamantine: 0,
        aluminum: 0,
        azurite: 0,
        gypsum: 0,
        malachite: 0,
        limestone: 0,
        aluminum: 0,
        copper: 0,
        goldOre: 0,
        platinum: 0,
        silverOre: 0,
        ironOre: 0,
        lead: 0,
        zinc: 0,
        clay: 0,

        // wood
        walnut: 0,
        teak: 0,
        poplar: 0,
        oak: 0,
        maple: 0,
        mahogany: 0,
        cherry: 0,
        birch: 0,
        ash: 0,
        redwood: 0,
        pine: 0,
        fir: 0,
        cedar: 0,
        bamboo: 0,

        // food
        fish: 0,
        meat: 0,
        cake: 0,
        egg: 0,
        milk: 0,
        cocoa: 0,
        apple: 0,

        wheat: 0,
        flour: 0,
        bread: 0,

        // animals
        chicken: 0,
        horse: 0,
        dog: 0,
        cat: 0,
        pig: 0,
        cow: 0,
        mule: 0,

        // other
        leafts: 0,
        glass: 0,
        leather: 0,
        cloth: 0,
        bone: 0,
        gem: 0,
      },
    },
    image: {
      url: human,
    },
    tick: (gameObject, app) => {
      // const goalPosition = gameObject.goalPosition
      // if (goaameObjects.time.delta / 10,
      //       normalize(sub(gameObject.rigidbody.position, goalPosition)),
      //     )
      //     gameObject.rigidbody.setPosition(
      //       sub(gameObject.rigidbody.position, shift),
      //     )
      //   }
      // }
    },
    afterCreate: (go, app) => {
      subscribe('moveUnits', ({ units, area }) => {
        const targetPosition = app().gameObjects[area].rigidbody.position
        units.forEach(unitId => {
          app().gameObjects[unitId].goTo(targetPosition)
        })
      })
    },
    actions: {
      goTo: (dispatch, state) => payload => {
        dispatch({
          type: SET_GOAL_POSITION,
          payload: payload,
        })
      },
      goTo: (dispatch, state) => payload => {
        dispatch({
          type: SET_GOAL_POSITION,
          payload: payload,
        })
      },
    },

    reducer: (state, action) => {
      switch (action.type) {
        case SET_GOAL_POSITION:
          return {
            ...state,
            goalPosition: action.payload,
          }
        default:
          return state
      }
    },
  })
