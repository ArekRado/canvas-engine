import { EmptyState, UnknownComponent } from '../type'

export const getEmptyState = (): EmptyState<
  UnknownComponent,
  Array<never>
> => ({
  entity: new Map(),
  component: {},
  globalSystem: [],
  system: [],
})
