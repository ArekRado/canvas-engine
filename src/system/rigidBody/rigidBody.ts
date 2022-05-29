import {
  Collider,
  InternalInitialState,
  RigidBody,
  Time,
  Transform,
} from '../../type'
import { createSystem, systemPriority } from '../createSystem'
import { componentName } from '../../component/componentName'
import { getComponent } from '../../component/getComponent'
import { add, scale, sub, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { updateComponent } from '../../component/updateComponent'
import { timeEntity } from '../time/time'

export const rigidBodySystem = (state: InternalInitialState) =>
  createSystem<RigidBody, InternalInitialState>({
    name: componentName.rigidBody,
    componentName: componentName.rigidBody,
    state,
    priority: systemPriority.rigidBody,
    tick: ({ state, entity, component, name }) => {
      const time = getComponent<Time>({
        state,
        entity: timeEntity,
        name: componentName.time,
      })
      const transform = getComponent<Transform>({
        state,
        entity,
        name: componentName.transform,
      })
      const collider = getComponent<Collider>({
        state,
        entity,
        name: componentName.collider,
      })

      if (!collider || !transform || !time) return state

      let force = component.force

      collider.collisions.forEach((collider) => {
        const collisionTransform = getComponent<Transform>({
          state,
          entity: collider.entity,
          name: componentName.transform,
        })
        const collisionRigidBody = getComponent<RigidBody>({
          state,
          entity: collider.entity,
          name: componentName.rigidBody,
        })

        if (!collisionTransform || !collisionRigidBody) return

        force = add(
          force,
          scale(collisionRigidBody.mass, collisionRigidBody.force),
        )

        // updateComponent<RigidBody>({
        //   state,
        //   entity: collider.entity,
        //   name: componentName.rigidBody,
        //   update: (collisionRigidBody) => ({
        //     force: add(componentMovementForce, collisionRigidBody.force),
        //   }),
        // })
      })

      // todo collision with more than rigidbody at the same time
      // friction

      state = updateComponent<RigidBody, InternalInitialState>({
        state,
        entity,
        name,
        update: () => ({
          force,
        }),
      })

      state = updateComponent<Transform, InternalInitialState>({
        state,
        entity,
        name: componentName.transform,
        update: (transform) => ({
          position: add(
            scale(time?.delta, force),
            transform.position as Vector2D,
          ),
        }),
      })

      return state
    },
  })
