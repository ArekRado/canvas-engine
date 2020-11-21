import { defaultAnimation } from '../util/defaultComponents';
import { createComponent } from './createComponent';
import { Animation } from '../type';

export const animation = createComponent<Animation>('animation', {
  defaultData: defaultAnimation,
  animatedProperties: [],
})