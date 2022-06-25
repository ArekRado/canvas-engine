import { componentName } from '../../component/componentName'
import { Material } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<Material>({ name: componentName.material })

export const getMaterial = crud.getComponent
export const createMaterial = crud.createComponent
export const updateMaterial = crud.updateComponent
export const removeMaterial = crud.removeComponent
