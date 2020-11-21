import { State } from '../type'

type AddSprite = (param: { state: State; name: string; src: string }) => State
export const addSprite: AddSprite = ({ state, name, src }): State => ({
  ...state,
  asset: {
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
    sprite: state.asset.sprite.filter((item) => item.name === name),
  },
})
