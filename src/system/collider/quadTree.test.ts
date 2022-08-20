import {
  clearQuadTreeCache,
  flatQuadTree,
  getQuadTree,
  getQuadTreeCache,
  RectangleData,
  splitBounds,
} from './quadTree'

describe('quadTree', () => {
  beforeEach(() => {
    clearQuadTreeCache()
  })

  describe('splitBounds', () => {
    it('should return proper bounds for each possition', () => {
      expect(
        splitBounds({
          bounds: [0, 0, 100, 100],
          position: 'topRight',
        }),
      ).toEqual([50, 50, 100, 100])

      expect(
        splitBounds({
          bounds: [0, 0, 100, 100],
          position: 'topLeft',
        }),
      ).toEqual([0, 50, 50, 100])

      expect(
        splitBounds({
          bounds: [0, 0, 100, 100],
          position: 'bottomRight',
        }),
      ).toEqual([50, 0, 100, 50])

      expect(
        splitBounds({
          bounds: [0, 0, 100, 100],
          position: 'bottomLeft',
        }),
      ).toEqual([0, 0, 50, 50])
    })

    expect(
      splitBounds({
        bounds: [20, 30, 200, 50],
        position: 'topRight',
      }),
    ).toEqual([110, 40, 200, 50])

    expect(
      splitBounds({
        bounds: [20, 30, 200, 50],
        position: 'topLeft',
      }),
    ).toEqual([20, 40, 110, 50])

    expect(
      splitBounds({
        bounds: [20, 30, 200, 50],
        position: 'bottomRight',
      }),
    ).toEqual([110, 30, 200, 40])

    expect(
      splitBounds({
        bounds: [20, 30, 200, 50],
        position: 'bottomLeft',
      }),
    ).toEqual([20, 30, 110, 40])
  })

  describe('quadTree cache', () => {
    beforeEach(() => {
      clearQuadTreeCache()
    })

    it('should return proper data', () => {
      const rectangle: RectangleData = {
        entity: '1',
        rectangle: [10, 10, 20, 20],
      }

      const quadTree = getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle],
        maxRectanglesPerNode: 10,
      })

      expect(flatQuadTree(quadTree)).toEqual([rectangle])
    })

    it('should return proper data', () => {
      const rectangle1: RectangleData = {
        entity: '1',
        rectangle: [10, 10, 20, 20],
      }
      const rectangle2: RectangleData = {
        entity: '2',
        rectangle: [10, 80, 20, 90],
      }
      const rectangle3: RectangleData = {
        entity: '3',
        rectangle: [80, 80, 90, 90],
      }
      const rectangle4: RectangleData = {
        entity: '4',
        rectangle: [80, 10, 90, 20],
      }

      const quadTree = getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle1, rectangle2, rectangle3, rectangle4],
        maxRectanglesPerNode: 1,
        maxLevel: 2,
      })

      expect(flatQuadTree(quadTree)).toEqual([
        [rectangle3],
        [rectangle2],
        [rectangle4],
        [rectangle1],
      ])
    })

    it('should return proper data', () => {
      const rectangle1: RectangleData = {
        entity: '1',
        rectangle: [10, 10, 20, 20],
      }
      const rectangle2: RectangleData = {
        entity: '2',
        rectangle: [20, 20, 30, 30],
      }
      const rectangle3: RectangleData = {
        entity: '3',
        rectangle: [80, 80, 90, 90],
      }
      const rectangle4: RectangleData = {
        entity: '4',
        rectangle: [60, 60, 70, 70],
      }

      const quadTree = getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle1, rectangle2, rectangle3, rectangle4],
        maxRectanglesPerNode: 2,
        maxLevel: 2,
      })

      expect(flatQuadTree(quadTree)).toEqual([
        [rectangle3, rectangle4],
        [rectangle1, rectangle2],
      ])
    })

    it('should return proper data', () => {
      const rectangle1: RectangleData = {
        entity: '1',
        rectangle: [10, 10, 20, 20],
      }
      const rectangle2: RectangleData = {
        entity: '2',
        rectangle: [20, 20, 30, 30],
      }
      const rectangle3: RectangleData = {
        entity: '3',
        rectangle: [80, 80, 90, 90],
      }
      const rectangle4: RectangleData = {
        entity: '4',
        rectangle: [60, 60, 70, 70],
      }
      const rectangle5: RectangleData = {
        entity: '5',
        rectangle: [60, 90, 90, 70],
      }
      const rectangle6: RectangleData = {
        entity: '6',
        rectangle: [80, 60, 70, 70],
      }
      const rectangle7: RectangleData = {
        entity: '7',
        rectangle: [10, 60, 30, 70],
      }

      const quadTree = getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [
          rectangle1,
          rectangle2,
          rectangle3,
          rectangle4,
          rectangle5,
          rectangle6,
          rectangle7,
        ],
        maxRectanglesPerNode: 1,
        maxLevel: 2,
      })

      expect(flatQuadTree(quadTree)).toEqual([
        [[rectangle3, rectangle4, rectangle5, rectangle6]],
        [rectangle7],
        [[rectangle1, rectangle2]],
      ])
    })

    it('should return proper data', () => {
      const rectangle1: RectangleData = {
        entity: '1',
        rectangle: [0, 0, 10, 10],
      }
      const rectangle2: RectangleData = {
        entity: '2',
        rectangle: [40, 40, 50, 50],
      }
      const rectangle3: RectangleData = {
        entity: '3',
        rectangle: [0, 40, 10, 50],
      }
      const rectangle4: RectangleData = {
        entity: '4',
        rectangle: [40, 0, 50, 10],
      }
      const rectangle5: RectangleData = {
        entity: '5',
        rectangle: [0, 0, 50, 50],
      }
      const rectangle6: RectangleData = {
        entity: '6',
        rectangle: [10, 10, 40, 40],
      }
      const rectangle7: RectangleData = {
        entity: '7',
        rectangle: [25, 25, 75, 75],
      }

      const quadTree = getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [
          rectangle1,
          rectangle2,
          rectangle3,
          rectangle4,
          rectangle5,
          rectangle6,
          rectangle7,
        ],
        maxRectanglesPerNode: 1,
        maxLevel: 2,
      })

      expect(flatQuadTree(quadTree)).toEqual([
        [
          [rectangle2],
          [rectangle3],
          [rectangle4],
          [rectangle1, rectangle5, rectangle6],
          rectangle7,
        ],
      ])
    })
  })

  it('should return simple node without splits when quadTree receives one rectangle', () => {
    const rectangle: RectangleData = {
      entity: '1',
      rectangle: [10, 10, 20, 20],
    }
    const tree = getQuadTree({
      bounds: [0, 0, 100, 100],
      rectangles: [rectangle],
      maxRectanglesPerNode: 10,
    })

    expect(tree).toEqual({
      topRight: null,
      topLeft: null,
      bottomRight: null,
      bottomLeft: null,
      data: [rectangle],
    })
  })

  it('should return simple node without splits when amount of rectangles doesnt excess maxRectanglesPerNode', () => {
    const rectangle: RectangleData = {
      entity: '1',
      rectangle: [10, 10, 20, 20],
    }
    const tree = getQuadTree({
      bounds: [0, 0, 100, 100],
      rectangles: [rectangle, rectangle, rectangle, rectangle, rectangle],
      maxRectanglesPerNode: 10,
    })

    expect(tree).toEqual({
      topRight: null,
      topLeft: null,
      bottomRight: null,
      bottomLeft: null,
      data: [rectangle, rectangle, rectangle, rectangle, rectangle],
    })
  })

  it('should assign rectangle to proper sector', () => {
    const rectangle1: RectangleData = {
      entity: '1',
      rectangle: [10, 10, 20, 20],
    }
    const rectangle2: RectangleData = {
      entity: '2',
      rectangle: [10, 80, 20, 90],
    }
    const rectangle3: RectangleData = {
      entity: '3',
      rectangle: [80, 80, 90, 90],
    }
    const rectangle4: RectangleData = {
      entity: '4',
      rectangle: [80, 10, 90, 20],
    }

    expect(
      getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle1, rectangle2],
        maxRectanglesPerNode: 1,
        maxLevel: 2,
      }).bottomLeft?.data,
    ).toEqual([rectangle1])

    expect(
      getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle1, rectangle2],
        maxRectanglesPerNode: 1,
        maxLevel: 2,
      }).topLeft?.data,
    ).toEqual([rectangle2])

    expect(
      getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle3, rectangle4],
        maxRectanglesPerNode: 1,
        maxLevel: 2,
      }).topRight?.data,
    ).toEqual([rectangle3])

    expect(
      getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle3, rectangle4],
        maxRectanglesPerNode: 1,
        maxLevel: 2,
      }).bottomRight?.data,
    ).toEqual([rectangle4])
  })

  it('should split tree when rectangles are placed in different areas', () => {
    const rectangle1: RectangleData = {
      entity: '1',
      rectangle: [10, 10, 20, 20],
    }
    const rectangle2: RectangleData = {
      entity: '2',
      rectangle: [10, 80, 20, 90],
    }
    const rectangle3: RectangleData = {
      entity: '3',
      rectangle: [80, 80, 90, 90],
    }
    const rectangle4: RectangleData = {
      entity: '4',
      rectangle: [80, 10, 90, 20],
    }
    const tree = getQuadTree({
      bounds: [0, 0, 100, 100],
      rectangles: [rectangle1, rectangle2, rectangle3, rectangle4],
      maxRectanglesPerNode: 1,
      maxLevel: 2,
    })

    expect(tree).toEqual({
      bottomLeft: {
        topRight: null,
        topLeft: null,
        bottomRight: null,
        bottomLeft: null,
        data: [rectangle1],
      },
      topLeft: {
        topRight: null,
        topLeft: null,
        bottomRight: null,
        bottomLeft: null,
        data: [rectangle2],
      },
      topRight: {
        topRight: null,
        topLeft: null,
        bottomRight: null,
        bottomLeft: null,
        data: [rectangle3],
      },
      bottomRight: {
        topRight: null,
        topLeft: null,
        bottomRight: null,
        bottomLeft: null,
        data: [rectangle4],
      },
      data: [],
    })
  })

  it('should split tree node when rectangles are placed in the same area', () => {
    const rectangle1: RectangleData = {
      entity: '1',
      rectangle: [0, 0, 10, 10],
    }
    const rectangle2: RectangleData = {
      entity: '2',
      rectangle: [25, 25, 30, 30],
    }

    const tree = getQuadTree({
      bounds: [0, 0, 100, 100],
      rectangles: [rectangle1, rectangle2],
      maxRectanglesPerNode: 1,
      maxLevel: 5,
    })

    expect(tree.bottomLeft?.bottomLeft?.bottomLeft?.data).toEqual([rectangle1])
    expect(tree.bottomLeft?.bottomLeft?.topRight?.data).toEqual([rectangle2])
  })

  it('should put rectangles in one data when maxLevel is not enough to move them in separated areas', () => {
    const rectangle1: RectangleData = {
      entity: '1',
      rectangle: [0, 0, 10, 10],
    }
    const rectangle2: RectangleData = {
      entity: '2',
      rectangle: [25, 25, 30, 30],
    }

    const tree = getQuadTree({
      bounds: [0, 0, 100, 100],
      rectangles: [rectangle1, rectangle2],
      maxRectanglesPerNode: 1,
      maxLevel: 1,
    })

    expect(tree.bottomLeft?.data).toEqual([rectangle1, rectangle2])
  })

  it('should put rectangles in one data when maxRectanglesPerNode is enough to calculate the grid', () => {
    const rectangle1: RectangleData = {
      entity: '1',
      rectangle: [0, 0, 10, 10],
    }
    const rectangle2: RectangleData = {
      entity: '2',
      rectangle: [25, 25, 30, 30],
    }

    const tree = getQuadTree({
      bounds: [0, 0, 100, 100],
      rectangles: [rectangle1, rectangle2],
      maxRectanglesPerNode: 2,
      maxLevel: 5,
    })

    expect(tree.data).toEqual([rectangle1, rectangle2])
  })

  it.only('should detect when rectangle is ', () => {
    // top and bottom left
    const rectangle1: RectangleData = {
      entity: '1',
      rectangle: [20, 20, 30, 80],
    }
    // left top
    const rectangle2: RectangleData = {
      entity: '2',
      rectangle: [10, 60, 40, 90],
    }
    // left bottom
    const rectangle3: RectangleData = {
      entity: '3',
      rectangle: [10, 60, 40, 90],
    }

    const tree = getQuadTree({
      bounds: [0, 0, 100, 100],
      rectangles: [rectangle1, rectangle2, rectangle3],
      maxRectanglesPerNode: 1,
      maxLevel: 5,
    })

    expect(tree.data).toEqual([])
  })
})
