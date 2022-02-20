import { vector, Vector2D } from '@arekrado/vector-2d'
import { Vector3D } from '../type'

export const parseV3ToV2 = (v3: Vector3D | Vector2D): Vector2D => vector(v3[0], v3[1])
