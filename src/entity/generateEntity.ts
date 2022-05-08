import { Entity } from '../type'

let counter = 0

export const generateEntity = (): Entity => {
  const number = (counter++).toString()

  return number
}
