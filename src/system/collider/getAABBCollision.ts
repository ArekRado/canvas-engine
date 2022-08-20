import { RectangleContour } from '../../type'

export const getAABBCollision = ({
  rectangle1: [r1x1, r1y1, r1x2, r1y2],
  rectangle2: [r2x1, r2y1, r2x2, r2y2],
}: {
  rectangle1: RectangleContour
  rectangle2: RectangleContour
}) => r1x1 <= r2x2 && r1x2 >= r2x1 && r1y1 <= r2y2 && r1y2 >= r2y1
