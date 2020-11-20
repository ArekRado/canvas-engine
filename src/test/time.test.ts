import 'regenerator-runtime/runtime'
import { initialState } from '../main'
import { runOneFrame } from 'util/runOneFrame'

describe('time', () => {
  it('should change time - start from 0 case', () => {
    const v1 = runOneFrame({
      state: initialState,
      timeNow: 0,
    })

      expect(v1.time.timeNow).toBe(0);
      expect(v1.time.delta).toBe(0);

    const v2 = runOneFrame({
      state: v1,
      timeNow: 1000,
    })

    expect(v2.time.timeNow).toBe(1000);
    expect(v2.time.delta).toBe(1000);

    const v3 = runOneFrame({
      state: v2,
      timeNow: 1002,
    })

    expect(v3.time.timeNow).toBe(1002);
    expect(v3.time.delta).toBe(2);
  })

  it('should change time - start from non 0 case', () => {
    const v1 = runOneFrame({
      state: initialState,
      timeNow: 10,
    })

      expect(v1.time.timeNow).toBe(10);
      expect(v1.time.delta).toBe(10);

    const v2 = runOneFrame({
      state: v1,
      timeNow: 1000,
    })

    expect(v2.time.timeNow).toBe(1000);
    expect(v2.time.delta).toBe(990);

    const v3 = runOneFrame({
      state: v2,
      timeNow: 1002,
    })

    expect(v3.time.timeNow).toBe(1002);
    expect(v3.time.delta).toBe(2);
  })
})
