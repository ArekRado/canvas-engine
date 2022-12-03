import { componentName } from '../../component/componentName'
import { Sprite } from '../../type'
import { createComponentCrud } from '../../util/createComponentCrud'

const crud = createComponentCrud<Sprite>({ name: componentName.sprite })

export const getSprite = crud.getComponent
export const createSprite = crud.createComponent
export const updateSprite = crud.updateComponent
export const removeSprite = crud.removeComponent
