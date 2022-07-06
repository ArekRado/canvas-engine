import { componentName } from '../../component/componentName'
import { MouseInteraction } from '../../type'
import { createComponentCrud } from '../../util/createComponentCrud'

const crud = createComponentCrud<MouseInteraction>({
  name: componentName.mouseInteraction,
})

export const getMouseInteraction = crud.getComponent
export const createMouseInteraction = crud.createComponent
export const updateMouseInteraction = crud.updateComponent
export const removeMouseInteraction = crud.removeComponent
