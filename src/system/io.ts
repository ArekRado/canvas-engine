// open Webapi.Dom;

import { vector, vectorZero } from '@arekrado/vector-2d'
import { State } from 'main'

// type t = {
//   mutable mouseButtons: int,
//   mutable mousePosition: Type.vector,
// };

let buttons = 0
let position = vectorZero()

// let io: t = {
//   mouseButtons: (-1),
//   mousePosition: Vector_Util.create(0.0, 0.0) /* keys */,
// };

// let initialize = () => {
//   switch (Document.querySelector("body", document)) {
//   | Some(el) =>
//     Element.addMouseMoveEventListener(
//       e => {
//         io.mouseButtons = MouseEvent.buttons(e);
//         io.mousePosition =
//           Vector_Util.create(
//             float_of_int(MouseEvent.x(e)),
//             float_of_int(MouseEvent.y(e)),
//           );
//       },
//       el,
//     )
//   | None => ()
//   // let disableContextMenu = [%raw
//   //   {|
//   //     function() {
//   //       document.addEventListener("contextmenu", e => {
//   //         e.preventDefault();
//   //       });
//   //     }
//   //   |}
//   // ];
//   // disableContextMenu();
//   };
// };

export const initialize = () => {
  const body = document.body

  if (body) {
    const setMousePosition = (e: MouseEvent) => {
      position = vector(e.pageX, e.pageY)
    }

    body.addEventListener('click', (e) => {
      buttons = e.buttons
    })
    body.addEventListener('mousemove', setMousePosition, false)
    body.addEventListener('mouseenter', setMousePosition, false)
    body.addEventListener('mouseleave', setMousePosition, false)
  }
}

type Update = (params: { state: State }) => State
export const update: Update = ({ state }) => ({
  ...state,
  mouse: {
    buttons,
    position,
  },
})
