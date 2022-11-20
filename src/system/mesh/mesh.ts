import { InternalInitialState, Transform, Mesh, Entity } from '../../type'
import { createSystem } from '../createSystem'
import { componentName } from '../../component/componentName'
import { getMaterial } from '../material/materialCrud'
import { getTransform } from '../transform/transformCrud'
import {
  BufferGeometry,
  Group,
  Line,
  Material,
  Mesh as ThreeMesh,
  PlaneGeometry,
  Vector3,
} from 'three'
import { getThreeMaterial } from '../material/material'
import { getScene } from '../../util/state'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type MeshType = ThreeMesh | Line | Group
const meshObject: Record<Entity, MeshType | undefined> = {}

export const getThreeMesh = (entity: Entity): MeshType | undefined =>
  meshObject[entity]

export const updateMeshTransform = ({
  mesh,
  transform,
}: {
  mesh: MeshType
  transform: Transform
}) => {
  mesh.position.x = transform.position[0]
  mesh.position.y = transform.position[1]
  mesh.position.z = transform.position[2]

  mesh.rotation.x = transform.rotation[0]
  mesh.rotation.y = transform.rotation[1]
  mesh.rotation.z = transform.rotation[2]

  mesh.scale.x = transform.scale[0]
  mesh.scale.y = transform.scale[1]
  mesh.scale.z = transform.scale[2] ?? 1
}

const createOrUpdateMesh = ({
  mesh,
  meshInstance,
  material,
}: {
  mesh: Mesh
  meshInstance: MeshType | undefined
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

  if (meshInstance) {
    return undefined
  }

  switch (mesh.type) {
    case 'plane':
      return new ThreeMesh(
        new PlaneGeometry(
          mesh.width,
          mesh.height,
          mesh.widthSegments,
          mesh.heightSegments,
        ),
        material,
      )
    case 'lines':
      const points = mesh.points.reduce((acc, point) => {
        acc.push(new Vector3(point[0], point[1], 0))
        return acc
      }, [] as Vector3[])

      const geometry = new BufferGeometry().setFromPoints(points)
      return new Line(geometry, material)
    case 'gltf':
      const loader = new GLTFLoader()

      loader.load(mesh.meshUrl, (gltf) => {
        getScene()?.add(gltf.scene)

        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Group
        // gltf.scenes; // Array<THREE.Group>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object
      })

      return undefined
  }
}

export const meshSystem = (state: InternalInitialState) =>
  createSystem<Mesh, InternalInitialState>({
    state,
    name: componentName.mesh,
    componentName: componentName.mesh,
    create: ({ state, component, entity }) => {
      const sceneRef = getScene()
      if (!sceneRef) return state

      const materialComponent = getMaterial({
        state,
        entity,
      })

      if (!materialComponent && component.type !== 'lines') {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Mesh has been created without material component. Mesh entity: ${entity}`,
          )
        }
      }

      const mesh = createOrUpdateMesh({
        mesh: component,
        meshInstance: undefined,
        material: getThreeMaterial(entity),
      })

      if (!mesh) {
        return state
      }

      mesh.name = entity
      meshObject[entity] = mesh

      sceneRef.add(mesh)

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
      const sceneRef = getScene()
      const mesh = getThreeMesh(entity)

      if (sceneRef && mesh) {
        sceneRef.remove(mesh)
        if (mesh instanceof ThreeMesh && mesh.geometry) {
          mesh.geometry.dispose()
        }
        meshObject[entity] = undefined
      }

      return state
    },
    update: ({ state, entity, component }) => {
      const meshInstance = getThreeMesh(entity)

      if (meshInstance) {
        createOrUpdateMesh({
          mesh: component,
          meshInstance,
          material: getThreeMaterial(entity),
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
