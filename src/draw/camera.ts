// https://github.com/toji/gl-matrix

import REGL from 'regl'
import { Camera, State } from '../type'

var translate = require('gl-mat4/translate')
var identity = require('gl-mat4/identity')
var ortho = require('gl-mat4/ortho')

const clamp = (x: number, lo: number, hi: number) =>
  Math.min(Math.max(x, lo), hi)

export type DrawCamera = (camera: State, block: any) => void
type CreateCamera = (regl: REGL.Regl) => DrawCamera

export const createCamera: CreateCamera = (regl) => {
  const view = identity(new Float32Array(16))
  const projection = identity(new Float32Array(16))

  var minDistance = 1
  var maxDistance = 5000

  // document.addEventListener(
  //   'mousemove',
  //   (e) => {
  //     const { buttons, x, y } = e

  //     if (buttons & 1) {
  //       var dx = (x - prevX) / window.innerWidth
  //       var dy = (y - prevY) / window.innerHeight
  //       var w = Math.max(cameraState.distance, 0.5)

  //       dtheta += w * dx
  //       dphi += w * dy
  //     }
  //     prevX = x
  //     prevY = y
  //   },
  //   false,
  // )

  // document.addEventListener('wheel', (e) => {
  //   const { deltaY } = e
  //   // const delta = deltaY / window.innerHeight;
  //   // distance = clamp(Math.abs(distance + delta), minDistance, maxDistance);
  //   // console.log(delta, distance);

  // })

  var injectContext = regl({
    context: {
      view,
      projection: function (
        { viewportWidth, viewportHeight }: any,
        { size, position }: any,
      ) {
        // const tmpSize = Math.pow(size, 2)

        const tmpSize = clamp(
          Math.pow(size, 2),
          // tmpDistance + state.mouse.wheel.deltaY / window.innerHeight,
          minDistance,
          maxDistance,
        )

        return translate(
          identity(new Float32Array(16)),
          ortho(
            projection,
            -viewportWidth / tmpSize,
            viewportWidth / tmpSize,
            -viewportHeight / tmpSize,
            viewportHeight / tmpSize,
            0,
            1,
          ),
          [-position[0], -position[1], 0],
        )
      },
    },
    // uniforms: Object.keys(cameraState).reduce(function (uniforms, name: any) {
    //   uniforms[name] = regl.context(name)
    //   return uniforms
    // }, {}),

    uniforms: {
      position: regl.prop<Camera, 'position'>('position'),
      size: regl.prop<Camera, 'size'>('size'),
      view: regl.context<any, 'view'>('view'),
      projection: regl.context<any, 'projection'>('projection'),
    },
  })

  // Object.keys(cameraState).forEach(function (name: any) {
  //   ;(setupCamera as any)[name] = (cameraState as any)[name]
  // })

  return (state, block) => {
    injectContext(state.camera, block)
  }
}
