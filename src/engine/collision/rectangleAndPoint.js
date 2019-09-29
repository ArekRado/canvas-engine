export const rectangleAndPoint = (rec, point) =>
  point.x >= rec.v1.x &&
  point.x <= rec.v2.x &&
  point.y >= rec.v1.y &&
  point.y <= rec.v2.y
