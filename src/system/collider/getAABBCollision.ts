import { RectangleContour } from '../../type'

export const getAABBCollision = ({
  rectangle1: [r1x1, r1y1, r1x2, r1y2],
  rectangle2: [r2x1, r2y1, r2x2, r2y2],
}: // rectangle1: {
//   position: [x1, y1],
//   size: [size1x, size1y],
// },
// rectangle2: {
//   position: [x2, y2],
//   size: [size2x, size2y],
// },
{
  rectangle1: RectangleContour
  rectangle2: RectangleContour
}) => r1x1 <= r2x2 && r1x2 >= r2x1 && r1y1 <= r2y2 && r1y2 >= r2y1
// r1x1 <= x2 + size2x &&
// x1 + size1x >= x2 &&
// y1 <= y2 + size2y &&
// y1 + size1y >= y2
