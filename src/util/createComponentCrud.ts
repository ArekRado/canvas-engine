import { createComponent } from '../component/createComponent'
import { getComponent } from '../component/getComponent'
import { removeComponent } from '../component/removeComponent'
import { updateComponent } from '../component/updateComponent'
import { AnyState, Entity } from '../type'

export const getComponentCrud = <Component>({ name }: { name: string }) => {
  type CRUD = {
    getComponent: (params: {
      state: AnyState
      entity: Entity
    }) => ReturnType<typeof getComponent>
    updateComponent: (params: {
      state: AnyState
      entity: Entity
      update: Parameters<typeof updateComponent>[0]['update']
    }) => ReturnType<typeof updateComponent>
    createComponent: (params: {
      state: AnyState
      entity: Entity
      data: Component
    }) => ReturnType<typeof createComponent>
    removeComponent: (params: {
      state: AnyState
      entity: Entity
    }) => ReturnType<typeof removeComponent>
  }

  const crud: CRUD = {
    getComponent: ({ state, entity }) =>
      getComponent<Component>({
        state,
        entity,
        name,
      }),
    updateComponent: ({ state, entity, update }) =>
      updateComponent<Component>({
        state,
        entity,
        name,
        update,
      }),
    createComponent: ({ state, entity, data }) =>
      createComponent<Component>({
        state,
        entity,
        name,
        data,
      }),
    removeComponent: ({ state, entity }) =>
      removeComponent({
        state,
        entity,
        name,
      }),
  }

  return crud
}
