import { componentName } from '../../component/componentName'
import { Transform } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<Transform>({
  name: componentName.transform,
})

export const getTransform = crud.getComponent
export const createTransform = crud.createComponent
export const updateTransform = crud.updateComponent
export const removeTransform = crud.removeComponent
