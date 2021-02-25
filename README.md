# canvas-engine

```
npm i
npm run test:watch
```

# DevTools

https://github.com/ArekRado/canvas-engine-devtools

# Example

https://github.com/ArekRado/canvas-engine-devtools/tree/master/example

# ECS

[What is entity component system?](https://en.wikipedia.org/wiki/Entity_component_system)

# Entity

It's just a uniq string - think about it as uniq ID from SQL database.

```ts
import { entity, initialState } from '@arekrado/canvas-engine'

const newEntity = entity.generate('human-friendly-name')

const stateWithEntity = entity.set({ state: initialState, entity: newEntity })
```

# Component

Component describes game state without logic. It's something like a record in a table from SQL database.

```ts
type State = {
  // {...}
  component: Dictionary<Dictionary<Component<any>>> & {
    sprite: Dictionary<Sprite>
    transform: Dictionary<Transform>
    animation: Dictionary<Animation>
    collideBox: Dictionary<CollideBox>
    collideCircle: Dictionary<CollideCircle>
    mouseInteraction: Dictionary<MouseInteraction>
  }
  // {...}
}
```

Here is example how to use components:

```ts
import { Component, GetDefaultComponent } from '@arekrado/canvas-engine'

export type GunMagazine = Component<{
  type: 'tubular' | 'box' | 'rotary' | 'drum'
  bullets: number
}>

// I prefer to call it "default data" rather than component. Component sounds like something complex but this is only function which returns simple JSON.
export const gunMagazine: GetDefaultComponent<GunMagazine> = (data) => ({
  name: 'gunMagazine',
  bullets: 0,
  type: 'rotary',
  ...data,
})
```

```ts
import {
  componentName,
  entity,
  defaultData,
  setComponent,
  State,
} from '@arekrado/canvas-engine'
import { vectorZero } from '@arekrado/vector-2d'
import { gunMagazine } from './components/gunMagazine'
import gunImg from './assets/gun.png'

// blueprint helps you avoid excessive code - It's common pattern used in gamedev
export const GunBlueprint = ({ state }): State => {
  // create new entity
  const gunEntity = entity.generate('gun', {
      position: vector(10, 50),
  })

  // add new entity to state
  // btw can't wait for a pipeline operator
  let newState = entity.set({ state, entity })

  // create and push gun sprite and connect it with entity
  newState = setComponent(componentName.sprite, {
    state: state1,
    data: defaultData.sprite({
      entity: gunEntity,
      src: gunImg,
    }),
  })

  // finally add our own component
  newState = setComponent('gunMagazine', {
    state: state1,
    data: gunMagazine({
      entity: gunEntity,
      bullets: 5,
    }),
  })

  return newState
}
```

# System

Pure logic without state. Every system receives whole state then modifies it and returns new state. Canvas-engine contains several internal systems use `runOneFrame` funtion to run them.

`createSystem` provides simple abstraction with lifecycle methods connecting components with systems by name.

```ts
export const playerSystem = (state: State) =>
  createSystem<Component<Player>>({
    name: 'gun',
    state,
    tick: ({ state, component }) => {
      const entity = getEntity({
        entityId: component.entityId,
        state,
      })

      if (state.keyboard['a']?.isPressed) {
        return bulletBlueprint({
          position: entity.position,
        })
      }

      return state
    },
  })
```

# Easy start

```ts
import * as ReactDOM from 'react-dom'
import {
  CanvasEngineDevtools,
  registerDebugSystem,
} from '@arekrado/canvas-engine-devtools'
import {
  runOneFrame,
  State,
  initialState,
  initializeEngine,
  asset,
} from '@arekrado/canvas-engine'

import { gunBlueprint } from './blueprints/gunBlueprint'
import gunImg from './assets/area.png'

const gameLogic = (state: State) => {
  const newState = runOneFrame({ state })

  requestAnimationFrame(() => gameLogic(newState))
}

// do side effects - initialize will attach event listeners and pixi.js
initializeEngine().then(() => {
  let state = gunBlueprint(initialState)

  // devtools will display this img in sprite list
  state = asset.addSprite({
    state,
    src: gunImg,
    name: gunImg,
  })

  // other custom systems
  // const v4 = mySystem1(v3)
  // const v5 = mySystem2(v4)

  state = registerDebugSystem(state)

  gameLogic(state)
})

// if you want to see devtools mount CanvasEngineDevtools and use registerDebugSystem
ReactDOM.render(
  <CanvasEngineDevtools />,
  document.getElementById('canvas-engine-devtools'),
)
```
