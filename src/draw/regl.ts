import createRegl from 'regl'
import REGL from 'regl'
import { reglMock } from '../test/mock/regl'

let mutableRegl: REGL.Regl | null = null

export const regl = (): REGL.Regl => {
  if (process.env.NODE_ENV === 'test') {
    return reglMock
  }
  if (mutableRegl) {
    return mutableRegl
  } else {
    mutableRegl = createRegl()
    return mutableRegl
  }
}
