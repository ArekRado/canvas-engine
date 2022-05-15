// Is it good to force users to use createComponent instead of setComponent?
// - it's not DX friendly
// - but it forces developers to create entity and manage lifecycle

import { AnyState, Entity } from '../type'
import { setComponent } from './setComponent'

// - probably it's easier to understand for new developers how create/update works - set is not easy
export const createComponent = <Data, State extends AnyState = AnyState>({
  state,
  data,
  entity,
  name,
}: {
  state: State
  data: Data
  entity: Entity
  name: Entity
}): State => {
  return setComponent({
    state,
    data,
    entity,
    name,
  })
}
