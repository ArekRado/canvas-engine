import { componentName } from '../../component/componentName'
import { MouseInteraction } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<MouseInteraction>({
  name: componentName.animation,
})

export const getMouseInteraction = crud.getComponent
export const createMouseInteraction = crud.createComponent
export const updateMouseInteraction = crud.updateComponent
export const removeMouseInteraction = crud.updateComponent
