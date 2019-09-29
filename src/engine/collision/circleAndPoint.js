import { distance } from '../../utils/vector'

export const circleAndPoint = (circlePosition, circleRadius, point) =>
  distance(circlePosition, point) <= circleRadius
