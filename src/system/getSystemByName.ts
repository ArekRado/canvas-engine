import { System } from '../type'

export const getSystemByName = (name: string, system: Array<System<unknown>>) =>
  system.find((x) => x.componentName === name)
