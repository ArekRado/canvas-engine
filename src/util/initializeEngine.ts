import { initialize as initializeIO } from '../system/io'

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

export const initializeEngine = (params?: { containerId?: string }) => {
  const containerId = params?.containerId || 'canvas-engine'

  const isContainerAlreadyExist = document.getElementById(containerId) !== null
  const body = document.body

  if (body && isContainerAlreadyExist === false) {
    const gameContainer = document.createElement('div')
    gameContainer.setAttribute('id', containerId)
    body.appendChild(gameContainer)
  }

  initializeIO()
  // await initiaglizePixi(containerId)
}
