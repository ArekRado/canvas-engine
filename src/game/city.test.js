import { city } from './city'

describe('game/city', () => {
  it('should return object', () => {
    expect(typeof city()()).toBe('object')
  })

  // it('Every tick should incerase createUnitTick counter', () => {
  //   const newCity = {}

  //   const app: any = {
  //     gameObjects: {
  //       time: {
  //         store: {
  //           state: () => ({
  //             now: 0,
  //           }),
  //         },
  //       },
  //     },
  //   }

  //   const go = tick(newCity, app)

  //   expect(go).toBe(1100)
  // })

  // it('After the tick should create new unit', () => {})
})
