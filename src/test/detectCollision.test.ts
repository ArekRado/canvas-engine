import { Vector2D } from '@arekrado/vector-2d'
import {
  detectCircleCircleCollision,
  detectCircleLineCollision,
  detectLineLineCollision,
  detectPointCircleCollision,
  detectPointLineCollision,
  detectPointPointCollision,
  detectPolygonCircleCollision,
  detectPolygonLineCollision,
  detectPolygonPointCollision,
  detectPolygonPolygonCollision,
  Intersection,
  // detectRectangleLineCollision,
  // detectRectangleRectangleCollision,
} from '../system/collider/detectCollision'
import { toFixedVector2D } from '../util/toFixedVector2D'

describe('detectCollision', () => {
  // describe('detectRectangleRectangleCollision', () => {
  //   it('should detect edge collisions', () => {
  //     const edgeV1: Vector2D[] = [
  //       [-1, 1],
  //       [-1, 0],
  //       [-1, -1],
  //       [0, 1],
  //       [0, -1],
  //       [1, 1],
  //       [1, 0],
  //       [1, -1],
  //     ]

  //     edgeV1.forEach((v1) => {
  //       expect(
  //         detectRectangleRectangleCollision({
  //           rectangle1: {
  //             position: v1,
  //             size: vector(1, 1),
  //           },
  //           rectangle2: {
  //             position: vector(0, 0),
  //             size: vector(1, 1),
  //           },
  //         }),
  //       ).toEqual([0,0])
  //     })
  //   })

  //   it('should not detect collisions when object is outside', () => {
  //     const outsideV1: Vector2D[] = [
  //       [-2, 1],
  //       [-2, 0],
  //       [-2, -1],
  //       [0, 2],
  //       [0, -2],
  //       [2, 1],
  //       [2, 0],
  //       [2, -1],
  //     ]

  //     outsideV1.forEach((v1) => {
  //       expect(
  //         detectRectangleRectangleCollision({
  //           rectangle1: {
  //             position: v1,
  //             size: vector(1, 1),
  //           },
  //           rectangle2: {
  //             position: vector(0, 0),
  //             size: vector(1, 1),
  //           },
  //         }),
  //       ).toBeNull()
  //     })
  //   })

  //   it('should detect collisions when object inside', () => {
  //     const outsideV1: Vector2D[] = [
  //       [0, 0],
  //       [-0.5, 1],
  //       [-0.5, 0],
  //       [-0.5, -1],
  //       [0, 0.5],
  //       [0, -0.5],
  //       [0.5, 0.5],
  //       [0.5, 0],
  //       [0.5, -0.5],
  //     ]

  //     outsideV1.forEach((v1) => {
  //       expect(
  //         detectRectangleRectangleCollision({
  //           rectangle1: {
  //             position: v1,
  //             size: vector(1, 1),
  //           },
  //           rectangle2: {
  //             position: vector(0, 0),
  //             size: vector(1, 1),
  //           },
  //         }),
  //       ).toEqual([0,0])
  //     })
  //   })
  // })

  it('detectPointLineCollision', () => {
    expect(
      detectPointPointCollision({
        point1: [0, 0],
        point2: [0, 0],
      }),
    ).toEqual({ figure: { data: [0, 0], type: 'point' }, position: [0, 0] })

    expect(
      detectPointPointCollision({
        point1: [0, 0],
        point2: [1, 1],
      }),
    ).toBeNull()
  })

  it('detectPointCircleCollision', () => {
    expect(
      detectPointCircleCollision({
        point: [0, 0],
        circle: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({ figure: { data: [0, 0], type: 'point' }, position: [0, 0] })

    expect(
      detectPointCircleCollision({
        point: [2, 2],
        circle: { position: [2.1, 2.1], radius: 1 },
      }),
    ).toEqual({ figure: { data: [2, 2], type: 'point' }, position: [2, 2] })

    expect(
      detectPointCircleCollision({
        point: [4, 4],
        circle: { position: [2.1, 2.1], radius: 1 },
      }),
    ).toBeNull()
  })

  it('detectCircleCircleCollision', () => {
    expect(
      detectCircleCircleCollision({
        circle1: { position: [2, 0], radius: 1 },
        circle2: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], radius: 1 }, type: 'circle' },
      position: [1, 0],
    })

    expect(
      detectCircleCircleCollision({
        circle1: { position: [3, 0], radius: 2 },
        circle2: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], radius: 1 }, type: 'circle' },
      position: [1, 0],
    })

    expect(
      detectCircleCircleCollision({
        circle1: { position: [3, 0], radius: 1 },
        circle2: { position: [0, 0], radius: 2 },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], radius: 2 }, type: 'circle' },
      position: [2, 0],
    })

    expect(
      detectCircleCircleCollision({
        circle1: { position: [0, 0], radius: 1 },
        circle2: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], radius: 1 }, type: 'circle' },
      position: [0, 0],
    })

    expect(
      detectCircleCircleCollision({
        circle1: { position: [1, 1], radius: 2 },
        circle2: { position: [3, 3], radius: 2 },
      }),
    ).toEqual({
      figure: { data: { position: [3, 3], radius: 2 }, type: 'circle' },
      position: [1.585786437626905, 1.585786437626905],
    })

    expect(
      detectCircleCircleCollision({
        circle1: { position: [1, 1], radius: 2 },
        circle2: { position: [4, 4], radius: 2 },
      }),
    ).toEqual(null)
  })

  it('detectPointLineCollision', () => {
    expect(
      detectPointLineCollision({
        point: [0, 0],
        line: {
          position: [0, 0],
          position2: [0, 0],
        },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], position2: [0, 0] }, type: 'line' },
      position: [0, 0],
    })

    expect(
      detectPointLineCollision({
        point: [0, 0],
        line: {
          position: [0, 0],
          position2: [1, 1],
        },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], position2: [1, 1] }, type: 'line' },
      position: [0, 0],
    })

    expect(
      detectPointLineCollision({
        point: [1, 1],
        line: {
          position: [0, 0],
          position2: [2, 2],
        },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], position2: [2, 2] }, type: 'line' },
      position: [1, 1],
    })

    expect(
      detectPointLineCollision({
        point: [1, 2],
        line: {
          position: [0, 0],
          position2: [2, 2],
        },
      }),
    ).toBeNull()

    expect(
      detectPointLineCollision({
        point: [1, 1],
        line: {
          position: [0, 0],
          position2: [1, 0.999],
        },
      }),
    ).toBeNull()
  })

  it('detectCircleLineCollision', () => {
    expect(
      detectCircleLineCollision({
        circle: { position: [0, 0], radius: 1 },
        // line end inside circle
        line: { position: [0.5, 0.5], position2: [3, 3] },
      }),
    ).toEqual({
      figure: { data: [0.5, 0.5], type: 'point' },
      position: [0.5, 0.5],
    })

    expect(
      detectCircleLineCollision({
        circle: { position: [0, 0], radius: 1 },
        // line second end inside circle
        line: { position: [3, 3], position2: [0.5, 0.5] },
      }),
    ).toEqual({
      figure: { data: [0.5, 0.5], type: 'point' },
      position: [0.5, 0.5],
    })

    expect(
      detectCircleLineCollision({
        circle: { position: [0, 0], radius: 1 },
        // line crossing circle
        line: { position: [0, 0], position2: [1, 1] },
      }),
    ).toEqual({ figure: { data: [0, 0], type: 'point' }, position: [0, 0] })

    expect(
      detectCircleLineCollision({
        circle: { position: [0, 0], radius: 1 },
        // line outside circle
        line: { position: [9, 9], position2: [10, 10] },
      }),
    ).toBeNull()

    expect(
      detectCircleLineCollision({
        circle: { position: [2, 0], radius: 1 },
        // line crosess circle, endings are not inside circle
        line: { position: [2, 3], position2: [2, -3] },
      }),
    ).toEqual({
      figure: { data: { position: [2, 3], position2: [2, -3] }, type: 'line' },
      position: [2, 0],
    })
  })

  it('detectLineLineCollision', () => {
    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [-1, -1], position2: [1, 1] },
      }),
    ).toBeNull()

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [1, 1], position2: [2, 2] },
      }),
    ).toBeNull()

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [-1, 1], position2: [1, -1] },
      }),
    ).toEqual({
      figure: { data: { position: [-1, 1], position2: [1, -1] }, type: 'line' },
      position: [0, 0],
    })

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [-2, -2], position2: [2, 2] },
      }),
    ).toBeNull()

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [1, 1], position2: [2, 2] },
      }),
    ).toBeNull()

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [0.9999, 0.9999], position2: [2, 1] },
      }),
    ).toEqual({
      figure: {
        data: { position: [0.9999, 0.9999], position2: [2, 1] },
        type: 'line',
      },
      position: [0.9998999999999998, 0.9998999999999998],
    })

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [100, 100], position2: [100, 100] },
      }),
    ).toBeNull()

    expect(
      detectLineLineCollision({
        line1: { position: [2, -2], position2: [-2, 2] },
        line2: { position: [-2, -2], position2: [1, 1] },
      }),
    ).toEqual({
      figure: { data: { position: [-2, -2], position2: [1, 1] }, type: 'line' },
      position: [0, 0],
    })

    expect(
      detectLineLineCollision({
        line1: { position: [-2, -2], position2: [1, 1] },
        line2: { position: [2, -2], position2: [-2, 2] },
      }),
    ).toEqual({
      figure: { data: { position: [2, -2], position2: [-2, 2] }, type: 'line' },
      position: [0, 0],
    })

    expect(
      detectLineLineCollision({
        line1: { position: [0, 0], position2: [4, 4] },
        line2: { position: [2, 4], position2: [2, 0] },
      }),
    ).toEqual({
      figure: { data: { position: [2, 4], position2: [2, 0] }, type: 'line' },
      position: [2, 2],
    })
  })

  // it('detectRectangleLineCollision', () => {
  //   // left side collision
  //   expect(
  //     detectRectangleLineCollision({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [-1.5, 0.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toEqual([0,0])

  //   // right side collision
  //   expect(
  //     detectRectangleLineCollision({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [1.5, 0.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toEqual([0,0])

  //   // top side collision
  //   expect(
  //     detectRectangleLineCollision({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [0.5, 1.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toEqual([0,0])

  //   // bottom side collision
  //   expect(
  //     detectRectangleLineCollision({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [0.5, -1.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toEqual([0,0])

  //   // left-top to right-bottom
  //   expect(
  //     detectRectangleLineCollision({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [-1, 2], position2: [2, -1] },
  //     }),
  //   ).toEqual([0,0])

  //   // line inside rectangle
  //   expect(
  //     detectRectangleLineCollision({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [0.5, 0.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toBeNull()

  //   // line doesn't touch rectangle
  //   expect(
  //     detectRectangleLineCollision({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [-1, -1], position2: [-2, -2] },
  //     }),
  //   ).toBeNull()
  // })

  it('detectPolygonPointCollision', () => {
    expect(
      detectPolygonPointCollision({
        polygon: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        point: [0.5, 0.5],
      }),
    ).toEqual({
      figure: { data: [0.5, 0.5], type: 'point' },
      position: [0.5, 0.5],
    })

    expect(
      detectPolygonPointCollision({
        polygon: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        point: [0, 0],
      }),
    ).toBeNull()

    expect(
      detectPolygonPointCollision({
        polygon: [
          [0, 0],
          [0, 2],
          [1, 1],
          [2, 2],
          [2, 0],
        ],
        point: [1, 1.1],
      }),
    ).toBeNull()

    expect(
      detectPolygonPointCollision({
        polygon: [
          [0, 0],
          [0, 2],
          [1, 1],
          [2, 2],
          [2, 0],
        ],
        point: [1, 0.9],
      }),
    ).toEqual({ figure: { data: [1, 0.9], type: 'point' }, position: [1, 0.9] })
  })

  it('detectPolygonCircleCollision', () => {
    expect(
      detectPolygonCircleCollision({
        polygon: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
        circle: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({ figure: { data: [0, 0], type: 'point' }, position: [0, 0] })

    // checking if circle is inside is not necessary now
    // expect(
    //   detectPolygonCircleCollision({
    //     polygon: [
    //       [0, 0],
    //       [0, 1],
    //       [1, 1],
    //       [1, 0],
    //     ],
    //     circle: { position: [0.5, 0.5], radius: 0.1 },
    //   }),
    // ).toEqual([0,0])

    expect(
      detectPolygonCircleCollision({
        polygon: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
        circle: { position: [-2, 0], radius: 1 },
      }),
    ).toBeNull()

    expect(
      detectPolygonCircleCollision({
        polygon: [
          [2, 2],
          [1, 1],
          [1, 0],
          [1, 2],
        ],
        circle: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({ figure: { data: [1, 0], type: 'point' }, position: [1, 0] })
  })

  it('detectPolygonLineCollision', () => {
    expect(
      detectPolygonLineCollision({
        polygon: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
        line: { position: [0, 0], position2: [1, 1] },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], position2: [0, 1] }, type: 'line' },
      position: [0, 0],
    })

    expect(
      detectPolygonLineCollision({
        polygon: [
          [2, 2],
          [1, 1],
          [1, 0],
          [1, 2],
        ],
        line: { position: [-1, 0.5], position2: [3, 0.5] },
      }),
    ).toEqual({
      figure: { data: { position: [1, 1], position2: [1, 0] }, type: 'line' },
      position: [1, 0.5],
    })

    expect(
      detectPolygonLineCollision({
        polygon: [
          [2, 2],
          [1, 1],
          [1, 0],
          [1, 2],
        ],
        line: { position: [-1, -0.5], position2: [3, -0.5] },
      }),
    ).toBeNull()
  })

  it('detectPolygonPolygonCollision', () => {
    expect(
      detectPolygonPolygonCollision({
        polygon1: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
        polygon2: [
          [-0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
          [0.5, -0.5],
        ],
      }),
    ).toEqual({
      figure: {
        data: { position: [-0.5, 0.5], position2: [0.5, 0.5] },
        type: 'line',
      },
      position: [0, 0.5],
    })

    expect(
      detectPolygonPolygonCollision({
        polygon1: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
        polygon2: [
          [3, 3],
          [3, 2],
          [2, 2],
          [2, 3],
        ],
      }),
    ).toBeNull()
  })
})
