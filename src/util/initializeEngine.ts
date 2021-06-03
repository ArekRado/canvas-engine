import { getRegl } from '../draw/getRegl'
import { initialize as initializeIO } from '../system/io'
import { State } from '../type'
// import { setCamera } from './camera'

// const getGameContainerDimensions = (containerId: string) => {
//   const element = document.querySelector(`#${containerId}`)

//   const { width, height } = element
//     ? element.getBoundingClientRect()
//     : { width: 0, height: 0 }

//   return [width, height]
// }

// if (!document || !document.body) {
//   console.warn("Couldn't find document body")
// } else {
//   const element = document.querySelector(`#${containerId}`)
//   if (!element) {
//     console.warn(`Container with id ${containerId} doesn't exists`)
//   } else {
//     element.appendChild(pixiApp.view)
//   }
// }

export const initializeEngine = (params: {
  containerId?: string
  state: State
}) => {
  const containerId = params?.containerId || 'canvas-engine'

  const maybeContainer = document.getElementById(containerId)

  if (maybeContainer === null) {
    const body = document.body

    if (body) {
      const gameContainer = document.createElement('div')
      gameContainer.setAttribute('id', containerId)
      body.appendChild(gameContainer)

      params.state = getRegl({
        container: gameContainer,
        state: params.state,
      })
    } else {
      console.error("document.body doesn't exist")
    }
  } else {
    params.state = getRegl({
      container: maybeContainer,
      state: params.state,
    })
  }

  initializeIO()
  // await initiaglizePixi(containerId)

  return [...params.state.system]
    // .sort((a, b) => (a > b ? -1 : 1))
    .reduce((acc, system) => system.initialize({ state: acc }), params.state)
}
