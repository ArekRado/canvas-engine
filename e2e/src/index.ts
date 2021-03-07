import 'regenerator-runtime/runtime'
import {
  runOneFrame,
  initialState,
  initializeEngine,
  State,
} from '@arekrado/canvas-engine'
import { eventBusOn } from './eventBus'
import { boxCollide } from './testCase/boxCollide'

initializeEngine()

// .then(() => {
//   console.log('Engine has been initialized')

  runOneFrame({ state: initialState, timeNow: 0 })
// })

eventBusOn('runOneFrame', (testCase: string) => {
  console.log('testCase: ', testCase)
  switch (testCase) {
    case 'boxCollide':
      runOneFrame({ state: boxCollide() })
  }
})
