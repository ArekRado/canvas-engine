import { Line, Entity } from '../type'
import { Vector2D, vectorZero } from '@arekrado/vector-2d'
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
    uniform vec2 scale;
    uniform float rotation;

    void main() {
      float aspect = viewportWidth / viewportHeight;

      // Scale the position
      vec2 scaledPosition = position * scale;

      vec2 aspectPosition = vec2(scaledPosition.x, scaledPosition.y * aspect);
    
      vec2 rotationV = vec2(
        sin(rotation),
        cos(rotation)
      );

      // Rotate the position
      vec2 rotatedPosition = vec2(
         scaledPosition.x * rotation.y + scaledPosition.y * rotation.x,
         scaledPosition.y * rotation.y - scaledPosition.x * rotation.x
      );

      // Add in the translation.
      vec2 translatedPosition = rotatedPosition + translate;

      // Set projection and view from camera
      gl_Position = projection * view * vec4(
        translatedPosition.x,
        translatedPosition.y,
        0,
        1.0
      );


      // float aspect = viewportWidth / viewportHeight;
      // vec2 anchoredPosition = translate + position - (anchor * scale);

      // gl_Position = projection 
      //   * view 
      //   * vec4(
      //       anchoredPosition.x,
      //       aspect * anchoredPosition.y,
      //        0, 1
      //     );
    }`,

    attributes: {
      position: regl.prop<{ path: [Vector2D, Vector2D] }, 'path'>('path'),
    },
    uniforms: {
      viewportWidth: regl.context('viewportWidth'),
      viewportHeight: regl.context('viewportHeight'),

      translate: regl.prop<Entity, 'position'>('position'),
      scale: regl.prop<Entity, 'scale'>('scale'),
      rotation: regl.prop<Entity, 'rotation'>('rotation'),
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
        line.path[i],
        line.path[i + 1] || vectorZero(),
      ]
      drawLine({
        path,
        position: entity.position,
        scale: entity.scale,
        rotation: entity.rotation,
        borderColor: line.borderColor,
      })
    })
  }
}
