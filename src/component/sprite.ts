import { defaultSprite } from '../util/defaultComponents';
import { createComponent } from './createComponent';
import { Sprite } from '../type';

export const sprite = createComponent<Sprite['data']>('sprite', {
  defaultData: defaultSprite,
  animatedProperties: [],
})