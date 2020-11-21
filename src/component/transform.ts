import { defaultTransform } from '../util/defaultComponents';
import { createComponent } from './createComponent';
import { Transform } from '../type';

export const transform = createComponent<Transform>('transform', {
  defaultData: defaultTransform,
  animatedProperties: [
    { path: 'rotation', type: 'number' },
    { path: 'localRotation', type: 'number' },
    { path: 'scale', type: 'Vector2D' },
    { path: 'localScale', type: 'Vector2D' },
    { path: 'position', type: 'Vector2D' },
    { path: 'localPosition', type: 'Vector2D' },
  ],
})