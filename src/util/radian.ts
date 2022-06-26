const cache1 = 180 / Math.PI
const cache2 = Math.PI / 180

export const radiansToDegrees = (radians: number) => radians * cache1

export const degreesToRadians = (degrees: number) => degrees * cache2
