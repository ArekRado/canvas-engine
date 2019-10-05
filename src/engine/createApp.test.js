import { createApp } from './createApp'
// import { addGameObject } from './gameObject'

describe('createApp', () => {
  it('should return object', () => {
    expect(typeof createApp({ withDraw: false })).toBe('object')
  })

  it('each tick should return new app', () => {
    const app = createApp({ withDraw: false })

    const newApp = app.tick(app)
    expect(typeof newApp).toBe('object')
  })

  it('app should contain time, mouse and keyboard on the start', () => {
    const app = createApp({ withDraw: false })

    expect(app.gameObjects.time).toBeDefined()
    expect(app.gameObjects.mouse).toBeDefined()
    expect(app.gameObjects.keyboard).toBeDefined()
  })

  it('each gameObject should call his own tick during app tick', () => {
    const app = createApp({ withDraw: false })
    const tickSpy = jest.fn(() => {})

    app.addGameObject(app => ({ tick: tickSpy }))

    app.tick(app)

    expect(tickSpy).toHaveBeenCalled()
  })

  describe('global actions', () => {
    it('addGameObject should increase amount of gameobject', () => {
      const app = createApp({ withDraw: false })
      app.addGameObject(() => ({ tick: () => {} }))

      const newApp = app.tick(app)

      expect(Object.keys(newApp.gameObjects)).toHaveLength(4)
    })
  })
})
