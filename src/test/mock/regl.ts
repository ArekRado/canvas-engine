import REGL, { Texture2D } from 'regl'

// because node can't into webgl
export let reglMock = ((() => () => {}) as unknown) as REGL.Regl
reglMock.context = () => ({
  id: 0,
  type: 0,
  data: '',
})
reglMock.prop = () => ({
  id: 0,
  type: 0,
  data: '',
})

reglMock.frame = (callback) => {
  callback({
    tick: 0,
    time: 0,
    viewportWidth: 0,
    viewportHeight: 0,
    drawingBufferWidth: 0,
    drawingBufferHeight: 0,
    pixelRatio: 0,
  })

  return {
    cancel: () => {},
  }
}
reglMock.clear = () => {}
reglMock.poll = () => (({} as unknown) as Texture2D)
reglMock.texture = () => (({} as unknown) as Texture2D)
// limits are readonly
reglMock['limits' + ''] = {
  colorBits: [1, 1, 1, 1],
  depthBits: 1,
  stencilBits: 1,
  subpixelBits: 1,
  extensions: [],
  maxAnisotropic: 1,
  maxDrawbuffers: 1,
  maxColorAttachments: 1,
  pointSizeDims: new Float32Array(2),
  lineWidthDims: new Float32Array(2),
  maxViewportDims: new Int32Array(2),
  maxCombinedTextureUnits: 1,
  maxCubeMapSize: 1,
  maxRenderbufferSize: 1,
  maxTextureUnits: 1,
  maxTextureSize: 1,
  maxAttributes: 1,
  maxVertexUniforms: 1,
  maxVertexTextureUnits: 1,
  maxVaryingVectors: 1,
  maxFragmentUniforms: 1,
  glsl: '',
  renderer: '',
  vendor: '',
  version: '',
  textureFormats: [],
} as REGL.Limits
