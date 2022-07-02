import { Collider } from '../../type'

export const hasSameLayer = (
  layers1: Collider['layers'],
  layers2: Collider['layers'],
) => layers1.some((l1) => layers2.find((l2) => l2 === l1))
