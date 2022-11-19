import {
  getQuadTreeCollisions,
  getQuadTree,
  RectangleData,
  splitBounds,
  emptyQuadTree,
  removeDuplicatedCollisoins,
} from './quadTree'

describe.skip('quadTree', () => {
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

  describe('getQuadTreeCollisions', () => {
    it('should return proper data', () => {
      const rectangle: RectangleData = {
        entity: '1',
        rectangle: [10, 10, 20, 20],
      }

      const quadTree = getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle],
      })

      if (quadTree) {
        expect(getQuadTreeCollisions({ quadTree, maxLevel: 1 })).toEqual([])
      }
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
        maxLevel: 2,
      })

      if (quadTree) {
        expect(getQuadTreeCollisions({ quadTree, maxLevel: 2 })).toEqual([])
      }
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
        maxLevel: 2,
      })

      if (quadTree) {
        expect(getQuadTreeCollisions({ quadTree, maxLevel: 2 })).toEqual([
          [rectangle2.entity, rectangle1.entity],
        ])
      }
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
        maxLevel: 2,
      })

      if (quadTree) {
        expect(getQuadTreeCollisions({ quadTree, maxLevel: 2 })).toEqual([
          [rectangle2.entity, rectangle1.entity],
        ])
      }
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
        maxLevel: 4,
      })

      if (quadTree) {
        expect(getQuadTreeCollisions({ quadTree, maxLevel: 4 })).toEqual([
          ['5', '2'],
          ['7', '2'],
          ['7', '5'],
          ['5', '3'],
          ['5', '4'],
          ['6', '2'],
          ['6', '5'],
          ['6', '3'],
          ['6', '4'],
          ['5', '1'],
          ['6', '1'],
        ])
      }
    })

    it('should remove duplicated collisons', () => {
      const colllisions: RectangleData[][] = [
        [
          { rectangle: [52, 201, 86, 231], entity: '1' },
          { rectangle: [64, 145, 99, 165], entity: '2' },
          { rectangle: [82, 182, 117, 206], entity: '3' },
          { rectangle: [93, 139, 129, 177], entity: '4' },
          { rectangle: [62, 128, 84, 153], entity: '5' },
          { rectangle: [100, 166, 133, 199], entity: '6' },
          { rectangle: [113, 180, 113, 180], entity: '11' },
        ],

        [
          { rectangle: [195, 62, 240, 107], entity: '1' },
          { rectangle: [164, 53, 192, 82], entity: '3' },
          { rectangle: [195, 60, 233, 95], entity: '4' },
          { rectangle: [168, 126, 198, 160], entity: '2' },
          { rectangle: [159, 114, 187, 142], entity: '11' },
          { rectangle: [146, 65, 187, 106], entity: '5' },
          { rectangle: [123, 95, 170, 142], entity: '8' },
          { rectangle: [165, 149, 194, 187], entity: '7' },
          { rectangle: [115, 104, 152, 140], entity: '10' },
          { rectangle: [117, 84, 160, 127], entity: '9' },
        ],
        [
          { rectangle: [94, 93, 94, 93], entity: '111' },
          { rectangle: [115, 112, 147, 118], entity: '2' },
          { rectangle: [111, 66, 146, 102], entity: '5' },
          { rectangle: [54, 50, 81, 77], entity: '3' },
          { rectangle: [54, 121, 90, 123], entity: '4' },
          { rectangle: [64, 145, 99, 165], entity: '7' },
          { rectangle: [146, 65, 187, 106], entity: '4' },
          { rectangle: [123, 95, 170, 142], entity: '7' },
          { rectangle: [93, 139, 129, 177], entity: '64' },
          { rectangle: [62, 128, 84, 153], entity: '11' },
          { rectangle: [75, 85, 92, 98], entity: '96' },
          { rectangle: [115, 104, 152, 140], entity: '6' },
          { rectangle: [117, 84, 160, 127], entity: '7' },
        ],
      ]

      expect(removeDuplicatedCollisoins(colllisions)).toEqual([
        ['2', '1'],
        ['3', '1'],
        ['4', '1'],
        ['5', '1'],
        ['6', '1'],
        ['11', '1'],
        ['3', '2'],
        ['4', '2'],
        ['5', '2'],
        ['6', '2'],
        ['11', '2'],
        ['4', '3'],
        ['3', '5'],
        ['6', '3'],
        ['11', '3'],
        ['4', '5'],
        ['6', '4'],
        ['11', '4'],
        ['6', '5'],
        ['11', '5'],
        ['6', '11'],
        ['8', '1'],
        ['7', '1'],
        ['10', '1'],
        ['9', '1'],
        ['8', '3'],
        ['7', '3'],
        ['10', '3'],
        ['9', '3'],
        ['8', '4'],
        ['7', '4'],
        ['10', '4'],
        ['9', '4'],
        ['8', '2'],
        ['7', '2'],
        ['10', '2'],
        ['9', '2'],
        ['8', '11'],
        ['7', '11'],
        ['10', '11'],
        ['9', '11'],
        ['8', '5'],
        ['7', '5'],
        ['10', '5'],
        ['9', '5'],
        ['7', '8'],
        ['10', '8'],
        ['9', '8'],
        ['10', '7'],
        ['9', '7'],
        ['9', '10'],
        ['2', '111'],
        ['5', '111'],
        ['3', '111'],
        ['4', '111'],
        ['7', '111'],
        ['64', '111'],
        ['11', '111'],
        ['96', '111'],
        ['6', '111'],
        ['64', '2'],
        ['96', '2'],
        ['64', '5'],
        ['96', '5'],
        ['64', '3'],
        ['96', '3'],
        ['64', '4'],
        ['96', '4'],
        ['7', '64'],
        ['7', '96'],
        ['7', '6'],
        ['11', '64'],
        ['96', '64'],
        ['6', '64'],
        ['96', '11'],
        ['6', '96'],
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
    })

    expect(tree).toEqual({
      topRight: null,
      topLeft: null,
      bottomRight: null,
      bottomLeft: null,
      data: [rectangle],
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
        maxLevel: 2,
      })?.bottomLeft?.data,
    ).toEqual([rectangle1])

    expect(
      getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle1, rectangle2],
        maxLevel: 2,
      })?.topLeft?.data,
    ).toEqual([rectangle2])

    expect(
      getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle3, rectangle4],
        maxLevel: 2,
      })?.topRight?.data,
    ).toEqual([rectangle3])

    expect(
      getQuadTree({
        bounds: [0, 0, 100, 100],
        rectangles: [rectangle3, rectangle4],
        maxLevel: 2,
      })?.bottomRight?.data,
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
      maxLevel: 5,
    })

    expect(tree?.bottomLeft?.bottomLeft?.bottomLeft?.data).toEqual([rectangle1])
    expect(tree?.bottomLeft?.bottomLeft?.topRight?.data).toEqual([rectangle2])
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
      maxLevel: 1,
    })

    expect(tree?.bottomLeft?.data).toEqual([rectangle1, rectangle2])
  })

  it('should detect when rectangle is ', () => {
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
      maxLevel: 5,
    })

    expect(tree?.data).toEqual([])
  })

  it('should detect proper collisions', () => {
    const rectangle1: RectangleData = {
      entity: '1',
      rectangle: [20, 20, 60, 60],
    }
    const rectangle2: RectangleData = {
      entity: '2',
      rectangle: [160, 160, 190, 190],
    }
    const rectangle3: RectangleData = {
      entity: '3',
      rectangle: [250, 250, 280, 280],
    }
    const rectangle4: RectangleData = {
      entity: '4',
      rectangle: [90, 90, 100, 100],
    }
    const rectangle5: RectangleData = {
      entity: '5',
      rectangle: [130, 130, 140, 140],
    }
    const rectangle6: RectangleData = {
      entity: '6',
      rectangle: [310, 500, 590, 590],
    }
    const rectangle7: RectangleData = {
      entity: '7',
      rectangle: [305, 495, 400, 525],
    }

    const collisions = getQuadTreeCollisions({
      quadTree:
        getQuadTree({
          bounds: [0, 0, 600, 600],
          rectangles: [
            rectangle1,
            rectangle2,
            rectangle3,
            rectangle4,
            rectangle5,
            rectangle6,
            rectangle7,
          ],
          maxLevel: 4,
        }) ?? emptyQuadTree,
      maxLevel: 4,
    })

    expect(collisions).toEqual([['7', '6']])

    const collisions2 = getQuadTreeCollisions({
      quadTree:
        getQuadTree({
          bounds: [0, 0, 600, 600],
          rectangles: [
            rectangle1,
            rectangle2,
            rectangle3,
            rectangle4,
            rectangle5,
            rectangle6,
            rectangle7,
          ],
          maxLevel: 3,
        }) ?? emptyQuadTree,
      maxLevel: 3,
    })

    expect(collisions2).toEqual([
      ['7', '6'],
      ['5', '4'],
    ])
  })
})
