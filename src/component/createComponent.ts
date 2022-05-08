// Is it good to force users to use createComponent instead of setComponent?
// - it's not DX friendly
// - but it forces developers to create entity and manage lifecycle

import { getEntity } from '../entity/getEntity'
import { AnyState, Component } from '../type'
import { setComponent } from './setComponent'

// - probably it's easier to understand for new developers how create/update works - set is not easy
export const createComponent = <Data, State extends AnyState = AnyState>({
  state,
  data,
}: {
  state: State
  data: Component<Data>
}): State => {
  const entity = getEntity({
    state,
    entity: data.entity,
  })

  if (entity) {
    return setComponent({
      state,
      data,
    })
  } else if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    console.warn(
      `Cann't find entity for component ${data.name}. Use createEntity before.`,
    )
  }

  return state
}
