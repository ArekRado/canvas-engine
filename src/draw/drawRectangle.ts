import { Rectangle, Entity } from '../type'
import REGL from 'regl'
import { createDrawLineCommand } from './drawLine'

type CreateDrawRectangleParams = { rectangle: Rectangle; entity: Entity }

export type DrawRectangle = (params: CreateDrawRectangleParams) => void

type CreateDrawRectangle = (regl: REGL.Regl) => DrawRectangle
export const createDrawRectangle: CreateDrawRectangle = (regl) => {
  const drawLine = createDrawLineCommand(regl)

  return ({ entity, rectangle }) => {
    const size = rectangle.size

    const vert = [
      [entity.position[0], entity.position[1]],
      [entity.position[0] + size[0], entity.position[1]],
      [entity.position[0] + size[0], entity.position[1] + size[1]],
      [entity.position[0], entity.position[1] + size[0]],
    ]

    // borders
    drawLine({
      path: [vert[0], vert[1]],
      borderColor: rectangle.fillColor, // todo - should actually use color to fill not to render borders
    })
    drawLine({
      path: [vert[1], vert[2]],
      borderColor: rectangle.fillColor,
    })
    drawLine({
      path: [vert[2], vert[3]],
      borderColor: rectangle.fillColor,
    })
    drawLine({
      path: [vert[3], vert[0]],
      borderColor: rectangle.fillColor,
    })
  }
}
