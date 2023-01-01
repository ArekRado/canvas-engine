// import { colliderSystem } from '../system/collider/collider'
import { transformSystem } from '../system/transform/transform'
import { componentName } from '../component/componentName'
import { timeSystem } from '../system/time/time'
import { mouseSystem } from '../system/mouse/mouse'
import { keyboardSystem } from '../system/keyboard/keyboard'
import { cameraSystem } from '../system/camera/camera'
import { animationSystem } from '../system/animation/animation'
import { meshSystem } from '../system/mesh/mesh'
import { materialSystem } from '../system/material/material'
import { eventSystem } from '../event'
import { rigidBodySystem } from '../system/rigidBody/rigidBody'
import { AnyState, InternalInitialState } from '../type'
import { Scene, WebGLRenderer } from 'three'
import { spriteSystem } from '../system/sprite/sprite'
import { colliderSystem } from '../system/collider/collider'

let sceneRef: Scene | undefined
let rendererRef: WebGLRenderer | undefined

export const setScene = () => {
  sceneRef = new Scene()
}
export const getScene = () => sceneRef

export const setRenderer = (containerId: string) => {
  const canvas = document.getElementById(containerId) as HTMLCanvasElement
  rendererRef = new WebGLRenderer({ canvas })
}
export const getRenderer = () => rendererRef

export const getInitialState = (): InternalInitialState => ({
  entity: {},
  component: {
    [componentName.animation]: {},
    [componentName.collider]: {},
    [componentName.time]: {},
    [componentName.camera]: {},
    [componentName.transform]: {},
    [componentName.mouse]: {},
    [componentName.keyboard]: {},
    [componentName.mesh]: {},
    [componentName.material]: {},
    [componentName.rigidBody]: {},
    [componentName.sprite]: {},
  },
  globalSystem: [],
  system: [],
  animationFrame: -1,
})

export const getSystems = ({
  state,
  document,
  containerId,
}: {
  state: AnyState
  renderer?: WebGLRenderer
  document?: Document
  containerId?: string
}): InternalInitialState => {
  let internatlState = state as InternalInitialState

  internatlState = eventSystem(internatlState) as InternalInitialState
  internatlState = timeSystem(internatlState) as InternalInitialState
  internatlState = cameraSystem(internatlState) as InternalInitialState
  internatlState = transformSystem(internatlState) as InternalInitialState
  internatlState = colliderSystem(internatlState) as InternalInitialState
  internatlState = animationSystem(internatlState) as InternalInitialState
  internatlState = materialSystem(internatlState) as InternalInitialState
  internatlState = meshSystem(internatlState) as InternalInitialState
  internatlState = rigidBodySystem(internatlState) as InternalInitialState
  internatlState = spriteSystem(internatlState) as InternalInitialState

  if (containerId) {
    internatlState = mouseSystem({
      state: internatlState,
      document: document ?? window.document,
      containerId,
    }) as InternalInitialState
    internatlState = keyboardSystem({
      state: internatlState,
      document: document ?? window.document,
      containerId,
    }) as InternalInitialState
  }

  return internatlState
}

export const getState = <State extends AnyState = AnyState>(
  params?: {
    state?: State
    documentMock?: Document
    windowMock?: Window
    containerId: string
  },
): InternalInitialState => {
  let state
  let documentMock
  let windowMock
  let containerId

  if (params) {
    state = params.state
    documentMock = params.documentMock ?? document
    windowMock = params.windowMock ?? window
    containerId = params.containerId
  }

  if (windowMock && documentMock && containerId) {
    setRenderer(containerId)
    setScene()

    const rendererRef = getRenderer()
    const sceneRef = getScene()

    if (rendererRef && sceneRef) {
      rendererRef.setSize(windowMock.innerWidth, windowMock.innerHeight)
      documentMock.body.appendChild(rendererRef.domElement)
    }
  }

  return getSystems({
    state: state || getInitialState(),
    document,
    containerId,
  })
}
