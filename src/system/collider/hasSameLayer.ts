import { Collider } from '../../type'

export const hasSameLayer = (
  layer1: Collider['layer'],
  layer2: Collider['layer'],
) => layer1.interacts.some((l1) => layer2.belongs.find((l2) => l2 === l1))
