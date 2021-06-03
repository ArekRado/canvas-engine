// https://github.com/toji/gl-matrix

import REGL from 'regl'
import { Camera } from '../type'

var identity = require('gl-mat4/identity')
var perspective = require('gl-mat4/perspective')
var lookAt = require('gl-mat4/lookAt')
var invert = require('gl-mat4/invert')

export type DrawCamera = (camera: Camera) => void
type CreateCamera = (params: { camera: Camera; regl: REGL.Regl }) => DrawCamera

export const createCamera: CreateCamera = ({
  camera,
  regl,
}: {
  camera: Camera
  regl: REGL.Regl
}) => {
  var cameraState = {
    view: identity(new Float32Array(16)),
    projection: identity(new Float32Array(16)),
    center: new Float32Array(camera.position || 3),
    theta: camera.theta || 0,
    phi: camera.phi || 0,
    distance: Math.log(camera.distance || 10.0),
    eye: new Float32Array(3),
    up: new Float32Array(camera.up || [0, 1, 0]),
  }

  // var right = new Float32Array([1, 0, 0])
  // var front = new Float32Array([0, 0, 1])

  // var minDistance = Math.log(camera.minDistance ?? 0.1)
  // var maxDistance = Math.log(camera.maxDistance ?? 1000)

  // var dtheta = 0
  // var dphi = 0
  // var ddistance = 0

  // var prevX = 0
  // var prevY = 0
  // const mouseChange = (buttons, x, y) => {
  //   if (buttons & 1) {
  //     var dx = (x - prevX) / window.innerWidth;
  //     var dy = (y - prevY) / window.innerHeight;
  //     var w = Math.max(cameraState.distance, 0.5);

  //     dtheta += w * dx;
  //     dphi += w * dy;
  //   }
  //   prevX = x;
  //   prevY = y;
  // };

  // document.addEventListener('mousemove', mouseChange)

  // mouseWheel(function (dx, dy) {
  //   ddistance += dy / window.innerHeight;
  // });

  // function damp(x: any) {
  //   var xd = x * 0.9
  //   if (Math.abs(xd) < 0.1) {
  //     return 0
  //   }
  //   return xd
  // }

  // function clamp(x: any, lo: any, hi: any) {
  //   return Math.min(Math.max(x, lo), hi)
  // }

  // function updateCamera(camera: Camera) {
  //   // theta?: number | undefined;
  //   // phi?: number | undefined;
  //   // distance?: number | undefined;
  //   // minDistance?: number | undefined;
  //   // maxDistance

  //   var center = new Float32Array(camera.position || 3)
  //   var eye = cameraState.eye
  //   var up = new Float32Array(camera.up || [0, 1, 0])

  //   cameraState.theta = camera.theta || 0
  //   cameraState.phi = clamp(
  //     camera.phi, // + dphi,
  //     -Math.PI / 2.0,
  //     Math.PI / 2.0,
  //   )
  //   cameraState.distance = clamp(
  //     cameraState.distance + ddistance,
  //     Math.log(camera.minDistance ?? 0.1),
  //     Math.log(camera.maxDistance ?? 1000),
  //   )

  //   dtheta = damp(dtheta)
  //   dphi = damp(dphi)
  //   ddistance = damp(ddistance)

  //   var theta = cameraState.theta
  //   var phi = cameraState.phi
  //   var r = Math.exp(cameraState.distance)

  //   var vf = r * Math.sin(theta) * Math.cos(phi)
  //   var vr = r * Math.cos(theta) * Math.cos(phi)
  //   var vu = r * Math.sin(phi)

  //   for (var i = 0; i < 3; ++i) {
  //     eye[i] = center[i] + vf * front[i] + vr * right[i] + vu * up[i]
  //   }

  //   lookAt(cameraState.view, eye, center, up)
  // }

  var injectContext = regl({
    context: {
      projection: function ({ viewportWidth, viewportHeight }: any) {
        return perspective(
          cameraState.projection,
          Math.PI / 4.0,
          viewportWidth / viewportHeight,
          0.01,
          1000.0,
        )
      },
      view: function (_, props: any) {
        return lookAt(
          [],
          // [5,5, 0],
          [props.position[0], props.position[1], 0],
          // [0, 0, 0],
          [props.position[0], props.position[1], 1],
          [0, 1, 0],
        )
      },
    },
    uniforms: {
      view: regl.context<any, any>('view'),
      invView: function (context) {
        return invert([], context.view)
      },
    },
    count: 2,
    frag: `
    precision mediump float;

    void main () {

    }
    `,

    vert: `
    precision mediump float;

    void main () {

    }
    `,
  })

  function setupCamera(camera: Camera) {
    // updateCamera(camera)
    injectContext(camera)
  }

  Object.keys(cameraState).forEach(function (name: any) {
    ;(setupCamera as any)[name] = (cameraState as any)[name]
  })

  return setupCamera
}
