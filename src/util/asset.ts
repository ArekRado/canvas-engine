import { AssetBlueprint, State } from '../type'

type AddSprite = (param: { state: State; name: string; src: string }) => State
export const addSprite: AddSprite = ({ state, name, src }): State => ({
  ...state,
  asset: {
    ...state.asset,
    sprite: [
      ...state.asset.sprite,
      {
        src,
        name,
      },
    ],
  },
})

type RemoveSprite = (param: { state: State; name: string }) => State
export const removeSprite: RemoveSprite = ({ state, name }): State => ({
  ...state,
  asset: {
    ...state.asset,
    sprite: state.asset.sprite.filter((item) => item.name === name),
  },
})

type AddBlueprint = (param: { state: State; data: AssetBlueprint }) => State
export const addBlueprint: AddBlueprint = ({ state, data }) => ({
  ...state,
  asset: {
    ...state.asset,
    blueprint: [...state.asset.blueprint, data],
  },
})

type RemoveBlueprint = (param: { state: State; name: string }) => State
export const removeBlueprint: RemoveBlueprint = ({ state, name }) => ({
  ...state,
  asset: {
    ...state.asset,
    blueprint: state.asset.blueprint.filter((item) => item.name === name),
  },
})
