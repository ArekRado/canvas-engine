import { InternalInitialState, Transform, Mesh, Entity } from '../../type'
import { createSystem } from '../createSystem'
import { componentName } from '../../component/componentName'
import { getMaterial } from '../material/materialCrud'
import { getTransform } from '../transform/transformCrud'
import { Material, Mesh as ThreeMesh, PlaneGeometry } from 'Three'
import { materialObject } from '../material/material'

export const meshObject: Record<Entity, ThreeMesh | undefined> = {}

export const updateMeshTransform = ({
  mesh,
  transform,
}: {
  mesh: ThreeMesh
  transform: Transform
}) => {
  mesh.position.x = transform.position[0]
  mesh.position.y = transform.position[1]
  mesh.position.z = transform.position[2]

  mesh.rotation.x = transform.rotation
  mesh.rotation.y = 0
  mesh.rotation.z = 0

  mesh.scale.x = transform.scale[0]
  mesh.scale.y = transform.scale[1]
  mesh.scale.z = transform.scale[2] ?? 1
}

const createOrUpdateMesh = ({
  mesh,
  // meshInstance,
  material,
}: {
  mesh: Mesh
  meshInstance: ThreeMesh | undefined
  material: Material | undefined
}) => {
  // const { PlaneGeometry, sceneRef, Vector3, Color4 } = state.three
  // if (!(PlaneGeometry && sceneRef && Vector3 && Color4)) {
  //   if (process.env.NODE_ENV === 'development') {
  //     console.warn('To use Mesh engine requires all properties to be defined', {
  //       PlaneGeometry,
  //       sceneRef,
  //       Vector3,
  //       Color4,
  //     })
  //   }

  //   return undefined
  // }

  switch (mesh.data.type) {
    case 'plane':
      // lol no updates XD
      
      return new ThreeMesh(
        new PlaneGeometry(mesh.data.width, mesh.data.height),
        material,
      )
    case 'lines':
      return new ThreeMesh(new PlaneGeometry(1, 1), material)

    //   newMesh = meshBuilder.CreateLines('lines', {
    //     instance: meshInstance as LinesMesh,
    //     updatable: mesh.updatable,
    //     points: mesh.data.points.reduce((acc, point) => {
    //       acc.push(new Vector3(point[0], point[1], 0))
    //       return acc
    //     }, [] as any[] /** XD */),
    //     colors: mesh.data.colors.reduce((acc, color) => {
    //       acc.push(new Color4(color[0], color[1], color[2], color[3]))
    //       return acc
    //     }, [] as any[] /** XD */),
    //   })

    // break
  }
}

export const meshSystem = (state: InternalInitialState) =>
  createSystem<Mesh, InternalInitialState>({
    state,
    name: componentName.mesh,
    componentName: componentName.mesh,
    create: ({ state, component, entity }) => {
      const { sceneRef } = state.three
      if (!sceneRef) return state

      const materialComponent = getMaterial({
        state,
        entity,
      })

      const material = materialObject[entity]

      if (!materialComponent && component.data.type !== 'lines') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Mesh has been created without material component. Mesh entity: ${entity}`,
          )
        }
      }

      const mesh = createOrUpdateMesh({
        mesh: component,
        meshInstance: undefined,
        material,
      })

      if (!mesh) {
        return state
      }

      mesh.name = entity
      meshObject[entity] = mesh

      sceneRef.add(mesh);

      const transform = getTransform({
        state,
        entity,
      })

      if (transform) {
        updateMeshTransform({
          mesh,
          transform,
        })
      }

      return state
    },
    remove: ({ state, entity }) => {
      const sceneRef = state.three.sceneRef
      const mesh = meshObject[entity] //sceneRef.getMeshByUniqueId(parseInt(entity))

      if (sceneRef && mesh) {
        sceneRef.remove(mesh)
        mesh.geometry.dispose()
        // mesh.material.dispose()
        meshObject[entity] = undefined
      }

      return state
    },
    update: ({ state, entity, component }) => {
      const meshInstance = meshObject[entity] // state.three.sceneRef?.getMeshByUniqueId(
      // parseInt(entity),
      // )

      if (meshInstance) {
        createOrUpdateMesh({
          mesh: component,
          meshInstance,
          material: materialObject[entity],
        })

        const transform = getTransform({ state, entity })
        if (transform) {
          updateMeshTransform({
            mesh: meshInstance,
            transform,
          })
        }
      }

      return state
    },
    // tick: ({ state, entity }) => {
    //   const mesh = state.babylonjs.sceneRef?.getMeshByUniqueId(parseInt(entity))
    //   const transform = getTransform({
    //     state,
    //     entity,
    //   })

    //   if (mesh && transform) {
    //     updateMeshTransform({
    //       mesh,
    //       transform,
    //     })
    //   }

    //   return state
    // },
  })
