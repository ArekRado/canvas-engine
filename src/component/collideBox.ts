import { defaultCollideBox } from '../util/defaultComponents';
import { createComponent } from './createComponent';
import { CollideBox } from '../type';

export const collideBox = createComponent<CollideBox>('collideBox', {
  defaultData: defaultCollideBox,
  animatedProperties: [
    { path: 'size', type: 'Vector2D' },
    { path: 'position', type: 'Vector2D' },
  ],
})