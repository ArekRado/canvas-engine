import { componentName } from '../../component/componentName'
import { Time } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<Time>({
  name: componentName.time,
})

export const getTime = crud.getComponent
export const createTime = crud.createComponent
export const updateTime = crud.updateComponent
export const removeTime = crud.removeComponent
