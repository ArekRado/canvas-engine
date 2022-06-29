import { Collider, InternalInitialState, RigidBody } from '../../type'
import { createSystem, systemPriority } from '../createSystem'
import { componentName } from '../../component/componentName'
import { add, dot, magnitude, scale, sub, Vector2D } from '@arekrado/vector-2d'
import { timeEntity } from '../time/time'
import { getRigidBody, updateRigidBody } from './rigidBodyCrud'
import { getTime } from '../time/timeCrud'
import { getTransform, updateTransform } from '../transform/transformCrud'
import { getCollider, updateCollider } from '../collider/colliderCrud'

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

  position1: Vector2D
  position2: Vector2D
}) => {
  // Two-dimensional elastic collision, formula with vectors
  // https://en.wikipedia.org/wiki/Elastic_collision
  const subP1P2 = sub(position1, position2)
  const a = (2 * m2) / (m1 + m2)
  const aa = dot(sub(v1, v2), subP1P2) / Math.pow(magnitude(subP1P2), 2)

  const subP2P1 = sub(position2, position1)
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
  position1: Vector2D
  position2: Vector2D
}) => {
  const subP1P2 = sub(position1, position2)
  const aa = dot(sub(v1, v2), subP1P2) / Math.pow(magnitude(subP1P2), 2)

  return sub(v1, scale(2 * aa, subP1P2))
}

const applyFrictionToForce = ({
  friction,
  timeDelta,
  force,
}: {
  friction: number
  timeDelta: number
  force: Vector2D
}): Vector2D => {
  // Friction same as force depends on a time.delta
  const frictionPerSecond = friction * (timeDelta / FPS)
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

const removeFirstCollision = (collider: Collider): Partial<Collider> => ({
  _collisions: collider._collisions.slice(1, collider._collisions.length),
})

const applyForceToPosition = ({
  timeDelta,
  force,
  position,
}: {
  timeDelta: number
  force: Vector2D
  position: Vector2D
}) => add(scale(timeDelta, force), position)

export const rigidBodySystem = (state: InternalInitialState) =>
  createSystem<RigidBody, InternalInitialState>({
    name: componentName.rigidBody,
    componentName: componentName.rigidBody,
    state,
    priority: systemPriority.rigidBody,
    tick: ({ state, entity }) => {
      const component = getRigidBody({
        state,
        entity,
      })

      // Static rigidBody actually have disabled phisics
      if (component?.isStatic) {
        return state
      }
      const time = getTime({
        state,
        entity: timeEntity,
      })
      const transform = getTransform({
        state,
        entity,
      })
      const collider = getCollider({
        state,
        entity,
      })

      if (!collider || !transform || !time || !component) return state

      let force = component.force

      const collision = collider._collisions[0]
      if (collision) {
        const collisionTransform = getTransform({
          state,
          entity: collision.entity,
        })
        const collisionRigidBody = getRigidBody({
          state,
          entity: collision.entity,
        })

        if (collisionTransform && collisionRigidBody) {
          if (collisionRigidBody.isStatic) {
            // In elastic collision with static rigidbody mass of static rigidbody doesn't matter
            // we just want to reflect force and don't change static rigidbody
            const newForce = getElasticCollisionForcesStatic({
              v1: component.force,
              position1: transform.position as Vector2D,
              v2: collisionRigidBody.force,
              position2: collisionTransform.position as Vector2D,
            })

            force = newForce
          } else {
            const { force1, force2 } = getElasticCollisionForces({
              m1: component.mass,
              v1: component.force,
              position1: transform.position as Vector2D,

              m2: collisionRigidBody.mass,
              v2: collisionRigidBody.force,
              position2: collisionTransform.position as Vector2D,
            })

            force = force1

            state = updateRigidBody({
              state,
              entity: collision.entity,
              update: () => ({
                force: force2,
              }),
            })
          }

          state = updateCollider({
            state,
            entity: collision.entity,
            update: removeFirstCollision,
          })
        }
      }

      // if (!component.isStatic) {
      state = updateRigidBody({
        state,
        entity,
        update: () => ({
          force: applyFrictionToForce({
            friction: component.friction,
            timeDelta: time.delta,
            force,
          }),
        }),
      })

      state = updateTransform({
        state,
        entity,
        update: (transform) => ({
          position: applyForceToPosition({
            force,
            timeDelta: time.delta,
            position: transform.position as Vector2D,
          }),
        }),
      })
      // }

      return state
    },
  })
