import { getAABBCollision } from './getAABBCollision'

describe('getAABBCollision', () => {
  it('rectangle2 inside rectangle1', () => {
    expect(
      getAABBCollision({
        rectangle1: [1, 1, 4, 4],
        rectangle2: [2, 2, 3, 3],
      }),
    ).toEqual(true)
  })

  it('corner collisions', () => {
    expect(
      getAABBCollision({
        rectangle1: [1, 1, 2, 2],
        rectangle2: [2, 2, 3, 3],
      }),
    ).toEqual(true)

    expect(
      getAABBCollision({
        rectangle1: [1, 1, 3, 3],
        rectangle2: [2, 2, 4, 4],
      }),
    ).toEqual(true)

    expect(
      getAABBCollision({
        rectangle1: [2, 2, 4, 4],
        rectangle2: [3, 3, 5, 5],
      }),
    ).toEqual(true)
  })

  it('rectangle outside rectanlge', () => {
    expect(
      getAABBCollision({
        rectangle1: [1, 1, 2, 2],
        rectangle2: [3, 3, 4, 4],
      }),
    ).toEqual(false)

    expect(
      getAABBCollision({
        rectangle1: [1, 1, 2, 2],
        rectangle2: [1, 3, 2, 4],
      }),
    ).toEqual(false)

    expect(
      getAABBCollision({
        rectangle1: [1, 1, 2, 2],
        rectangle2: [0, 1, 0, 1],
      }),
    ).toEqual(false)

    expect(
      getAABBCollision({
        rectangle1: [1, 1, 4, 4],
        rectangle2: [5, 2, 6, 3],
      }),
    ).toEqual(false)
  })
})
