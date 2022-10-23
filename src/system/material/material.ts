/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, InternalInitialState, Material } from '../../type'
import { createSystem } from '../createSystem'
import { componentName } from '../../component/componentName'
import {
  Material as ThreeMaterial,
  MeshBasicMaterial,
  TextureLoader,
} from 'Three'
import { scene } from '../../util/state'

export let materialObject: Record<Entity, ThreeMaterial | undefined> = {}

let loader: TextureLoader | undefined = undefined

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
  const sceneRef = scene().get()
  if (!sceneRef) return state

  let material = materialObject[entity]

  if (loader === undefined && component.textureUrl !== undefined) {
    loader = new TextureLoader()
  }

  if (!material) {
    const { textureUrl, ...materialParams } = component

    material = new MeshBasicMaterial(
      {
        ...materialParams,
        map:
          loader !== undefined && textureUrl !== undefined
            ? loader.load(textureUrl)
            : undefined,
      },
      //   {
      //   color: 0xffff00,
      //   side: FrontSide,
      // }
    )

    materialObject = {
      ...materialObject,
      [entity]: material,
    }
    // materialObject[entity] = material
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
        [entity]: undefined
      }

      return state
    },
  })
