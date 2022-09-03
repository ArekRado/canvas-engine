import { Dictionary, Entity, RectangleContour } from '../../type'
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

const flatQuadTree = (tree: QuadTree, maxLevel: number): RectangleData[][] => {
  const nodeData: RectangleData[][] = []

  if (tree.topRight) {
    const data = flatQuadTree(tree.topRight, maxLevel - 1)
    if (maxLevel === 1 && data.length > 1) {
      nodeData.push(data as unknown as RectangleData[])
    } else if (data?.[0]?.length > 1) {
      nodeData.push(...data)
    }
  }
  if (tree.topLeft) {
    const data = flatQuadTree(tree.topLeft, maxLevel - 1)
    if (maxLevel === 1 && data.length > 1) {
      nodeData.push(data as unknown as RectangleData[])
    } else if (data?.[0]?.length > 1) {
      nodeData.push(...data)
    }
  }
  if (tree.bottomRight) {
    const data = flatQuadTree(tree.bottomRight, maxLevel - 1)
    if (maxLevel === 1 && data.length > 1) {
      nodeData.push(data as unknown as RectangleData[])
    } else if (data?.[0]?.length > 1) {
      nodeData.push(...data)
    }
  }
  if (tree.bottomLeft) {
    const data = flatQuadTree(tree.bottomLeft, maxLevel - 1)
    if (maxLevel === 1 && data.length > 1) {
      nodeData.push(data as unknown as RectangleData[])
    } else if (data?.[0]?.length > 1) {
      nodeData.push(...data)
    }
  }

  return nodeData.concat(tree.data)
}

export const removeDuplicatedCollisoins = (
  collisions: RectangleData[][],
): [string, string][] => {
  const cache: Dictionary<[string, string]> = {}

  for (let i = 0; i < collisions.length; i++) {
    const node = collisions[i]

    for (let j = 0; j < node.length; j++) {
      const entity1 = node[j].entity
      for (let k = 0; k < node.length; k++) {
        const entity2 = node[k].entity
        if (entity1 !== entity2) {
          // simply sort entities so it will overwrite duplicated keys in both combinations
          const cacheKey =
            entity1 > entity2
              ? `${entity1},${entity2}`
              : `${entity2},${entity1}`
          cache[cacheKey] = [entity1, entity2]
        }
      }
    }
  }

  return Object.values(cache)
}

export const getQuadTreeCollisions = ({
  quadTree,
  maxLevel,
}: {
  quadTree: QuadTree
  maxLevel: number
}) => {
  const flattenQuadTree = flatQuadTree(quadTree, maxLevel)
  return removeDuplicatedCollisoins(flattenQuadTree)
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
    let newTree = treeNode
    for (let i = 0; i < rectangles.length; i++) {
      const data = rectangles[i]

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
            rectangles: newTree.topRight?.data.concat(data) ?? [data],
            treeNode: newTree.topRight ?? emptyQuadTree,
            maxLevel: maxLevel - 1,
          })
        : newTree.topRight

      const topLeft = getAABBCollision({
        rectangle1: data.rectangle,
        rectangle2: splittedBounds.topLeft,
      })
        ? getQuadTree({
            bounds: splittedBounds.topLeft,
            rectangles: newTree.topLeft?.data.concat(data) ?? [data],
            treeNode: newTree.topLeft ?? emptyQuadTree,
            maxLevel: maxLevel - 1,
          })
        : newTree.topLeft

      const bottomRight = getAABBCollision({
        rectangle1: data.rectangle,
        rectangle2: splittedBounds.bottomRight,
      })
        ? getQuadTree({
            bounds: splittedBounds.bottomRight,
            rectangles: newTree.bottomRight?.data.concat(data) ?? [data],
            treeNode: newTree.bottomRight ?? emptyQuadTree,
            maxLevel: maxLevel - 1,
          })
        : newTree.bottomRight

      const bottomLeft = getAABBCollision({
        rectangle1: data.rectangle,
        rectangle2: splittedBounds.bottomLeft,
      })
        ? getQuadTree({
            bounds: splittedBounds.bottomLeft,
            rectangles: newTree.bottomLeft?.data.concat(data) ?? [data],
            treeNode: newTree.bottomLeft ?? emptyQuadTree,
            maxLevel: maxLevel - 1,
          })
        : newTree.bottomLeft

      newTree = {
        topRight,
        topLeft,
        bottomRight,
        bottomLeft,
        data: [],
      }
    }

    return newTree
  }
}
