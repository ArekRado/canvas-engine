import { Entity, Ellipse } from '../type'
import { scale, sub, vector } from '@arekrado/vector-2d'
import REGL from 'regl'

type CreateDrawEllipseParams = {
  ellipse: Ellipse
  entity: Entity
}

export type DrawEllipse = (props: CreateDrawEllipseParams) => void

type CreateDrawEllipse = (regl: REGL.Regl) => DrawEllipse
export const createDrawEllipse: CreateDrawEllipse = (regl) => {
  const drawEllipse = regl({
    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 1,
        dstRGB: 'one minus src alpha',
        dstAlpha: 1,
      },
      equation: {
        rgb: 'add',
        alpha: 'add',
      },
      color: [0, 0, 0, 0],
    },

    frag: `
    precision mediump float;

    uniform float radius;
    uniform vec2 center;
    uniform vec4 fillColor;

    void main () {
      float x =  gl_FragCoord.x;
      float y =  gl_FragCoord.y;
  
      float dx = center.x - x;
      float dy = center.y - y;

      float distance = sqrt(dx*dx + dy*dy);
  
      if (distance < radius / 2.0) {
        gl_FragColor = fillColor;
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;

    uniform float viewportWidth;
    uniform float viewportHeight;
    uniform float pixelRatio;

    varying float vRadius;
    uniform mat4 projection, view;

    void main () {
      float aspect = viewportWidth / viewportHeight;

      vec2 positionAspect = vec2(
        position.x,
        position.y * aspect
      );

      gl_Position = projection * view * vec4(
        positionAspect / pixelRatio,
        0,
        1.0
      );
    }`,

    attributes: {
      position: regl.prop<Entity, 'position'>('position'),
    },

    uniforms: {
      viewportWidth: regl.context('viewportWidth'),
      viewportHeight: regl.context('viewportHeight'),
      pixelRatio: regl.context('pixelRatio'),

      fillColor: regl.prop<Ellipse, 'fillColor'>('fillColor'),
      radius: ({ viewportWidth, pixelRatio }, props: any) =>
        ((props.radius / 2.0) * viewportWidth) / pixelRatio,
      center: ({ viewportWidth, viewportHeight, pixelRatio }, props: any) => {
        const aspect = viewportWidth / viewportHeight
        const positionAspect = vector(props.center[0], props.center[1] * aspect)

        const center = vector(
          (((positionAspect[0] + 1.0) / 2.0) * viewportWidth) / pixelRatio,
          (((positionAspect[1] + 1.0) / 2.0) * viewportHeight) / pixelRatio,
        )

        return center
      },
    },

    primitive: 'triangles',
    count: 6,
  })

  return ({ entity, ellipse }) => {
    const p = entity.position
    const radius = ellipse.size[0] // todo - should use both sizes

    const position = [
      0,
      0,

      p[0] + radius,
      0,

      0,
      p[1] + radius,

      0,
      p[1] + radius,

      p[0] + radius,
      0,

      p[0] + radius,
      p[1] + radius,
    ]

    const center = scale(
      0.5,
      sub(vector(position[10], position[11]), vector(position[0], position[1])),
    )

    drawEllipse({
      center,
      position,
      radius: ellipse.size[0],
      fillColor: ellipse.fillColor,
    })
  }
}
