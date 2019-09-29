import { unit } from './unit'
import { area } from './area'
import cityImg from '../assets/city.png'
import { emit } from '../eventBus'

export const city = ({ position }) =>
  area({
    state: {
      createUnitTick: 0,
      createUnitTime: 1000,
    },
    image: {
      url: cityImg,
    },
    rigidbody: {
      position,
    },
    tick: (go, app) => {
      go.createUnit(go, app)
    },
    createUnit(go, app) {
      const now = app.gameObjects.time.now

      // if (go.rigidbody.isClicked) {
      //   emit('displayCityData', go)
      // }
      if (go.units && go.units.length < 5) {
        if (go.createUnitTick + go.createUnitTime < now) {
          const newUnit = app.addGameObject(
            unit({ position: go.rigidbody.position }),
          )

          newUnit.goTo({
            x: go.rigidbody.position.x + (Math.random() * 50 - 25),
            y: go.rigidbody.position.y + (Math.random() * 50 - 25),
          })

          go.assignUnitsToArea([newUnit.id])
          go.resetUnitTick(now)
        }
      }
    },
    actions: {
      resetUnitTick: dispatch => payload => {
        dispatch({
          type: 'resetUnitTick',
          payload,
        })
      },
      resetUnitTick: dispatch => payload => {
        dispatch({
          type: 'resetUnitTick',
          payload,
        })
      },
      assignUnitsToArea: dispatch => payload => {
        dispatch({
          type: 'assignUnitsToArea',
          payload,
        })
      },
    },
    reducer: (state, action) => {
      switch (action.type) {
        case 'resetUnitTick':
          return {
            ...state,
            createUnitTick: action.payload,
          }

        case 'assignUnitsToArea':
          return {
            ...state,
            units: state.units.concat(action.payload),
          }

        default:
          return state
      }
    },
  })
