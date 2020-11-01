export type TimingFunction =
  | 'Linear'
  | 'EaseInQuad'
  | 'EaseOutQuad'
  | 'EaseInOutQuad'
  | 'EaseInCubic'
  | 'EaseOutCubic'
  | 'EaseInOutCubic'
  | 'EaseInQuart'
  | 'EaseOutQuart'
  | 'EaseInOutQuart'
  | 'EaseInQuint'
  | 'EaseOutQuint'
  | 'EaseInOutQuint'
  | 'CubicBezier' // todo  (number, number, number, number);

export type CommonBezierFunction = (value: number) => number

export const linear: CommonBezierFunction = (t) => t
// accelerating from zero velocity
export const easeInQuad: CommonBezierFunction = (t) => t * t
// decelerating to zero velocity
export const easeOutQuad: CommonBezierFunction = (t) => t * (2.0 - t)
// acceleration until halfway, then deceleration
export const easeInOutQuad: CommonBezierFunction = (t) => (t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t)
// accelerating from zero velocity
export const easeInCubic: CommonBezierFunction = (t) => t * t * t
// decelerating to zero velocity
export const easeOutCubic: CommonBezierFunction = (t) => (t - 1.0) * t * t + 1.0
// acceleration until halfway, then deceleration
export const easeInOutCubic: CommonBezierFunction = (t) =>
  t < 0.5 ? 4.0 * t * t * t : (t - 1.0) * (2.0 * t - 2.0) * (2.0 * t - 2.0) + 1.0
// accelerating from zero velocity
export const easeInQuart: CommonBezierFunction = (t) => t * t * t * t
// decelerating to zero velocity
export const easeOutQuart: CommonBezierFunction = (t) => 1.0 - (t - 1.0) * t * t * t
// acceleration until halfway, then deceleration
export const easeInOutQuart: CommonBezierFunction = (t) =>
  t < 0.5 ? 8.0 * t * t * t * t : 1.0 - 8.0 * (t - 1.0) * t * t * t
// accelerating from zero velocity
export const easeInQuint: CommonBezierFunction = (t) => t * t * t * t * t
// decelerating to zero velocity
export const easeOutQuint: CommonBezierFunction = (t) => 1.0 + (t - 1.0) * t * t * t * t
// acceleration until halfway, then deceleration
export const easeInOutQuint: CommonBezierFunction = (t) =>
  t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 + 16.0 * (t - 1.0) * t * t * t * t

// export const Bezier =  p = (1-t)^3 *P0 + 3*t*(1-t)^2*P1 + 3*t^2*(1-t)*P2 + t^3*P3

export const getValue = (timingFunction: TimingFunction, value: number): number => {
  switch (timingFunction) {
    case 'Linear':
      return linear(value)
    case 'EaseInQuad':
      return easeInQuad(value)
    case 'EaseOutQuad':
      return easeOutQuad(value)
    case 'EaseInOutQuad':
      return easeInOutQuad(value)
    case 'EaseInCubic':
      return easeInCubic(value)
    case 'EaseOutCubic':
      return easeOutCubic(value)
    case 'EaseInOutCubic':
      return easeInOutCubic(value)
    case 'EaseInQuart':
      return easeInQuart(value)
    case 'EaseOutQuart':
      return easeOutQuart(value)
    case 'EaseInOutQuart':
      return easeInOutQuart(value)
    case 'EaseInQuint':
      return easeInQuint(value)
    case 'EaseOutQuint':
      return easeOutQuint(value)
    case 'EaseInOutQuint':
      return easeInOutQuint(value)
    case 'CubicBezier':
      return linear(value)
  }
}
