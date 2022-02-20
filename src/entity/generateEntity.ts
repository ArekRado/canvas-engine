import { v4 } from 'uuid'
import { Entity } from '../type'

export const generateEntity = ({ name }: { name: string }): Entity =>
  name ? `${name}---${v4()}` : v4()
