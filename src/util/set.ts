// This is simplified version of set from "just-safe-set"

export const set = (
  obj: Record<string, unknown>,
  propsArg: string[],
  value: unknown,
) => {
  let props = []
  let lastProp: string | undefined = ''

  props = propsArg.slice(0)

  lastProp = props.pop()

  if (!lastProp) {
    return false
  }

  let thisProp: string | undefined = ''

  while ((thisProp = props.shift())) {
    if (typeof obj[thisProp] == 'undefined') {
      obj[thisProp] = {}
    }
    obj = obj[thisProp] as Record<string, unknown>
    if (!obj || typeof obj != 'object') {
      return false
    }
  }
  obj[lastProp] = value
  return true
}
