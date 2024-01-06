import { Vector2D } from '@arekrado/vector-2d'

////////////////////////////////////
//
//
//
// Util
//
//
//
////////////////////////////////////

export type Dictionary<Value> = { [key: string]: Value }

export type Entity = string

export type Mouse = {
  buttons: number
  position: Vector2D
  isMoving: boolean
  isButtonUp: boolean
  isButtonDown: boolean
  lastClick: {
    timestamp: number
    buttons: number
  }
  wheel: {
    deltaMode: number
    deltaX: number
    deltaY: number
    deltaZ: number
  }
}

export type KeyData = {
  // Key was released.
  isUp: boolean
  // Key was pressed.
  isDown: boolean
  // @TODO Key is held.
  isPressed: boolean
}

export type Keyboard = {
  keys: { [key: string]: KeyData | undefined }
}

////////////////////////////////////
//
//
//
// Event
//
//
//
////////////////////////////////////

export type ECSEvent<Type, Payload> = {
  type: Type
  payload: Payload
}

export type EmitEvent = (event: unknown) => void

export type EventHandler<
  Event,
  State extends UnknownState = UnknownState,
> = (params: { event: Event; state: State }) => State

export enum CanvasEngineEvent {
  windowResize = 'CanvasEngineEvent-windowResize',
  colliderCollision = 'CanvasEngineEvent-colliderCollision',

  renderLoopStart = 'CanvasEngineEvent-renderLoopStart',
  mouseActionEvent = 'CanvasEngineEvent-mouseActionEvent',
  keyboardActionEvent = 'CanvasEngineEvent-keyboardActionEvent',
}

export type WindowResizeEvent = ECSEvent<CanvasEngineEvent.windowResize, null>
export type RenderLoopStartEvent = ECSEvent<
  CanvasEngineEvent.renderLoopStart,
  {
    animationFrame: number
  }
>

export type MouseActionEvent = ECSEvent<
  CanvasEngineEvent.mouseActionEvent,
  Mouse
>
export type KeyboardActionEvent = ECSEvent<
  CanvasEngineEvent.keyboardActionEvent,
  Keyboard
>

// export type AllEvents =
//   | WindowResizeEvent
//   | RenderLoopStartEvent
//   | MouseActionEvent
//   | KeyboardActionEvent

////////////////////////////////////
//
//
//
// System
//
//
//
////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyStateForSystem = EmptyState<UnknownComponent, any>

export type GetDefaultComponent<X> = (params?: Partial<X>) => X

export type SystemMethodParams<
  ComponentData = AnyStateForSystem['component'],
  State = AnyStateForSystem,
> = {
  state: State
  entity: Entity
  name: string
  component: ComponentData
}

export type System<
  Component,
  State extends AnyStateForSystem = AnyStateForSystem,
> = {
  name: string
  componentName: string
  priority: number
  /**
   * Called on each component create if state.component[name] and system name are the same
   */
  create: ((params: SystemMethodParams<Component, State>) => State) | undefined
  /**
   * Called on each runOneFrame
   */
  tick: ((params: { state: State }) => State) | undefined
  remove: ((params: SystemMethodParams<Component, State>) => State) | undefined
  update:
    | ((
        params: SystemMethodParams<Component, State> & {
          previousComponent: Component
        },
      ) => State)
    | undefined
}

// type CreateGlobalSystemParams<State extends AnyStateForSystem> = {
//   state: State
//   name: string
//   create?: (params: { state: State }) => State
//   tick?: (params: { state: State }) => State
//   fixedTick?: (params: { state: State }) => State
//   priority?: number
// }

export type GlobalSystem<State extends AnyStateForSystem> = {
  name: string
  tick?: (params: { state: State }) => State
  create: undefined
  remove: (params: { state: State }) => State
  priority: number
}

////////////////////////////////////
//
//
//
// State
//
//
//
////////////////////////////////////

type StateDefaultComponents = {
  mouse: Map<Entity, Mouse>
  keyboard: Map<Entity, Keyboard>
}

type StateDefaultSystems =
  | System<Event, AnyStateForSystem>
  | System<Mouse, AnyStateForSystem>
  | System<Keyboard, AnyStateForSystem>

/**
 * Describes empty state without internal components and systems
 */
type EmptyState<Component extends UnknownComponent, System> = {
  entity: Map<Entity, Entity>
  component: Component
  system: Array<System>
  globalSystem: Array<GlobalSystem<UnknownState>>
}

/**
 * Describes extendable state with internal components and systems
 */
export type InitialState<
  Component = UnknownComponent,
  System = UnknownSystem,
> = EmptyState<StateDefaultComponents & Component, StateDefaultSystems & System>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownComponent = Dictionary<Map<string, any>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownSystem = System<any, AnyStateForSystem>
// export type UnknownGlobalSystem = GlobalSystem<AnyStateForSystem>
type UnknownState = EmptyState<UnknownComponent, UnknownSystem>
