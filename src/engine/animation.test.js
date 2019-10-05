import { createGameObject } from './gameObject'
import { createApp } from './createApp'
import { linear } from './animation'

describe('animation', () => {
  describe('transitions', () => {
    describe('linear', () => {
      it('should return correct value', () => {
        expect(linear(0, 100, 50)).toBe(50)
        expect(linear(10, 100, 50)).toBe(55)
        expect(linear(100, 100, 50)).toBe(100)
        expect(linear(-100, 100, 50)).toBe(0)
        expect(linear(1, 2, 1)).toBe(1.01)
        expect(linear(10, 30, 33)).toBe(16.6)
        expect(linear(10, -10, 10)).toBe(8)
      })
    })
  })

  it('should not play animation if segment is not set', () => {
    const onEnd = jest.fn()

    let app = createApp()
    const go = app.addGameObject(
      createGameObject({
        id: 'test',
        state: {
          positionX: 0,
        },
        animations: {
          move: {
            segments: [
              {
                duration: 10,
                property: 'positionX',
                from: 0,
                to: 20,
                onEnd,
              },
            ],
          },
        },
      }),
    )

    performance.now = () => 0
    app = app.tick()
    expect(go.animations.move.timer).toBe(0) // animation is stoped
    expect(go.getState().positionX).toBe(0)
    expect(go.animations.move.isPlaying).toBe(false)

    go.animations.move.play()

    performance.now = () => 5
    app = app.tick()
    expect(go.animations.move.timer).toBe(0) // animation doesn't have segments
    expect(go.getState().positionX).toBe(0)
    expect(onEnd).not.toHaveBeenCalled()
    expect(go.animations.move.isPlaying).toBe(true)

    // First tick after 10ms should change position and timer
    performance.now = () => 10
    app = app.tick()
    expect(go.getState().positionX).toBe(10)
    expect(go.animations.move.timer).toBe(5)
    expect(onEnd).not.toHaveBeenCalled()
    expect(go.animations.move.isPlaying).toBe(true)

    // Next tick should finish animation
    performance.now = () => 20
    app = app.tick()
    expect(go.getState().positionX).toBe(20)
    expect(go.animations.move.timer).toBe(15)
    expect(onEnd).toHaveBeenCalled()
    expect(go.animations.move.isPlaying).toBe(false)

    // Next tick should not change finished animation
    performance.now = () => 200
    app = app.tick()
    expect(go.getState().positionX).toBe(20)
    expect(go.animations.move.timer).toBe(15)
    expect(go.animations.move.isPlaying).toBe(false)
  })
})
