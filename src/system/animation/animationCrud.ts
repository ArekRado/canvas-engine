import { componentName } from '../../component/componentName'
import { Animation } from '../../type'
import { createComponentCrud } from '../../util/createComponentCrud'

const crud = createComponentCrud<Animation.AnimationComponent>({ name: componentName.animation })

export const getAnimation = crud.getComponent
export const createAnimation = crud.createComponent
export const updateAnimation = crud.updateComponent
export const removeAnimation = crud.removeComponent
