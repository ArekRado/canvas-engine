/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, InternalInitialState, Material } from '../../type'
import { createSystem } from '../createSystem'
import { componentName } from '../../component/componentName'
import {
  Material as ThreeMaterial,
  MeshBasicMaterial,
  TextureLoader,
  LineBasicMaterial,
  LineDashedMaterial,
  MeshDepthMaterial,
  MeshDistanceMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  PointsMaterial,
  ShaderMaterial,
  ShadowMaterial,
  SpriteMaterial,
  Texture,
} from 'three'
import { getScene } from '../../util/state'
import { meshBasicMaterialProperties } from './materialProperties'

let materialObject: Record<Entity, ThreeMaterial | undefined> = {}
export const getThreeMaterial = (entity: Entity): ThreeMaterial | undefined =>
  materialObject[entity]

let loader: TextureLoader | undefined = undefined

const createThreeMaterial = (material: Material) => {
  const { textureUrl, ...rest } = material
  const map: Texture | undefined =
    loader !== undefined && textureUrl !== undefined
      ? loader.load(textureUrl)
      : (rest as unknown as any)?.map

  const materialParams = { ...rest, map }

  switch (materialParams.type) {
    case 'LineBasicMaterial':
      return new LineBasicMaterial(materialParams)
    case 'LineDashedMaterial':
      return new LineDashedMaterial(materialParams)
    case 'MeshBasicMaterial':
      return new MeshBasicMaterial(materialParams)
    case 'MeshDepthMaterial':
      return new MeshDepthMaterial(materialParams)
    case 'MeshDistanceMaterial':
      return new MeshDistanceMaterial(materialParams)
    case 'MeshLambertMaterial':
      return new MeshLambertMaterial(materialParams)
    case 'MeshMatcapMaterial':
      return new MeshMatcapMaterial(materialParams)
    case 'MeshNormalMaterial':
      return new MeshNormalMaterial(materialParams)
    case 'MeshPhongMaterial':
      return new MeshPhongMaterial(materialParams)
    case 'MeshPhysicalMaterial':
      return new MeshPhysicalMaterial(materialParams)
    case 'MeshStandardMaterial':
      return new MeshStandardMaterial(materialParams)
    case 'MeshToonMaterial':
      return new MeshToonMaterial(materialParams)
    case 'PointsMaterial':
      return new PointsMaterial(materialParams)
    case 'ShaderMaterial':
      return new ShaderMaterial(materialParams)
    case 'ShadowMaterial':
      return new ShadowMaterial(materialParams)
    case 'SpriteMaterial':
      return new SpriteMaterial(materialParams)
  }
}

// const isEqual = (
//   a: undefined | number | boolean | string | Array<unknown>,
//   b: undefined | number | boolean | string | Array<unknown>,
// ) => (a ?? '').toString() !== (b ?? '').toString()

// todo have fun with testing this xD
const setupMaterialData = ({
  entity,
  component,
  // previousComponent,
  state,
}: {
  entity: Entity
  component: Material
  previousComponent: Material | undefined
  state: InternalInitialState
}) => {
  const sceneRef = getScene()
  if (!sceneRef) {
    return state
  }

  const material = getThreeMaterial(entity)

  if (loader === undefined && component.textureUrl !== undefined) {
    loader = new TextureLoader()
  }

  if (!material) {
    materialObject = {
      ...materialObject,
      [entity]: createThreeMaterial(component),
    }

    if (component.textureUrl) {
      ;(materialObject[entity] as Material).textureUrl = component.textureUrl
    }

    return state
  } else if (component.type === 'MeshBasicMaterial') {
    if (
      loader &&
      component.textureUrl &&
      (material as Material).textureUrl !== component.textureUrl
    ) {
      ;(material as MeshBasicMaterial).map = loader.load(component.textureUrl)
      material.needsUpdate = true
    }

    for (let i = 0; i < meshBasicMaterialProperties.length; i++) {
      const property = meshBasicMaterialProperties[i]

      if (
        (material as MeshBasicMaterial)[property] !==
        (component as MeshBasicMaterial)[property]
      ) {
        if (property === 'color' && component.color !== undefined) {
          ;(material as MeshBasicMaterial)?.color.set(component.color)
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // ;(material as MeshBasicMaterial)[property] = component[property]
        }
      }
    }

    // material.needsUpdate = true
  }

  return state
}

export const materialSystem = (state: InternalInitialState) =>
  createSystem<Material, InternalInitialState>({
    state,
    name: componentName.material,
    componentName: componentName.material,
    create: ({ state, component, entity }) => {
      state = setupMaterialData({
        entity,
        component,
        previousComponent: undefined,
        state,
      })

      return state
    },
    update: ({ state, component, previousComponent, entity }) => {
      state = setupMaterialData({
        entity,
        component,
        previousComponent,
        state,
      })

      return state
    },
    remove: ({ state, entity }) => {
      const material = materialObject[entity]
      material?.dispose()

      materialObject = {
        ...materialObject,
        [entity]: undefined,
      }

      return state
    },
  })
