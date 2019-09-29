export type Vector2D = {
  x: number
  y: number
}

type Vector = (x: number, y: number) => Vector2D
export const vector: Vector = (x, y) => ({ x, y })

type VectorZero = () => Vector2D
export const vectorZero: VectorZero = () => vector(0, 0)

type VectorUp = () => Vector2D
export const vectorUp: VectorUp = () => vector(0, 1)

type VectorRight = () => Vector2D
export const vectorRight: VectorRight = () => vector(1, 0)

type VectorDown = () => Vector2D
export const vectorDown: VectorDown = () => vector(0, -1)

type VectorLeft = () => Vector2D
export const vectorLeft: VectorLeft = () => vector(-1, 0)

type VectorOne = () => Vector2D
export const vectorOne: VectorOne = () => vector(1, 1)

type Add = (v1: Vector2D, v2: Vector2D) => Vector2D
export const add: Add = (v1, v2) => vector(v1.x + v2.x, v1.y + v2.y)

type Sub = (v1: Vector2D, v2: Vector2D) => Vector2D
export const sub: Sub = (v1, v2) => vector(v1.x - v2.x, v1.y - v2.y)

type Divide = (v1: Vector2D, v2: Vector2D) => Vector2D
export const divide: Divide = (v1, v2) => vector(v1.x / v2.y, v1.y / v2.y)

type Multiply = (v1: Vector2D, v2: Vector2D) => Vector2D
export const multiply: Multiply = (v1, v2) => vector(v1.x * v2.x, v1.y * v2.y)

type Scale = (scalar: number, v: Vector2D) => Vector2D
export const scale: Scale = (scalar, v) => vector(v.x * scalar, v.y * scalar)

type Magnitude = (v: Vector2D) => number
export const magnitude: Magnitude = v =>
  Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))

type Distance = (v1: Vector2D, v2: Vector2D) => number
export const distance: Distance = (v1, v2) => magnitude(sub(v1, v2))

type Clamp = (v: Vector2D, vMagnitude: number) => Vector2D
export const clamp: Clamp = (v, vMagnitude) => {
  var ratio = magnitude(v) / vMagnitude
  return vector(v.x / ratio, v.y / ratio)
}

type Equals = (v1: Vector2D, v2: Vector2D) => boolean
export const equals: Equals = (v1, v2) => v1.x === v2.x && v1.y === v2.y

type FromArray = (arrayOfVectors: [number, number]) => Vector2D
export const fromArray: FromArray = arrayOfVectors =>
  vector(arrayOfVectors[0], arrayOfVectors[1])

type ToArray = (v: Vector2D) => [number, number]
export const toArray: ToArray = v => [v.x, v.y]

type Dot = (v1: Vector2D, v2: Vector2D) => number
export const dot: Dot = (v1, v2) => v1.x * v2.x + v1.y * v2.y

type Angle = (v1: Vector2D, v2: Vector2D) => number
export const angle: Angle = (v1, v2) =>
  Math.acos(dot(normalize(v1), normalize(v2)))

type AngleDeg = (v1: Vector2D, v2: Vector2D) => number
export const angleDeg: AngleDeg = (v1, v2) => angle(v1, v2) * (180 / Math.PI)

type Limit = (v1: Vector2D, v2: Vector2D) => number
export const limit: Limit = (v1, v2) =>
  Math.acos(dot(normalize(v1), normalize(v2)))

type Normalize = (v: Vector2D) => Vector2D
export const normalize: Normalize = (v: Vector2D): Vector2D => clamp(v, 1)
