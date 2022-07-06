import { componentName } from '../../component/componentName'
import { Time } from '../../type'
import { createComponentCrud } from '../../util/createComponentCrud'

const crud = createComponentCrud<Time>({
  name: componentName.time,
})

export const getTime = crud.getComponent
export const createTime = crud.createComponent
export const updateTime = crud.updateComponent
export const removeTime = crud.removeComponent
