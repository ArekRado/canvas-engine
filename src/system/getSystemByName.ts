import { System } from '../type'

export const getSystemByComponentName = (name: string, system: Array<System<unknown>>) =>
  system.find((x) => x.componentName === name)
