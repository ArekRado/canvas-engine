import { initialize as initializeDraw } from '../system/draw'
import { initialize as initializeIO } from '../system/io'

export const initialize = (params?: { containerId?: string }) => {
  const containerId = params?.containerId || 'canvas-engine'

  const body = document.body

  if (body) {
    const gameContainer = document.createElement('div')
    gameContainer.setAttribute('id', containerId)
    body.appendChild(gameContainer)
  }

  initializeIO()
  initializeDraw(containerId)
}
