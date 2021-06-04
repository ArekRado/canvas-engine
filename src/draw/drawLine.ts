import { Line, Entity } from '../type'
import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import REGL from 'regl'

export const createDrawLineCommand = (regl: REGL.Regl) => {
  var lineWidth = 1
  if (lineWidth > regl.limits.lineWidthDims[1]) {
    lineWidth = regl.limits.lineWidthDims[1]
  }

  return regl({
    frag: `
    precision mediump float;
    uniform vec4 borderColor;

    void main() {
      gl_FragColor = borderColor;
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;

    uniform float viewportWidth;
    uniform float viewportHeight;
    uniform vec2 translate;
    uniform mat4 projection, view;

    void main() {
      float aspect = viewportWidth / viewportHeight;

      gl_Position = projection * view * vec4(translate.x + position.x, aspect * (translate.y + position.y), 0, 1);
    }`,

    attributes: {
      position: regl.prop<{ path: [Vector2D, Vector2D] }, 'path'>('path'),
    },
    uniforms: {
      viewportWidth: regl.context('viewportWidth'),
      viewportHeight: regl.context('viewportHeight'),

      translate: regl.prop<Entity, 'position'>('position'),
      borderColor: regl.prop<Line, 'borderColor'>('borderColor'),
    },
    lineWidth: lineWidth,
    count: 2,
    primitive: 'line loop',
  })
}

type CreateDrawLineProps = {
  line: Line
  entity: Entity
}

export type DrawLine = (params: CreateDrawLineProps) => void

type CreateDrawLine = (regl: REGL.Regl) => DrawLine
export const createDrawLine: CreateDrawLine = (regl) => {
  const drawLine = createDrawLineCommand(regl)

  return ({ entity, line }) => {
    line.path.forEach((_, i) => {
      const path = [
        add(line.path[i], entity.position),
        add(line.path[i + 1] || vectorZero(), entity.position),
      ]
      drawLine({
        path,
        position: entity.position,
        borderColor: line.borderColor,
      })
    })
  }
}
