import { defaultCollideCircle } from '../util/defaultComponents';
import { createComponent } from './createComponent';
import { CollideCircle } from '../type';

export const collideCircle = createComponent<CollideCircle['data']>(
  'collideCircle',
  {
    defaultData: defaultCollideCircle,
    animatedProperties: [
      { path: 'radius', type: 'number' },
      { path: 'position', type: 'Vector2D' },
    ],
  },
)