import { componentName } from '../../component/componentName'
import { Mesh } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<Mesh>({ name: componentName.mesh })

export const getMesh = crud.getComponent
export const createMesh = crud.createComponent
export const updateMesh = crud.updateComponent
export const removeMesh = crud.removeComponent
