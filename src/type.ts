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

export type EventHandler<Event, State extends EmptyState<any, any>> = (params: {
  event: Event
  state: State
}) => State

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

export type SystemMethodParams<ComponentData = AnyStateForSystem['component']> =
  {
    entity: Entity
    name: string
    component: ComponentData
  }

export type System<Component, CreateExtraParameters = unknown> = {
  name: string
  componentName: string
  priority: number
  /**
   * Called on each component create if state.component[name] and system name are the same
   */
  create:
    | ((
        params: SystemMethodParams<Component> & {
          extraParameters: CreateExtraParameters
        },
      ) => void)
    | undefined
  /**
   * Called on each runOneFrame
   */
  tick: (() => void) | undefined
  remove: ((params: SystemMethodParams<Component>) => void) | undefined
  update:
    | ((
        params: SystemMethodParams<Component> & {
          previousComponent: Component
        },
      ) => void)
    | undefined
}

// type CreateGlobalSystemParams = {
//   state: State
//   name: string
//   create?: () => void
//   tick?: () => void
//   fixedTick?: () => void
//   priority?: number
// }

export type GlobalSystem = {
  name: string
  tick?: () => void
  create: undefined
  remove: () => void
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
export type EmptyState<
  Component extends UnknownComponent = any,
  System = any,
> = {
  entity: Map<Entity, Entity>
  component: Component
  system: Array<System>
  globalSystem: Array<GlobalSystem>
}

export type UnknownComponent<Component = any> = Dictionary<
  Map<string, Component>
>
export type UnknownSystem = System<any>
// export type UnknownGlobalSystem = GlobalSystem<AnyStateForSystem>
