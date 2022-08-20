import { Entity, RectangleContour } from '../../type'
import { getAABBCollision } from './getAABBCollision'

export type RectangleData = {
  rectangle: RectangleContour
  entity: Entity
}

type QuadTree = {
  topRight: QuadTree | null
  topLeft: QuadTree | null
  bottomRight: QuadTree | null
  bottomLeft: QuadTree | null
  data: RectangleData[]
}

export const emptyQuadTree = {
  topRight: null,
  topLeft: null,
  bottomRight: null,
  bottomLeft: null,
  data: [],
}

let cache: RectangleData[][] = []

export const clearQuadTreeCache = () => {
  cache = []
}

export const getQuadTreeCache = () => cache

export const flatQuadTree = (tree: QuadTree): RectangleData[][] => {
  const a: RectangleData[][] = []

  if (tree.topRight)
    a.push(flatQuadTree(tree.topRight) as unknown as RectangleData[])
  if (tree.topLeft)
    a.push(flatQuadTree(tree.topLeft) as unknown as RectangleData[])
  if (tree.bottomRight)
    a.push(flatQuadTree(tree.bottomRight) as unknown as RectangleData[])
  if (tree.bottomLeft)
    a.push(flatQuadTree(tree.bottomLeft) as unknown as RectangleData[])

  return a.concat(tree.data)
}

export const splitBounds = ({
  bounds,
  position,
}: {
  bounds: RectangleContour
  position: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'
}): RectangleContour => {
  const boundHalfWidth = (bounds[2] - bounds[0]) / 2
  const boundHalfHeight = (bounds[3] - bounds[1]) / 2

  switch (position) {
    case 'topRight':
      return [
        bounds[0] + boundHalfWidth,
        bounds[1] + boundHalfHeight,
        bounds[2],
        bounds[3],
      ]
    case 'topLeft':
      return [
        bounds[0],
        bounds[1] + boundHalfHeight,
        bounds[2] - boundHalfWidth,
        bounds[3],
      ]
    case 'bottomRight':
      return [
        bounds[0] + boundHalfWidth,
        bounds[1],
        bounds[2],
        bounds[3] - boundHalfHeight,
      ]
    case 'bottomLeft':
      return [
        bounds[0],
        bounds[1],
        bounds[2] - boundHalfWidth,
        bounds[3] - boundHalfHeight,
      ]
  }
}

export const getQuadTree = ({
  bounds,
  rectangles,
  maxRectanglesPerNode = 10,
  maxLevel = 1,
  treeNode = emptyQuadTree,
}: {
  bounds: RectangleContour
  rectangles: RectangleData[]
  maxRectanglesPerNode?: number
  maxLevel?: number
  treeNode?: QuadTree
}): QuadTree => {
  if (
    maxLevel === 0 ||
    maxRectanglesPerNode >= rectangles.length ||
    rectangles.length <= 1
  ) {
    cache.push(rectangles)

    return {
      topRight: treeNode.topRight,
      topLeft: treeNode.topLeft,
      bottomRight: treeNode.bottomRight,
      bottomLeft: treeNode.bottomLeft,
      data: rectangles,
    }
  } else {
    return rectangles.reduce((acc, data) => {
      const [x1, y1, x2, y2] = data.rectangle
      // if (
      //   getAABBCollision({
      //     rectangle1: data.rectangle,
      //     rectangle2: bounds,
      //   }) === false
      // ) {
      //   return acc
      // }

      const nodeHalfWidth = (bounds[2] - bounds[0]) / 2
      const nodeHalfHeight = (bounds[3] - bounds[1]) / 2

      let newQuadTree

      if (x1 > nodeHalfWidth) {
        if (y1 > nodeHalfHeight) {
          return {
            topRight: getQuadTree({
              bounds: { bounds, position: 'topRight' },
              rectangles: acc.topRight?.data.concat(data) ?? [data],
              maxRectanglesPerNode,
              treeNode: acc.topRight ?? emptyQuadTree,
              maxLevel: maxLevel - 1,
            }),
            topLeft: acc.topLeft,
            bottomRight: acc.bottomRight,
            bottomLeft: acc.bottomLeft,
            data: [],
          }
        } else {
          return {
            topRight: acc.topRight,
            topLeft: acc.topLeft,
            bottomRight: getQuadTree({
              bounds: splitBounds({ bounds, position: 'bottomRight' }),
              rectangles: acc.bottomRight?.data.concat(data) ?? [data],
              maxRectanglesPerNode,
              treeNode: acc.bottomRight ?? emptyQuadTree,
              maxLevel: maxLevel - 1,
            }),
            bottomLeft: acc.bottomLeft,
            data: [],
          }
        }
      } else {
        if (y1 > nodeHalfHeight) {
          return {
            topRight: acc.topRight,
            topLeft: getQuadTree({
              bounds: splitBounds({ bounds, position: 'topLeft' }),
              rectangles: acc.topLeft?.data.concat(data) ?? [data],
              maxRectanglesPerNode,
              treeNode: acc.topLeft ?? emptyQuadTree,
              maxLevel: maxLevel - 1,
            }),
            bottomRight: acc.bottomRight,
            bottomLeft: acc.bottomLeft,
            data: [],
          }
        } else {
          return {
            topRight: acc.topRight,
            topLeft: acc.topLeft,
            bottomRight: acc.bottomRight,
            bottomLeft: getQuadTree({
              bounds: splitBounds({ bounds, position: 'bottomLeft' }),
              rectangles: acc.bottomLeft?.data.concat(data) ?? [data],
              maxRectanglesPerNode,
              treeNode: acc.bottomLeft ?? emptyQuadTree,
              maxLevel: maxLevel - 1,
            }),
            data: [],
          }
        }
      }
    }, treeNode)
  }
}
