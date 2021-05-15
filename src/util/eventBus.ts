// import REGL from 'regl'

// export enum EventType {
//   createTexture = 'createTexture',
// }

// type EventBusEvent<Type extends EventType, Payload> = {
//   type: Type
//   payload: Payload
// }

// export type EventButCreateTexture = EventBusEvent<
//   EventType.createTexture,
//   REGL.Texture2D
// >

// type EventBusAllEvents = EventButCreateTexture

// export const eventBusOn = <Data extends EventBusAllEvents>(
//   event: Data['type'],
//   callback: (data: Data) => void,
// ) => {
//   document.addEventListener(event, (e: any) => callback(e.detail))
// }

// export const eventBusDispatch = <Data extends EventBusAllEvents>(
//   event: EventType,
//   data: Data,
// ) => {
//   document.dispatchEvent(new CustomEvent(event, { detail: data }))
// }

// export const eventBusRemove = (
//   event: EventType,
//   callback: (data: any) => void,
// ) => {
//   document.removeEventListener(event, callback)
// }
