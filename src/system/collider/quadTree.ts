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

export const getQuadTreeCollisions = (
  tree: QuadTree,
  maxLevel: number,
): RectangleData[][] => {
  const nodeData: RectangleData[][] = []

  if (tree.topRight) {
    const data = getQuadTreeCollisions(tree.topRight, maxLevel - 1)
    if (maxLevel === 1 && data.length > 1) {
      nodeData.push(data as unknown as RectangleData[])
    } else if (data?.[0]?.length > 1) {
      nodeData.push(...data)
    }
  }
  if (tree.topLeft) {
    const data = getQuadTreeCollisions(tree.topLeft, maxLevel - 1)
    if (maxLevel === 1 && data.length > 1) {
      nodeData.push(data as unknown as RectangleData[])
    } else if (data?.[0]?.length > 1) {
      nodeData.push(...data)
    }
  }
  if (tree.bottomRight) {
    const data = getQuadTreeCollisions(tree.bottomRight, maxLevel - 1)
    if (maxLevel === 1 && data.length > 1) {
      nodeData.push(data as unknown as RectangleData[])
    } else if (data?.[0]?.length > 1) {
      nodeData.push(...data)
    }
  }
  if (tree.bottomLeft) {
    const data = getQuadTreeCollisions(tree.bottomLeft, maxLevel - 1)
    if (maxLevel === 1 && data.length > 1) {
      nodeData.push(data as unknown as RectangleData[])
    } else if (data?.[0]?.length > 1) {
      nodeData.push(...data)
    }
  }

  return nodeData.concat(tree.data)
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
}): QuadTree | null => {
  const isNodeEmpty =
    (treeNode.topRight === null &&
      treeNode.topLeft === null &&
      treeNode.bottomRight === null &&
      treeNode.bottomLeft === null) ||
    (treeNode.topRight?.data.length === 0 &&
      treeNode.topLeft?.data.length === 0 &&
      treeNode.bottomRight?.data.length === 0 &&
      treeNode.bottomLeft?.data.length === 0)

  if (maxLevel === 0 || (rectangles.length <= 1 && isNodeEmpty)) {
    return {
      topRight: treeNode.topRight,
      topLeft: treeNode.topLeft,
      bottomRight: treeNode.bottomRight,
      bottomLeft: treeNode.bottomLeft,
      data: rectangles,
    }
  } else {
    const newTree = rectangles.reduce((acc, data) => {
      const splittedBounds = {
        topRight: splitBounds({ bounds, position: 'topRight' }),
        topLeft: splitBounds({ bounds, position: 'topLeft' }),
        bottomRight: splitBounds({ bounds, position: 'bottomRight' }),
        bottomLeft: splitBounds({ bounds, position: 'bottomLeft' }),
      }

      const topRight = getAABBCollision({
        rectangle1: data.rectangle,
        rectangle2: splittedBounds.topRight,
      })
        ? getQuadTree({
            bounds: splittedBounds.topRight,
            rectangles: acc.topRight?.data.concat(data) ?? [data],
            maxRectanglesPerNode,
            treeNode: acc.topRight ?? emptyQuadTree,
            maxLevel: maxLevel - 1,
          })
        : acc.topRight

      const topLeft = getAABBCollision({
        rectangle1: data.rectangle,
        rectangle2: splittedBounds.topLeft,
      })
        ? getQuadTree({
            bounds: splittedBounds.topLeft,
            rectangles: acc.topLeft?.data.concat(data) ?? [data],
            maxRectanglesPerNode,
            treeNode: acc.topLeft ?? emptyQuadTree,
            maxLevel: maxLevel - 1,
          })
        : acc.topLeft

      const bottomRight = getAABBCollision({
        rectangle1: data.rectangle,
        rectangle2: splittedBounds.bottomRight,
      })
        ? getQuadTree({
            bounds: splittedBounds.bottomRight,
            rectangles: acc.bottomRight?.data.concat(data) ?? [data],
            maxRectanglesPerNode,
            treeNode: acc.bottomRight ?? emptyQuadTree,
            maxLevel: maxLevel - 1,
          })
        : acc.bottomRight

      const bottomLeft = getAABBCollision({
        rectangle1: data.rectangle,
        rectangle2: splittedBounds.bottomLeft,
      })
        ? getQuadTree({
            bounds: splittedBounds.bottomLeft,
            rectangles: acc.bottomLeft?.data.concat(data) ?? [data],
            maxRectanglesPerNode,
            treeNode: acc.bottomLeft ?? emptyQuadTree,
            maxLevel: maxLevel - 1,
          })
        : acc.bottomLeft

      return {
        topRight,
        topLeft,
        bottomRight,
        bottomLeft,
        data: [],
      }
    }, treeNode)

    return newTree
  }
}
