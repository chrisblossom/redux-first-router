// @flow
import { NOT_FOUND } from '../index'
import isServer from '../pure-utils/isServer'
import { nestHistory } from '../pure-utils/nestAction'
import type {
  LocationState,
  RoutesMap,
  Action,
  Payload,
  History
} from '../flow-types'

export default (initialState: LocationState, routesMap: RoutesMap) => (
  state: LocationState = initialState,
  action: Action
): LocationState => {
  if (
    action.type === NOT_FOUND ||
    (routesMap[action.type] &&
      (action.meta.location.current.pathname !== state.pathname ||
        action.meta.location.kind === 'load'))
  ) {
    return {
      pathname: action.meta.location.current.pathname,
      type: action.type,
      payload: { ...action.payload },
      prev: action.meta.location.prev,
      kind: action.meta.location.kind,
      history: action.meta.location.history,
      hasSSR: state.hasSSR,
      routesMap
    }
  }

  return state
}

export const getInitialState = (
  currentPathname: string,
  type: string,
  payload: Payload,
  routesMap: RoutesMap,
  history: History
): LocationState => ({
  pathname: currentPathname,
  type,
  payload,
  prev: {
    pathname: '',
    type: '',
    payload: {}
  },
  kind: undefined,
  history: nestHistory(history),
  hasSSR: isServer() ? true : undefined, // client uses initial server `hasSSR` state setup here
  routesMap
})
