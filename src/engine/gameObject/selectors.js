// import createCachedSelector from 're-reselect'
// import { EngineState } from 'engine/createApp'
// import { GameObject } from './reducer'
// import { isArrayContainsArray } from './utils'

// type Tags = string[]

// export const getGameObjectById = createCachedSelector<
//   EngineState,
//   string,
//   GameObject[],
//   string,
//   GameObject | undefined
// >(
//   (engine, id) => engine.gameObjects,
//   (engine, id) => id,
//   (gameObjects, id) => gameObjects.find(g => g.id === id),
// )((engine, id) => id)

// export const getGameObjectsByTag = createCachedSelector<
//   EngineState,
//   string,
//   GameObject[],
//   string,
//   GameObject[]
// >(
//   (engine, tag) => engine.gameObjects,
//   (engine, tag) => tag,
//   (gameObjects, tag) => gameObjects.filter(g => g.tags.some(t => t === tag)),
// )((engine, tag) => tag)

// export const getGameObjectsByTags = createCachedSelector<
//   EngineState,
//   Tags,
//   GameObject[],
//   Tags,
//   GameObject[]
// >(
//   (engine, tags) => engine.gameObjects,
//   (engine, tags) => tags,
//   (gameObjects, tags) => {
//     return gameObjects.filter(gameObject => {
//       const a = isArrayContainsArray(gameObject.tags, tags)
//       return a
//     })
//   },
// )((engine: EngineState, tags: Tags) =>
//   ([] as Tags)
//     .concat(tags)
//     .sort()
//     .join(),
// )
