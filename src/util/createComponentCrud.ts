import { createComponent } from '../component/createComponent'
import { getComponent } from '../component/getComponent'
import { removeComponent } from '../component/removeComponent'
import { updateComponent } from '../component/updateComponent'
import { AnyState, Entity } from '../type'

export const createComponentCrud = <
  Component,
  State extends AnyState = AnyState,
>({
  name,
}: {
  name: string
}) => {
  const crud = {
    getComponent:({ state, entity }: { state: State; entity: Entity }) =>
      getComponent<Component, State>({
        state,
        entity,
        name,
      }),
    updateComponent: ({
      state,
      entity,
      update,
      callSystemUpdateMethod = true,
    }: {
      state: State
      entity: Entity
      update: (component: Component) => Partial<Component>
      callSystemUpdateMethod?: boolean
    }) =>
      updateComponent<Component, State>({
        state,
        entity,
        name,
        update,
        callSystemUpdateMethod,
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
    removeComponent: ({ state, entity }: { state: State; entity: Entity }) =>
      removeComponent({
        state,
        entity,
        name,
      }),
  }

  return crud
}
