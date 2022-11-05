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
  }

  // if (
  //   isEqual(previousComponent?.diffuseColor, component.diffuseColor) &&
  //   component.diffuseColor
  // ) {
  //   ;(material as any).diffuseColor = new Color3(
  //     component.diffuseColor[0],
  //     component.diffuseColor[1],
  //     component.diffuseColor[2],
  //   )
  // }

  // if (
  //   isEqual(previousComponent?.specularColor, component.specularColor) &&
  //   component.specularColor
  // ) {
  //   ;(material as any).specularColor = new Color3(
  //     component.specularColor[0],
  //     component.specularColor[1],
  //     component.specularColor[2],
  //   )
  // }

  // if (
  //   isEqual(previousComponent?.emissiveColor, component.emissiveColor) &&
  //   component.emissiveColor
  // ) {
  //   ;(material as any).emissiveColor = new Color3(
  //     component.emissiveColor[0],
  //     component.emissiveColor[1],
  //     component.emissiveColor[2],
  //   )
  // }

  // if (
  //   isEqual(previousComponent?.ambientColor, component.ambientColor) &&
  //   component.ambientColor
  // ) {
  //   ;(material as any).ambientColor = new Color3(
  //     component.ambientColor[0],
  //     component.ambientColor[1],
  //     component.ambientColor[2],
  //   )
  // }

  // // if (isEqual(previousComponent?.alpha, component.alpha) && component.alpha) {
  // //   material.alpha = component.alpha
  // // }

  // // if (
  // //   isEqual(previousComponent?.backFaceCulling, component.backFaceCulling) &&
  // //   component.backFaceCulling
  // // ) {
  // //   material.backFaceCulling = component.backFaceCulling
  // // }

  // // if (
  // //   isEqual(previousComponent?.wireframe, component.wireframe) &&
  // //   component.wireframe
  // // ) {
  // //   material.wireframe = component.wireframe
  // // }

  // if (
  //   isEqual(
  //     previousComponent?.useAlphaFromDiffuseTexture,
  //     component.useAlphaFromDiffuseTexture,
  //   ) &&
  //   component.useAlphaFromDiffuseTexture
  // ) {
  //   ;(material as any).useAlphaFromDiffuseTexture =
  //     component.useAlphaFromDiffuseTexture
  // }

  // if (
  //   isEqual(previousComponent?.diffuseTexture, component.diffuseTexture) &&
  //   component.diffuseTexture
  // ) {
  //   const diffuseTexture = new Texture(
  //     component.diffuseTexture,
  //     sceneRef,
  //     undefined,
  //     undefined,
  //     Texture.NEAREST_NEAREST_MIPLINEAR,
  //   )
  //   ;(material as any).diffuseTexture = diffuseTexture
  //   ;(material as any).diffuseTexture.hasAlpha = true // TODO remove it
  // }

  // if (
  //   isEqual(previousComponent?.bumpTexture, component.bumpTexture) &&
  //   component.bumpTexture
  // ) {
  //   const bumpTexture = new Texture(
  //     component.bumpTexture,
  //     sceneRef,
  //     undefined,
  //     undefined,
  //     Texture.NEAREST_NEAREST_MIPLINEAR,
  //   )
  //   ;(material as any).bumpTexture = bumpTexture
  // }

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
