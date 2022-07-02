import { Vector2D } from '@arekrado/vector-2d'
import {
  getCircleCircleIntersection,
  getCircleLineIntersection,
  getLineLineIntersection,
  getPointCircleIntersection,
  getPointLineIntersection,
  getPointPointIntersection,
  getPolygonCircleIntersection,
  getPolygonLineIntersection,
  getPolygonPointIntersection,
  getPolygonPolygonIntersection,
  Intersection,
  // getRectangleLineIntersection,
  // getRectangleRectangleIntersection,
} from './getIntersection'
import { toFixedVector2D } from '../../util/toFixedVector2D'

describe('getIntersection', () => {
  // describe('getRectangleRectangleIntersection', () => {
  //   it('shouldIntersection collisions', () => {
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
  //         getRectangleRectangleIntersection({
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

  //   it('should not get cIntersection when object is outside', () => {
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
  //         getRectangleRectangleIntersection({
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

  //   it('should get cIntersection when object inside', () => {
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
  //         getRectangleRectangleIntersection({
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

  it('getPointLineIntersection', () => {
    expect(
      getPointPointIntersection({
        point1: [0, 0],
        point2: [0, 0],
      }),
    ).toEqual({ figure: { data: [0, 0], type: 'point' }, position: [0, 0] })

    expect(
      getPointPointIntersection({
        point1: [0, 0],
        point2: [1, 1],
      }),
    ).toBeNull()
  })

  it('getPointCircleIntersection', () => {
    expect(
      getPointCircleIntersection({
        point: [0, 0],
        circle: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({ figure: { data: [0, 0], type: 'point' }, position: [0, 0] })

    expect(
      getPointCircleIntersection({
        point: [2, 2],
        circle: { position: [2.1, 2.1], radius: 1 },
      }),
    ).toEqual({ figure: { data: [2, 2], type: 'point' }, position: [2, 2] })

    expect(
      getPointCircleIntersection({
        point: [4, 4],
        circle: { position: [2.1, 2.1], radius: 1 },
      }),
    ).toBeNull()
  })

  it('getCircleCircleIntersection', () => {
    expect(
      getCircleCircleIntersection({
        circle1: { position: [2, 0], radius: 1 },
        circle2: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], radius: 1 }, type: 'circle' },
      position: [1, 0],
    })

    expect(
      getCircleCircleIntersection({
        circle1: { position: [3, 0], radius: 2 },
        circle2: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], radius: 1 }, type: 'circle' },
      position: [1, 0],
    })

    expect(
      getCircleCircleIntersection({
        circle1: { position: [3, 0], radius: 1 },
        circle2: { position: [0, 0], radius: 2 },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], radius: 2 }, type: 'circle' },
      position: [2, 0],
    })

    expect(
      getCircleCircleIntersection({
        circle1: { position: [0, 0], radius: 1 },
        circle2: { position: [0, 0], radius: 1 },
      }),
    ).toEqual({
      figure: { data: { position: [0, 0], radius: 1 }, type: 'circle' },
      position: [0, 0],
    })

    expect(
      getCircleCircleIntersection({
        circle1: { position: [1, 1], radius: 2 },
        circle2: { position: [3, 3], radius: 2 },
      }),
    ).toEqual({
      figure: { data: { position: [3, 3], radius: 2 }, type: 'circle' },
      position: [1.585786437626905, 1.585786437626905],
    })

    expect(
      getCircleCircleIntersection({
        circle1: { position: [1, 1], radius: 2 },
        circle2: { position: [4, 4], radius: 2 },
      }),
    ).toEqual(null)
  })

  it('getPointLineIntersection', () => {
    expect(
      getPointLineIntersection({
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
      getPointLineIntersection({
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
      getPointLineIntersection({
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
      getPointLineIntersection({
        point: [1, 2],
        line: {
          position: [0, 0],
          position2: [2, 2],
        },
      }),
    ).toBeNull()

    expect(
      getPointLineIntersection({
        point: [1, 1],
        line: {
          position: [0, 0],
          position2: [1, 0.999],
        },
      }),
    ).toBeNull()
  })

  it('getCircleLineIntersection', () => {
    expect(
      getCircleLineIntersection({
        circle: { position: [0, 0], radius: 1 },
        // line end inside circle
        line: { position: [0.5, 0.5], position2: [3, 3] },
      }),
    ).toEqual({
      figure: { data: [0.5, 0.5], type: 'point' },
      position: [0.5, 0.5],
    })

    expect(
      getCircleLineIntersection({
        circle: { position: [0, 0], radius: 1 },
        // line second end inside circle
        line: { position: [3, 3], position2: [0.5, 0.5] },
      }),
    ).toEqual({
      figure: { data: [0.5, 0.5], type: 'point' },
      position: [0.5, 0.5],
    })

    expect(
      getCircleLineIntersection({
        circle: { position: [0, 0], radius: 1 },
        // line crossing circle
        line: { position: [0, 0], position2: [1, 1] },
      }),
    ).toEqual({ figure: { data: [0, 0], type: 'point' }, position: [0, 0] })

    expect(
      getCircleLineIntersection({
        circle: { position: [0, 0], radius: 1 },
        // line outside circle
        line: { position: [9, 9], position2: [10, 10] },
      }),
    ).toBeNull()

    expect(
      getCircleLineIntersection({
        circle: { position: [2, 0], radius: 1 },
        // line crosess circle, endings are not inside circle
        line: { position: [2, 3], position2: [2, -3] },
      }),
    ).toEqual({
      figure: { data: { position: [2, 3], position2: [2, -3] }, type: 'line' },
      position: [2, 0],
    })
  })

  it('getLineLineIntersection', () => {
    expect(
      getLineLineIntersection({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [-1, -1], position2: [1, 1] },
      }),
    ).toBeNull()

    expect(
      getLineLineIntersection({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [1, 1], position2: [2, 2] },
      }),
    ).toBeNull()

    expect(
      getLineLineIntersection({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [-1, 1], position2: [1, -1] },
      }),
    ).toEqual({
      figure: { data: { position: [-1, 1], position2: [1, -1] }, type: 'line' },
      position: [0, 0],
    })

    expect(
      getLineLineIntersection({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [-2, -2], position2: [2, 2] },
      }),
    ).toBeNull()

    expect(
      getLineLineIntersection({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [1, 1], position2: [2, 2] },
      }),
    ).toBeNull()

    expect(
      getLineLineIntersection({
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
      getLineLineIntersection({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [100, 100], position2: [100, 100] },
      }),
    ).toBeNull()

    expect(
      getLineLineIntersection({
        line1: { position: [2, -2], position2: [-2, 2] },
        line2: { position: [-2, -2], position2: [1, 1] },
      }),
    ).toEqual({
      figure: { data: { position: [-2, -2], position2: [1, 1] }, type: 'line' },
      position: [0, 0],
    })

    expect(
      getLineLineIntersection({
        line1: { position: [-2, -2], position2: [1, 1] },
        line2: { position: [2, -2], position2: [-2, 2] },
      }),
    ).toEqual({
      figure: { data: { position: [2, -2], position2: [-2, 2] }, type: 'line' },
      position: [0, 0],
    })

    expect(
      getLineLineIntersection({
        line1: { position: [0, 0], position2: [4, 4] },
        line2: { position: [2, 4], position2: [2, 0] },
      }),
    ).toEqual({
      figure: { data: { position: [2, 4], position2: [2, 0] }, type: 'line' },
      position: [2, 2],
    })
  })

  // it('getRectangleLineIntersection', () => {
  //   // left side collision
  //   expect(
  //     getRectangleLineIntersection({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [-1.5, 0.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toEqual([0,0])

  //   // right side collision
  //   expect(
  //     getRectangleLineIntersection({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [1.5, 0.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toEqual([0,0])

  //   // top side collision
  //   expect(
  //     getRectangleLineIntersection({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [0.5, 1.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toEqual([0,0])

  //   // bottom side collision
  //   expect(
  //     getRectangleLineIntersection({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [0.5, -1.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toEqual([0,0])

  //   // left-top to right-bottom
  //   expect(
  //     getRectangleLineIntersection({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [-1, 2], position2: [2, -1] },
  //     }),
  //   ).toEqual([0,0])

  //   // line inside rectangle
  //   expect(
  //     getRectangleLineIntersection({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [0.5, 0.5], position2: [0.5, 0.5] },
  //     }),
  //   ).toBeNull()

  //   // line doesn't touch rectangle
  //   expect(
  //     getRectangleLineIntersection({
  //       rectangle: { position: [0, 0], size: [1, 1] },
  //       line: { position: [-1, -1], position2: [-2, -2] },
  //     }),
  //   ).toBeNull()
  // })

  it('getPolygonPointIntersection', () => {
    expect(
      getPolygonPointIntersection({
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
      getPolygonPointIntersection({
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
      getPolygonPointIntersection({
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
      getPolygonPointIntersection({
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

  it('getPolygonCircleIntersection', () => {
    expect(
      getPolygonCircleIntersection({
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
    //   getPolygonCircleIntersection({
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
      getPolygonCircleIntersection({
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
      getPolygonCircleIntersection({
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

  it('getPolygonLineIntersection', () => {
    expect(
      getPolygonLineIntersection({
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
      getPolygonLineIntersection({
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
      getPolygonLineIntersection({
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

  it('getPolygonPolygonIntersection', () => {
    expect(
      getPolygonPolygonIntersection({
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
      getPolygonPolygonIntersection({
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
