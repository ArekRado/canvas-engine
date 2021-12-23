import { AssetBlueprint, Blueprint, State } from '../type'

const syncComponentBlueprint = (assetBlueprint: AssetBlueprint) => (
  state: State,
  blueprint: Blueprint,
): State => {
  const entity = blueprint.entity

  Object.entries(assetBlueprint.data).forEach(([componentKey, value]) => {
    state.component[componentKey][entity] = {
      ...value,
      entity: blueprint.entity,
    }
  })

  return state
}

export const syncBlueprint = (state: State): State => {
  const blueprintComponent: Blueprint[] = Object.values(
    state.component.blueprint,
  )

  return state.asset.blueprint.reduce(
    (acc, assetBlueprint) =>
      blueprintComponent.reduce(syncComponentBlueprint(assetBlueprint), acc),
    state,
  )
}