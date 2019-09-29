import { createAnimation } from './animation'
import { tick } from './testLibrary'
import { createGameObject } from './gameObject'
import { createApp } from './createApp'

describe('animation', () => {
  const fakeTime = ({ delta = 0 } = {}) => ({
    delta,
  })

  const fakeApp = (time = fakeTime()) => ({
    gameObjects: {
      time,
    },
  })

  const fakeGo = animation => ({ animation, setProperty: () => {} })

  // const doAnimationTick = (animation, fakeApp) => {
  //   animation.tick(fakeGo(animation), fakeApp)
  //   animation = Object.assign(
  //     animation,
  //     animation.store.tick(fakeGo(animation), fakeApp),
  //   )
  // }

  // it('should not play animation on start', () => {
  //   const animation = createAnimation()
  //   doAnimationTick(animation, fakeApp())
  //   expect(animation.timer).toBe(0)
  // })

  it('should not play animation if segment is not set', () => {
    let app = createApp()
    const go = app.addGameObject(
      createGameObject({
        id: 'test',
        state: {
          positionX: 0,
        },
        animations: [
          createAnimation(
            [
              {
                duration: 2,
                property: 'positionX',
                from: 0,
                to: 20,
              },
            ],
            true,
          ),
        ],
      }),
    )

    app = app.tick()
    app = app.tick()

    // animation = animation.tick(fakeGo(animation), fakeApp())
    expect(go.state.positionX).toBe(0) // animation is stoped and doesnt have segments

    // animation.play()
    // animation = animation.tick(
    //   fakeGo(animation),
    //   fakeApp(fakeTime({ delta: 5 })),
    // )
    // expect(animation.timer).toBe(0) // animation doesnt have segments

    // animation.play()
    // animation.setSegments([
    //   {
    //     from: 0,
    //     to: 100,
    //     duration: 100,
    //   },
    // ])
    // animation = animation.tick(
    //   fakeGo(animation),
    //   fakeApp(fakeTime({ delta: 5 })),
    // )
    // animation = animation.tick(
    //   fakeGo(animation),
    //   fakeApp(fakeTime({ delta: 5 })),
    // )
    // expect(animation.timer).toBe(5)
  })

  // it('timer should change when time delta is changed', () => {
  //   const animation = createAnimation()
  //   animation.play()
  //   doAnimationTick(animation, fakeApp(fakeTime({ delta: 5 })))
  //   doAnimationTick(animation, fakeApp(fakeTime({ delta: 5 })))
  //   // doAnimationTick(animation, fakeApp())
  //   expect(animation.timer).toBe(0)
  // })
})
