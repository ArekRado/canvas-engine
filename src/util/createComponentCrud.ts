import { Entity } from '../type'
import { createStore } from '../store'

export const createComponentCrud = <
  Component,
  CreateExtraParameters = unknown,
>({
  name,
  getStore,
}: {
  name: string
  getStore: () => ReturnType<typeof createStore>
}) => ({
  getComponent: (entity: Entity) =>
    getStore().getComponent<Component>(name, entity),
  createComponent: (
    entity: Entity,
    data: Component,
    extraParameters?: CreateExtraParameters,
  ) =>
    getStore().createComponent<Component>(name, entity, data, extraParameters),
  updateComponent: (
    entity: Entity,
    update: (component: Component) => Partial<Component>,
  ) => getStore().updateComponent<Component>(name, entity, update),

  removeComponent: (entity: Entity) => getStore().removeComponent(name, entity),
})
