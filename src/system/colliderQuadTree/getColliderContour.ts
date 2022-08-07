import { add, Vector2D } from '@arekrado/vector-2d'
import { Collider, RectangleContour, Transform } from '../../type'
import {
  applyTransformsToPosition,
  mapRectangleToPolygon,
  mapToPolygon,
} from '../collider/collisionsMatrix'

const getEdgePositions = (vectors: Vector2D[]): RectangleContour => {
  let top = 0
  let bottom = 0
  let left = 0
  let right = 0

  vectors.forEach((v) => {
    if (top < v[1]) {
      top = v[1]
    }
    if (bottom > v[1]) {
      bottom = v[1]
    }

    if (right < v[0]) {
      right = v[0]
    }
    if (left > v[0]) {
      left = v[0]
    }
  })

  return [
    [left, bottom],
    [right - left, top - bottom],
  ]
}

export const getColliderContour = ({
  collider,
  transform,
}: {
  collider: Collider
  transform: Transform
}): RectangleContour => {
  switch (collider.data.type) {
    case 'point':
      return [
        applyTransformsToPosition({
          transform,
          colliderPosition: collider.data.position,
        }),
        [0, 0],
      ]
    case 'rectangle':
      return getEdgePositions(
        mapRectangleToPolygon({
          transform,
          colliderData: collider.data,
        }),
      )

    case 'circle':
      const position = add(
        collider.data.position,
        transform.position as Vector2D,
      )
      return [
        position,
        [
          position[0] + collider.data.radius / 2,
          position[1] + collider.data.radius / 2,
        ],
      ]

    case 'line':
      return getEdgePositions([
        applyTransformsToPosition({
          transform,
          colliderPosition: collider.data.position,
        }),
        applyTransformsToPosition({
          transform,
          colliderPosition: collider.data.position2,
        }),
      ])

    case 'polygon':
      return getEdgePositions(
        mapToPolygon({
          transform,
          colliderData: collider.data,
        }),
      )
  }
}
