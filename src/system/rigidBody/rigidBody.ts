import { AnyState, RigidBody, Vector3D } from '../../type'
import { createSystem, systemPriority } from '../createSystem'
import { componentName } from '../../component/componentName'
import {
  add,
  dot,
  magnitude,
  scale,
  sub,
  vector,
  Vector2D,
} from '@arekrado/vector-2d'
import { getRigidBody } from './rigidBodyCrud'
import { getTransform } from '../transform/transformCrud'
import { getCollider } from '../collider/colliderCrud'
import { FIXED_TICK_TIME } from '../../util/runOneFrame'
import { collisions } from '../collider/collider'

const FPS = 1000 / 60

export const getElasticCollisionForces = ({
  m1,
  v1,
  m2,
  v2,
  position1,
  position2,
}: {
  m1: number
  v1: Vector2D
  m2: number
  v2: Vector2D

  position1: Vector3D
  position2: Vector2D
}) => {
  const position11 = vector(position1[0], position1[1])

  // Two-dimensional elastic collision, formula with vectors
  // https://en.wikipedia.org/wiki/Elastic_collision
  const subP1P2 = sub(position11, position2)
  const a = (2 * m2) / (m1 + m2)
  const aa = dot(sub(v1, v2), subP1P2) / Math.pow(magnitude(subP1P2), 2)

  const subP2P1 = sub(position2, position11)
  const b = (2 * m1) / (m1 + m2)
  const bb = dot(sub(v2, v1), subP2P1) / Math.pow(magnitude(subP2P1), 2)

  return {
    force1: sub(v1, scale(a * aa, subP1P2)),
    force2: sub(v2, scale(b * bb, subP2P1)),
  }
}

export const getElasticCollisionForcesStatic = ({
  v1,
  v2,
  position1,
  position2,
}: {
  v1: Vector2D
  v2: Vector2D
  position1: Vector3D
  position2: Vector2D
}) => {
  const subP1P2 = sub(
    vector(position1[0], position1[1]),
    vector(position2[0], position2[1]),
  )
  const aa = dot(sub(v1, v2), subP1P2) / Math.pow(magnitude(subP1P2), 2)

  return sub(v1, scale(2 * aa, subP1P2))
}

const applyFrictionToForce = ({
  friction,
  force,
}: {
  friction: number
  force: Vector2D
}): Vector2D => {
  // Friction same as force depends on a time.delta
  const frictionPerSecond = friction * (FIXED_TICK_TIME / FPS)
  const frictionAbs = Math.abs(frictionPerSecond)
  const x = force[0]
  const y = force[1]

  return [
    Math.abs(x) > frictionAbs
      ? x > 0
        ? x - frictionPerSecond
        : x + frictionPerSecond
      : 0,
    Math.abs(y) > frictionAbs
      ? y > 0
        ? y - frictionPerSecond
        : y + frictionPerSecond
      : 0,
  ]
}

// const hadSameCollisionInPreviousTick = ({
//   collisionEntity,
//   collider,
// }: {
//   collisionEntity: Entity
//   collider: Collider
// }) =>
//   collider._previousCollision?.colliderEntity
//     ? collider._previousCollision.colliderEntity === collisionEntity
//     : false

// const pushBackStuckRigidbodies = ({
//   state,
//   entity,
//   collision,
//   collider,
//   transform,
//   force,
// }: {
//   state: AnyState
//   entity: Entity
//   collision: NonNullable<Collider['_collision']>
//   collider: Collider
//   transform: Transform
//   force: Vector2D
// }): AnyState => {
//   const elementsStuckInEachOther = hadSameCollisionInPreviousTick({
//     collisionEntity: collision.colliderEntity,
//     collider,
//   })

//   if (elementsStuckInEachOther) {
//     const collisionTransform = getTransform({
//       state,
//       entity: collision.colliderEntity,
//     })

//     const minPushShift = 0.00001
//     const rigiBodiesAreTooClose =
//       distance(
//         transform.position ,
//         collisionTransform?.position ,
//       ) < minPushShift

//     const pushShift = rigiBodiesAreTooClose
//       ? scale(
//           magnitude(force) || minPushShift,
//           sub(
//             transform.position ,
//             collision.intersection.position ,
//           ),
//         )
//       : vector(force[0] * 10, force[0] * 10)

//     state = updateTransform({
//       state,
//       entity,
//       update: (transform) => ({
//         position: add(transform.position , pushShift),
//       }),
//     })
//   }

//   return state
// }

const pushBack = ({
  force,
  position,
}: {
  force: Vector2D
  position: Vector3D
}): Vector3D =>
  applyForceToPosition({
    force: scale(-1, force),
    position: position,
  })

const applyForceToPosition = ({
  force,
  position,
}: {
  force: Vector2D
  position: Vector3D
}): Vector3D => {
  const v2 = add(
    scale(FIXED_TICK_TIME, force),
    vector(position[0], position[1]),
  )

  return [v2[0], v2[1], position[2]]
}

export const rigidBodySystem = (state: AnyState) =>
  createSystem<RigidBody, AnyState>({
    name: componentName.rigidBody,
    componentName: componentName.rigidBody,
    state,
    priority: systemPriority.rigidBody,
    fixedTick: ({ state, entity }) => {
      const component = getRigidBody({
        state,
        entity,
      })

      // Static rigidBody actually have disabled phisics
      if (component?.isStatic) {
        return state
      }
      const transform = getTransform({
        state,
        entity,
      })
      const collider = getCollider({
        state,
        entity,
      })

      if (!collider || !transform || !component) return state

      let force = component.force
      let newPosition = transform.position
      const collision = collisions[entity]

      if (collision) {
        newPosition = pushBack({
          force,
          position: transform.position,
        })

        // has collision so use force to push rigidbody back to previous position
        const collisionRigidBody = getRigidBody({
          state,
          entity: collision.colliderEntity,
        })

        if (collisionRigidBody) {
          if (collisionRigidBody.isStatic) {
            // In elastic collision with static rigidbody mass of static rigidbody doesn't matter
            // we just want to reflect force and don't change static rigidbody
            const newForce = getElasticCollisionForcesStatic({
              v1: component.force,
              position1: transform.position,
              v2: collisionRigidBody.force,
              position2: collision.intersection.position,
            })

            force = newForce
          } else {
            const { force1, force2 } = getElasticCollisionForces({
              m1: component.mass,
              v1: component.force,
              position1: transform.position,

              m2: collisionRigidBody.mass,
              v2: collisionRigidBody.force,
              position2: collision.intersection.position,
            })

            // if elementsStuckInEachOther then rotate forces outside centers
            force = force1

            state.component.rigidBody[collision.colliderEntity].force = force2
          }

          collisions[entity] = undefined
          collisions[collision.colliderEntity] = undefined

          //
          // Push out rigidbodies which stuck in each other
          //
          // state = pushBackStuckRigidbodies({
          //   state,
          //   entity,
          //   collision,
          //   collider,
          //   transform,
          //   force,
          // })
        }
      }

      state.component.rigidBody[entity].force = applyFrictionToForce({
        friction: component.friction,
        force,
      })

      state.component.transform[entity].position = applyForceToPosition({
        force,
        position: newPosition,
      })

      return state
    },
  })
