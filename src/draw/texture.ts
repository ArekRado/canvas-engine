import { Sprite } from '../type'
import REGL from 'regl'

type CreateTexture = (params: {
  src: Sprite['src']
  regl: REGL.Regl
}) => Promise<REGL.Texture2D>
export const createTexture: CreateTexture = ({ src, regl }) => {
  const texture = new Promise<REGL.Texture2D>((resolve) => {
    const image = new Image()
    image.src = src
    image.onload = () => {
      resolve(regl.texture(image))
    }
  })

  return texture
}
