import { initialize as initializePixi } from '../util/pixiDraw'
import { initialize as initializeIO } from '../system/io'

export const initializeEngine = async (params?: { containerId?: string }) => {
  const containerId = params?.containerId || 'canvas-engine'

  const isContainerAlreadyExist = document.getElementById(containerId) !== null
  const body = document.body

  if (body && isContainerAlreadyExist === false) {
    const gameContainer = document.createElement('div')
    gameContainer.setAttribute('id', containerId)
    body.appendChild(gameContainer)
  }

  initializeIO()
  await initializePixi(containerId)
}
