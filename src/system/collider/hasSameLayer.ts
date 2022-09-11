import { Collider } from '../../type'

export const hasSameLayer = (
  layer1: Collider['layer'],
  layer2: Collider['layer'],
): string | undefined =>
  layer1.interacts.find((l1) => layer2.belongs.find((l2) => l2 === l1))
