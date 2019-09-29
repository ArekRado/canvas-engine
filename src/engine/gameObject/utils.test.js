import { isArrayContainsArray } from './utils'

describe('gameObject.utils', () => {
  describe('getGameObjectsByTag', () => {
    test('Should return proper value', () => {
      expect(isArrayContainsArray([], [1])).toBeFalsy()
      expect(isArrayContainsArray([], [1, 2, 3])).toBeFalsy()
      expect(isArrayContainsArray([2], [1])).toBeFalsy()
      expect(isArrayContainsArray([1, 2], [3, 4])).toBeFalsy()
      expect(isArrayContainsArray([1], [1, 3, 4])).toBeFalsy()
      expect(isArrayContainsArray([2], [1, 3, 4])).toBeFalsy()

      expect(isArrayContainsArray([], [])).toBeTruthy()
      expect(isArrayContainsArray([1, 2], [])).toBeTruthy()
      expect(isArrayContainsArray([1], [1])).toBeTruthy()
      expect(isArrayContainsArray([1, 2], [1])).toBeTruthy()
      expect(isArrayContainsArray([1, 2], [1, 2])).toBeTruthy()
      expect(isArrayContainsArray([1, 2], [2, 1])).toBeTruthy()
      expect(isArrayContainsArray([1, 2], [1, 1])).toBeTruthy()
      expect(isArrayContainsArray([1, 2], [2, 2])).toBeTruthy()
      expect(isArrayContainsArray([1, -1, 123, 321], [123, 123])).toBeTruthy()

      expect(isArrayContainsArray([], ['A'])).toBeFalsy()
      expect(isArrayContainsArray([], ['A', 'B', 'C'])).toBeFalsy()
      expect(isArrayContainsArray(['B'], ['A'])).toBeFalsy()
      expect(isArrayContainsArray(['A', 'B'], ['C', 'D'])).toBeFalsy()
      expect(isArrayContainsArray(['A', 'B'], ['C', 'A', 'D'])).toBeFalsy()
      expect(isArrayContainsArray(['A'], ['C', 'A', 'D'])).toBeFalsy()
      expect(isArrayContainsArray(['A', -'A', 'ABC', 'CBA'], ['C'])).toBeFalsy()

      expect(isArrayContainsArray(['A', 'B'], [])).toBeTruthy()
      expect(isArrayContainsArray(['A'], ['A'])).toBeTruthy()
      expect(isArrayContainsArray(['A', 'B'], ['A'])).toBeTruthy()
      expect(isArrayContainsArray(['A', 'B'], ['A', 'B'])).toBeTruthy()
      expect(isArrayContainsArray(['A', 'B'], ['B', 'A'])).toBeTruthy()
      expect(isArrayContainsArray(['A', 'B'], ['A', 'A'])).toBeTruthy()
      expect(isArrayContainsArray(['A', 'B'], ['B', 'B'])).toBeTruthy()
      expect(
        isArrayContainsArray(['A', -'A', 'ABC', 'CBA'], ['ABC', 'CBA']),
      ).toBeTruthy()
    })
  })
})
