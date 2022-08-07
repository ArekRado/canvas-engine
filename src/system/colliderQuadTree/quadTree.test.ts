import { vector, Vector2D } from '@arekrado/vector-2d'
import { QuadTree } from './quadTree'

describe('quadTree', () => {
  it('Should return all nodes when rectangle has the same size as boundary', () => {
    const tree = new QuadTree({
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    })

    Array.from({ length: 100 }).forEach(() => {
      tree.insert({
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: Math.random() * 10,
        height: Math.random() * 10,
      })
    })

    expect(
      tree.retrieve({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }).length,
    ).toBe(100)
  })

  it('Should return node when rectangle is in the same quad', () => {
    const tree = new QuadTree({
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    })

    tree.insert({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    })

    expect(
      tree.retrieve({
        x: 40,
        y: 40,
        width: 1,
        height: 1,
      }).length,
    ).toBe(1)
  })

  it('Should not return node when rectangle is not in the same quad', () => {
    const tree = new QuadTree({
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    })

    ;[
      vector(10, 10),
      vector(90, 10),
      vector(90, 90),
      vector(10, 90),
      vector(10, 90),
      vector(10, 90),
      vector(10, 90),
      vector(10, 90),
      vector(10, 90),
      vector(10, 90),
      vector(10, 90),
    ].forEach((v: Vector2D) => {
      tree.insert({
        x: v[0],
        y: v[1],
        width: 10,
        height: 10,
      })
    })

    expect(
      tree.retrieve({
        x: 90,
        y: 90,
        width: 1,
        height: 1,
      }).length,
    ).toBe(1)
  })

  it('Should not return node when rectangle is not in the same quad - different max objects', () => {
    const tree = new QuadTree({
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      max_objects: 2,
    })

    ;[
      vector(10, 10),
      vector(90, 10),
      vector(90, 90),
      vector(10, 90),
      vector(10, 90),
    ].forEach((v: Vector2D) => {
      tree.insert({
        x: v[0],
        y: v[1],
        width: 10,
        height: 10,
      })
    })

    expect(
      tree.retrieve({
        x: 90,
        y: 90,
        width: 1,
        height: 1,
      }).length,
    ).toBe(1)
  })

  it('Should not return node when rectangle is not in the same quad - different max objects', () => {
    const tree = new QuadTree({
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    })

    Array.from({ length: 100 }).forEach((_, i) => {
      const x = i % 10
      const y = Math.floor(i / 10)

      tree.insert({
        x: x * 10,
        y: y * 10,
        width: 2,
        height: 2,
      })
    })

    expect(
      tree.retrieve({
        x: 90,
        y: 90,
        width: 2,
        height: 2,
      }).length,
    ).toBe(4)
  })
})
