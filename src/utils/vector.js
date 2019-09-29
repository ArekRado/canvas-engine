export const vector = (x, y) => ({ x, y })

export const vectorZero = () => vector(0, 0)

export const vectorUp = () => vector(0, 1)

export const vectorRight = () => vector(1, 0)

export const vectorDown = () => vector(0, -1)

export const vectorLeft = () => vector(-1, 0)

export const vectorOne = () => vector(1, 1)

export const add = (v1, v2) => vector(v1.x + v2.x, v1.y + v2.y)

export const sub = (v1, v2) => vector(v1.x - v2.x, v1.y - v2.y)

export const divide = (v1, v2) => vector(v1.x / v2.y, v1.y / v2.y)

export const multiply = (v1, v2) => vector(v1.x * v2.x, v1.y * v2.y)

export const scale = (scalar, v) => vector(v.x * scalar, v.y * scalar)

export const magnitude = v => Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))

export const distance = (v1, v2) => magnitude(sub(v1, v2))

export const clamp = (v, vMagnitude) => {
  var ratio = magnitude(v) / vMagnitude
  return vector(v.x / ratio, v.y / ratio)
}

export const equals = (v1, v2) => v1.x === v2.x && v1.y === v2.y

export const fromArray = arrayOfVectors =>
  vector(arrayOfVectors[0], arrayOfVectors[1])

export const toArray = v => [v.x, v.y]

export const dot = (v1, v2) => v1.x * v2.x + v1.y * v2.y

export const angle = (v1, v2) => Math.acos(dot(normalize(v1), normalize(v2)))

export const angleDeg = (v1, v2) => angle(v1, v2) * (180 / Math.PI)

export const limit = (v1, v2) => Math.acos(dot(normalize(v1), normalize(v2)))

export const normalize = v => clamp(v, 1)
