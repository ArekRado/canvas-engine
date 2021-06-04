// https://github.com/toji/gl-matrix

import REGL from 'regl'
import { Camera } from '../type'

var identity = require('gl-mat4/identity')
var perspective = require('gl-mat4/perspective')
var lookAt = require('gl-mat4/lookAt')
// var invert = require('gl-mat4/invert')

export type DrawCamera = (camera: Camera, block: any) => void
type CreateCamera = (params: { camera: Camera; regl: REGL.Regl }) => DrawCamera

export const createCamera: CreateCamera = ({
  // camera,
  regl,
}: {
  camera: Camera
  regl: REGL.Regl
}) => {
  var cameraState = {
    // view: identity(new Float32Array(16)),
    // projection: identity(new Float32Array(16)),
    // position: new Float32Array(camera.position || 3),
    // center: new Float32Array(camera.position || 3),
    // theta: camera.theta || 0,
    // phi: camera.phi || 0,
    // distance: Math.log(camera.distance || 10.0),
    // eye: new Float32Array(3),
    // up: new Float32Array(camera.up || [0, 1, 0])

    view: identity(new Float32Array(16)),
    projection: identity(new Float32Array(16)),
    position: new Float32Array(3),
    center: new Float32Array([0, 2.5, 0] || 3),
    theta: 0,
    phi: 0,
    distance: Math.log(10.0),
    eye: new Float32Array(3),
    up: new Float32Array([0, 1, 0]),
  }

  var right = new Float32Array([1, 0, 0])
  var front = new Float32Array([0, 0, 1])

  var minDistance = Math.log(0.1)
  var maxDistance = Math.log(1000)

  var dtheta = 0
  var dphi = 0
  var ddistance = 0

  var prevX = 0
  var prevY = 0

  function damp(x: any) {
    var xd = x * 0.9
    if (Math.abs(xd) < 0.1) {
      return 0
    }
    return xd
  }

  function clamp(x: any, lo: any, hi: any) {
    return Math.min(Math.max(x, lo), hi)
  }

  document.addEventListener(
    'mousemove',
    (e) => {
      const { buttons, x, y } = e

      if (buttons & 1) {
        var dx = (x - prevX) / window.innerWidth
        var dy = (y - prevY) / window.innerHeight
        var w = Math.max(cameraState.distance, 0.5)

        dtheta += w * dx
        dphi += w * dy
      }
      prevX = x
      prevY = y
    },
    false,
  )

  document.addEventListener('wheel', (e) => {
    const { deltaY } = e
    ddistance += deltaY / window.innerHeight
  })

  function updateCamera(_: any) {
    var center = cameraState.center
    var eye = cameraState.eye
    var up = cameraState.up

    cameraState.theta += dtheta
    cameraState.phi = clamp(
      cameraState.phi + dphi,
      -Math.PI / 2.0,
      Math.PI / 2.0,
    )
    cameraState.distance = clamp(
      cameraState.distance + ddistance,
      minDistance,
      maxDistance,
    )

    dtheta = damp(dtheta)
    dphi = damp(dphi)
    ddistance = damp(ddistance)

    var theta = cameraState.theta
    var phi = cameraState.phi
    var r = Math.exp(cameraState.distance)

    var vf = r * Math.sin(theta) * Math.cos(phi)
    var vr = r * Math.cos(theta) * Math.cos(phi)
    var vu = r * Math.sin(phi)

    for (var i = 0; i < 3; ++i) {
      eye[i] = center[i] + vf * front[i] + vr * right[i] + vu * up[i]
    }

    lookAt(cameraState.view, eye, center, up)
  }

  var injectContext = regl({
    context: Object.assign({}, cameraState, {
      projection: function ({ viewportWidth, viewportHeight }: any) {
        return perspective(
          cameraState.projection,
          Math.PI / 4.0,
          viewportWidth / viewportHeight,
          0.01,
          1000.0,
        )
      },
    }),
    uniforms: Object.keys(cameraState).reduce(function (uniforms, name: any) {
      uniforms[name] = regl.context(name)
      return uniforms
    }, {}),
  })

  function setupCamera(camera: Camera, block: any) {
    updateCamera(camera)
    injectContext(block)
  }

  Object.keys(cameraState).forEach(function (name: any) {
    ;(setupCamera as any)[name] = (cameraState as any)[name]
  })

  return setupCamera
}
