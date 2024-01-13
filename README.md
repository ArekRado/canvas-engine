# canvas-engine

```
npm install @arekrado/canvas-engine
```

# DevTools

(in progress) https://github.com/ArekRado/canvas-engine-devtools

# Example

https://github.com/ArekRado/kostki
https://github.com/ArekRado/canvas-engine-devtools/tree/master/example

# ECS

[What is entity component system?](https://en.wikipedia.org/wiki/Entity_component_system)

# Entity

It's just a unique string - think about it as uniq ID from SQL database.

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
  component: {
    animationNumber: Dictionary<AnimationNumber>
    animationString: Dictionary<AnimationString>
    animationVector2D: Dictionary<AnimationVector2D>
    animationVector3D: Dictionary<AnimationVector3D>

    collideBox: Dictionary<CollideBox>
    collideCircle: Dictionary<CollideCircle>
    mouseInteraction: Dictionary<MouseInteraction>
    time: Dictionary<Time>
    camera: Dictionary<Camera>
    transform: Dictionary<Transform>
    event: Dictionary<Event>
    mouse: Dictionary<Mouse>
    keyboard: Dictionary<Keyboard>
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

export const getDefaultGunMagazine: GetDefaultComponent<GunMagazine> = (
  data,
) => ({
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
  Transform,
} from '@arekrado/canvas-engine'
import { vectorZero } from '@arekrado/vector-2d'
import { getDefaultGunMagazine, GunMagazine } from './components/gunMagazine'
import gunImg from './assets/gun.png'

export const GunBlueprint = ({ state }): State => {
  // create new entity
  const gunEntity = generateEntity({ name: 'gun' })

  // add new entity to state
  // btw can't wait for a pipeline operator
  state = createEntity({ state, entity })

  state = setComponent<Transform>({
    name: componentName.transform,
    state,
    data: defaultData.transform({
      position: vector(10, 50),
    }),
  })

  // create and push gun sprite and connect it with entity
  state = setComponent<Sprite>({
    name: componentName.sprite,
    state,
    data: defaultData.sprite({
      entity: gunEntity,
      src: gunImg,
    }),
  })

  // finally add our own component
  newState = setComponent<GunMagazine>({
    name: 'gunMagazine',
    state,
    data: getDefaultGunMagazine({
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
import {
  Component,
  State,
  componentName,
  createSystem,
  getComponent,
  defaultData,
} from '@arekrado/canvas-engine'

export const playerSystem = (state: State) =>
  createSystem<Player, State>({
    name: 'player',
    state,
    create: ({ state, component }) => {
      state = setComponent<Transform, State>({
        entity: component.entity,
        name: componentName.transform,
        state,
        data: defaultData.transform({
          position: vector(5, 150),
        }),
      })

      return state
    },
    tick: ({ state, component }) => {
      const transform = getComponent<Transform, State>({
        entity: component.entity,
        name: componentName.transform,
        state,
      })

      if (state.keyboard.keys['a']?.isPressed) {
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
import {
  runOneFrame,
  getState,
  EmptyState,
} from '@arekrado/canvas-engine'
import {
  Engine,
  NullEngine,
  Scene,
  UniversalCamera,
  Vector3,
  Camera,
} from '@babylonjs'

import { GunMagazine, Player } from './types'
import { gunBlueprint } from './blueprints/gunBlueprint'
import gunImg from './assets/area.png'

// Setup babylonjs
const engine = new Engine(document.getElementById('game'))
const scene = new Scene(engine)
const camera = new UniversalCamera(
  'UniversalCamera',
  new Vector3(0, 0, -1),
  scene,
)
camera.mode = Camera.ORTHOGRAPHIC_CAMERA

// Setup state
type Components = {
  player: Player
  gun: Gun
}
type Systems = System<Player>
type State = EmptyState<Components, Systems>

let state = getState({ scene, camera }) as State

// Setup system
state = playerSystem(state)

// Setup initial state data
state = gunBlueprint(state)

const beforeRenderCallback = () => {
  state = runOneFrame({ state })
}

scene.registerBeforeRender(beforeRenderCallback)
```

# Typescript

```ts
import { EmptyState, EmptyState } from '@arekrado/canvas-engine'

export type Components = {
  animationNumber: Dictionary<AnimationNumber>
  collideBox: Dictionary<CollideBox>
  transform: Dictionary<Transform>
}

export type Systems =
  | System<AnimationNumber>
  | System<CollideBox>
  | System<Transform>

type YourOwnState = EmptyState<Components, Systems>

type YourOwnStateWithCanvasEngine = EmptyState<Components, Systems>
```

# Event - TODO

# Blueprints vs Systems
Use blueprints if you don't want to duplicate state

```ts
// Bad

state = createCar({
  state,
  entity,
  data: {
    name: 'fiat', // only this propert will be used in a Car component
    color: 'red', // bad, it can be stored in a Material component
    position: [0,0,0], // bad, it can be stored in a Transform component
  }
})

// Good

const carBlueprint = ({ state entity }: { state:State, entity:Entity }) => {
  state = createCar({ state, entity, data: { name: 'fiat' } })
  state = createTransform({ state, entity, data })
}
```

Use system:
- if you want to use component lifecycle (create, remove, tick, update, adding and removing eventHandlers) 
- if you use plain component functions (createComponent, remoevComponent, updateComponent)
```