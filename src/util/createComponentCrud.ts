import { Entity } from '../type'
import { createStore } from './store'

export const createComponentCrud = <Component>({
  name,
  store,
}: {
  name: string
  store: ReturnType<typeof createStore>
}) => ({
  getComponent: (entity: Entity) => store.getComponent<Component>(name, entity),
  createComponent: (entity: Entity, data: Component) =>
    store.createComponent<Component>(name, entity, data),
  updateComponent: (
    entity: Entity,
    update: (component: Component) => Partial<Component>,
  ) => store.updateComponent<Component>(name, entity, update),

  removeComponent: (entity: Entity) => store.removeComponent(name, entity),
})
