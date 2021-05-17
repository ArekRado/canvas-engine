import createRegl from 'regl'
import { State } from '..'
import { reglMock } from '../test/mock/regl'

type GetRegl = (params: { container?: HTMLElement; state: State }) => State
export const getRegl: GetRegl = ({ container, state }) => {
  if (process.env.NODE_ENV === 'test') {
    return {
      ...state,
      regl: reglMock,
    }
  }

  return {
    ...state,
    regl: createRegl({
      container,
    }),
  }
}
