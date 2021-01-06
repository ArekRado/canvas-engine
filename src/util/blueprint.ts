import { AssetBlueprint, Blueprint, State } from '../type'

const syncComponentBlueprint = (assetBlueprint: AssetBlueprint) => (
  state: State,
  blueprint: Blueprint,
): State => {
  const entityId = blueprint.entityId

  Object.entries(assetBlueprint.data).forEach(([componentKey, value]) => {
    state.component[componentKey][entityId] = {
      ...value,
      entityId: blueprint.entityId,
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