import { createComponent } from '../component/createComponent'
import { getComponent } from '../component/getComponent'
import { removeComponent } from '../component/removeComponent'
import { updateComponent } from '../component/updateComponent'
import { InternalInitialState, Entity } from '../type'

export const getComponentCrud = <Component, State extends InternalInitialState = InternalInitialState>({
  name,
}: {
  name: string
}) => {
  const crud = {
    getComponent: ({
      state,
      entity,
    }: {
      state: State
      entity: Entity
    }) =>
      getComponent<Component>({
        state,
        entity,
        name,
      }),
    updateComponent: ({
      state,
      entity,
      update,
    }: {
      state: State
      entity: Entity
      update: (component: Component) => Partial<Component>
    }) =>
      updateComponent<Component, State>({
        state,
        entity,
        name,
        update,
      }),
    createComponent: ({
      state,
      entity,
      data,
    }: {
      state: State
      entity: Entity
      data: Component
    }) =>
      createComponent<Component, State>({
        state,
        entity,
        name,
        data,
      }),
    removeComponent: ({
      state,
      entity,
    }: {
      state: State
      entity: Entity
    }) =>
      removeComponent({
        state,
        entity,
        name,
      }),
  }

  return crud
}
