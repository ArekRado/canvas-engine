import { isMouseOver } from './isMouseOver'
import { setMouseOver } from 'engine/gameObject/actions'

export const logic = (dispatch, engine) => {
  engine.gameObjects.forEach(gameObject => {
    if (gameObject.rigidbody.mouseActionsEnabled) {
      const isMouseOverFlag = isMouseOver(gameObject, engine.mouse, engine.time)

      if (isMouseOverFlag !== gameObject.rigidbody.isMouseOver) {
        dispatch(
          setMouseOver({ id: gameObject.id, isMouseOver: isMouseOverFlag }),
        )
      }
    }
  })
}
