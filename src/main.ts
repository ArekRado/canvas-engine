import { Guid } from './util/uuid'
import { Vector2D } from '@arekrado/vector-2d'
import { Animation, CollideBox, CollideCircle, Field, Sprite, Transform } from './component'
import { Dictionary } from './type/common'

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
  entity: Guid[]
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
    fieldFloat: Dictionary<Field<number>>
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
    fieldFloat: {},
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

// let runOneFrame =
//     (~state: Type.state, ~enableDraw=true, ~performanceNow=?, ())
//     : Type.state => {

//   let newState =
//     state
//     ->Time_System.update(~performanceNowOverride=?performanceNow, ~state=_, ())
//     ->IO_System.update(~state=_)
//     ->Transform_System.update(~state=_)
//     ->Collide_System.update(~state=_)
//     ->Animation_System.update(~state=_)
//     ->Draw_System.update(~enableDraw, ~state=_);

//   newState;
// };

// let initialize = () => {
//   switch (Webapi.Dom.Document.querySelector("body", Webapi.Dom.document)) {
//   | Some(body) => {
//     let container = Webapi.Dom.Document.createElement("div", Webapi.Dom.document);
//     Webapi.Dom.Element.setAttribute("id", "engine-game", container);
//     Webapi.Dom.Element.appendChild(container, body);
//   }
//   | None => ()
// };

// IO_System.initialize();
// }
