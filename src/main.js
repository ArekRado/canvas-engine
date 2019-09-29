import { createApp } from './engine/createApp'
import { city } from './game/city'
import { player } from './game/player'
// import { create as createCity } from 'gameObjects/city/actions'
import { vector } from './utils/vector'

const logic = app => {
  const nextApp = app.tick()

  // setTimeout(() => requestAnimationFrame(() => logic(nextApp)), 1000)
  requestAnimationFrame(() => logic(nextApp))
}

const init = () => {
  import('./ui/ui').then(() => {})

  const app = createApp({ withDraw: true })

  // app.createGameObject(city({ position: vector(100, 100) }))
  app.addGameObject(player({ id: 'player' }))

  app.addGameObject(city({ position: vector(500, 400) }))
  app.addGameObject(city({ position: vector(100, 200) }))

  // newState = unit({ position: vector(110, 147) }, newState)

  logic(app)
}

init()
