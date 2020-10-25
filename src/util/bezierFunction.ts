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

export const linear = (t) => t
// accelerating from zero velocity
export const easeInQuad = (t) => t * t
// decelerating to zero velocity
export const easeOutQuad = (t) => t * (2.0 - t)
// acceleration until halfway, then deceleration
export const easeInOutQuad = (t) =>
  t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t
// accelerating from zero velocity
export const easeInCubic = (t) => t * t * t
// decelerating to zero velocity
export const easeOutCubic = (t) => (t - 1.0) * t * t + 1.0
// acceleration until halfway, then deceleration
export const easeInOutCubic = (t) =>
  t < 0.5
    ? 4.0 * t * t * t
    : (t - 1.0) * (2.0 * t - 2.0) * (2.0 * t - 2.0) + 1.0
// accelerating from zero velocity
export const easeInQuart = (t) => t * t * t * t
// decelerating to zero velocity
export const easeOutQuart = (t) => 1.0 - (t - 1.0) * t * t * t
// acceleration until halfway, then deceleration
export const easeInOutQuart = (t) =>
  t < 0.5 ? 8.0 * t * t * t * t : 1.0 - 8.0 * (t - 1.0) * t * t * t
// accelerating from zero velocity
export const easeInQuint = (t) => t * t * t * t * t
// decelerating to zero velocity
export const easeOutQuint = (t) => 1.0 + (t - 1.0) * t * t * t * t
// acceleration until halfway, then deceleration
export const easeInOutQuint = (t) =>
  t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 + 16.0 * (t - 1.0) * t * t * t * t

// export const Bezier =  p = (1-t)^3 *P0 + 3*t*(1-t)^2*P1 + 3*t^2*(1-t)*P2 + t^3*P3

export const getValue = (
  timingFunction: TimingFunction,
  value: number,
): number => {
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
