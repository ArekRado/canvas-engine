import { AnyState, Entity, Transform } from '../../type'

type ChildrenList = { entity: Entity; transform: Transform }

export const getShallowTransformChildren = ({
  state,
  entity,
}: {
  state: AnyState
  entity: Entity
}): ChildrenList[] => {
  const childrenList = Object.entries(state.component.transform).reduce(
    (acc, [transformEntity, transform]: [Entity, Transform]) => {
      if (transform.parentId === entity) {
        acc.push({ entity: transformEntity, transform })
      }

      return acc
    },
    [] as ChildrenList[],
  )

  return childrenList
}

export const getDeepTransformChildren = ({
  state,
  entity,
}: {
  state: AnyState
  entity: Entity
}): ChildrenList[] => {
  const childrenList = getShallowTransformChildren({ state, entity }).reduce(
    (acc, { entity: transformEntity, transform }) => {
      acc.push({ entity: transformEntity, transform })

      const childrenList = getDeepTransformChildren({
        entity: transformEntity,
        state,
      })

      return [...acc, ...childrenList]
    },
    [] as ChildrenList[],
  )

  return childrenList
}
