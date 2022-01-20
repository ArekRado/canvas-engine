//stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
type Clamp = (params: { value: number; min: number; max: number }) => number;
export const clamp: Clamp = ({ value, min, max }) =>
  value <= min 
    ? min : value >= max 
      ? max : value;
