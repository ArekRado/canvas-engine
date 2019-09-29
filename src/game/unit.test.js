import { unit } from './unit'

describe('game/unit', () => {
  it('should return object', () => {
    expect(typeof unit()()).toBe('object')
  })

  // it('Every tick should incerase createUnitTick counter', () => {
  //   const newunit = {}

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

  //   const go = tick(newunit, app)

  //   expect(go).toBe(1100)
  // })

  // it('After the tick should create new unit', () => {})
})
