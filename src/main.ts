import { Vector2D } from '@arekrado/vector-2d'
import { Animation, CollideBox, CollideCircle, Field, Sprite, Transform } from './component'
import { Dictionary, Guid } from './type'
import {
  initialize as initializeDraw,
} from './system/draw'
import {
  initialize as initializeIO,
} from './system/io'

export type Entity = {
  id: Guid,
  name: string,
} 

export type Time = {
  timeNow: number
  delta: number
}

export type AssetSprite = {
  src: string
  name: string
}

export type Asset = {
  sprite: AssetSprite[]
}

export type Mouse = {
  buttons: number
  position: Vector2D
}

export type State = {
  entity: Entity[]
  component: {
    /* blueprint: Belt.Map.String.t({
      connectedEntites: []
    }), */
    // TODO
    // event
    // scene
    sprite: Dictionary<Sprite>
    transform: Dictionary<Transform>
    animation: Dictionary<Animation>
    collideBox: Dictionary<CollideBox>
    collideCircle: Dictionary<CollideCircle>
    fieldNumber: Dictionary<Field<number>>
    fieldVector: Dictionary<Field<Vector2D>>
    fieldString: Dictionary<Field<string>>
  },
  asset: Asset
  mouse: Mouse
  time: Time
  isDebugInitialized: boolean
}

export const initialState: State = {
  entity: [],
  component: {
    transform: {},
    sprite: {},
    animation: {},
    collideBox: {},
    collideCircle: {},
    fieldNumber: {},
    fieldString: {},
    fieldVector: {},
  },
  asset: {
    sprite: [],
  },
  time: {
    timeNow: 0.0,
    delta: 0.0,
  },
  mouse: {
    buttons: 0,
    position: [0, 0],
  },
  isDebugInitialized: false,
}

export const initialize = () => {
  const body = document.body

  if (body) {
    const gameContainer = document.createElement('div')
    gameContainer.setAttribute('id', 'canvas-engine')
    body.appendChild(gameContainer)
  }

  initializeIO()
  initializeDraw()
}
