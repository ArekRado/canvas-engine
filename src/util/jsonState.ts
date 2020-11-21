import { State } from '../type'

export const jsonToState = (jsonString: string, state: State): State => {
  const js = JSON.parse(jsonString)

  return {
    ...state,
    ...js,
  }
}

export const stateToJson = (state: State): string =>
  JSON.stringify({
    entity: state.entity,
    component: state.component,
    time: state.time,
    asset: state.asset,
    mouse: state.mouse,
    isDebugInitialized: state.isDebugInitialized,
    isDrawEnabled: state.isDrawEnabled,
  })
