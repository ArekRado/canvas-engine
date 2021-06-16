import { Entity, Sprite } from '../type'
import REGL from 'regl'

export const loadTexture = (src: string, regl: REGL.Regl) =>
  new Promise((resolve) => {
    const image = new Image()
    image.src = src
    image.onload = () => {
      resolve(regl.texture(image))
    }
  })

type CreateDrawSpriteProps = {
  sprite: Sprite
  entity: Entity
}

export type DrawSprite = (props: CreateDrawSpriteProps) => void

type CreateDrawSprite = (regl: REGL.Regl) => DrawSprite

export const createDrawSprite: CreateDrawSprite = (regl) => {
  const drawSprite = regl({
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
      color: [0, 0, 0, 1],
    },

    frag: `
    precision mediump float;
    uniform sampler2D texture;
    varying vec2 uv;
    
    void main () {
      gl_FragColor = texture2D(texture, uv);
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    
    uniform float rotation;
    uniform float viewportWidth;
    uniform float viewportHeight;
    uniform vec2 scale;
    uniform vec2 anchor;
    uniform vec2 translate;
    uniform mat4 projection, view;

    void main () {
      uv = position;
        
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
        scaledPosition.x * rotationV.y + scaledPosition.y * rotationV.x,
        scaledPosition.y * rotationV.y - scaledPosition.x * rotationV.x
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

      uv = position;

      // gl_Position = projection
      //   * view 
      //   * vec4(
      //       (cos(rotation) * anchoredPosition.x - sin(rotation) * anchoredPosition.y),
      //       aspect * (sin(rotation) * anchoredPosition.x + cos(rotation) * anchoredPosition.y),
      //       0,
      //       1.0
      //     );
    }`,

    attributes: {
      position: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
    },

    uniforms: {
      viewportWidth: regl.context('viewportWidth'),
      viewportHeight: regl.context('viewportHeight'),

      translate: regl.prop<Entity, 'position'>('position'),
      texture: regl.prop<Sprite, 'texture'>('texture'),
      scale: regl.prop<Entity, 'scale'>('scale'),
      rotation: regl.prop<Entity, 'rotation'>('rotation'),
      anchor: regl.prop<Sprite, 'anchor'>('anchor'),
    },

    primitive: 'triangles',
    count: 6,
  })

  return ({ entity, sprite }) => {
    drawSprite({
      texture: sprite.texture,
      scale: entity.scale,
      rotation: entity.rotation,
      anchor: sprite.anchor,
      position: entity.position,
    })
  }
}
