import { componentName } from '../../component/componentName'
import { Transform } from '../../type'
import { createComponentCrud } from '../../util/createComponentCrud'

const crud = createComponentCrud<Transform>({
  name: componentName.transform,
})

export const getTransform = crud.getComponent
export const createTransform = crud.createComponent
export const updateTransform = crud.updateComponent
export const removeTransform = crud.removeComponent
