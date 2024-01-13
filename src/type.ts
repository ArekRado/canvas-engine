/* eslint-disable @typescript-eslint/no-explicit-any */

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
  State extends EmptyState<any, any>,
> = (params: { event: Event; state: State }) => State

////////////////////////////////////
//
//
//
// System
//
//
//
////////////////////////////////////

export type AnyStateForSystem = EmptyState<UnknownComponent<any>, any>

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

/**
 * Describes empty state without internal components and systems
 */
export type EmptyState<Component extends UnknownComponent = any, System = any> = {
  entity: Map<Entity, Entity>
  component: Component
  system: Array<System>
  globalSystem: Array<GlobalSystem<any>>
}

export type UnknownComponent<Component = any> = Dictionary<Map<string, Component>>
export type UnknownSystem = System<any, AnyStateForSystem>
// export type UnknownGlobalSystem = GlobalSystem<AnyStateForSystem>
