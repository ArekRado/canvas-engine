import { AssetBlueprint, Blueprint, State } from '../type'

const syncComponentBlueprint = (assetBlueprint: AssetBlueprint) => (
  state: State,
  blueprint: Blueprint,
): State => {
  Object.entries(assetBlueprint.data).map(
    ([key, value]) => (state.component[key][blueprint.entity.id] = value),
  )

  return state
}

export const syncBlueprint = (state: State): State => {
  const blueprintComponents: Blueprint[] = Object.values(
    state.component.blueprint,
  )

  return state.asset.blueprint.reduce((acc, assetBlueprint) => {
    return blueprintComponents.reduce(
      syncComponentBlueprint(assetBlueprint),
      acc,
    )
  }, state)
}
