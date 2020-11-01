import 'regenerator-runtime/runtime'
import { initialState } from '../main'
import { runOneFrame } from 'util/runOneFrame'

describe('time', () => {
  it('should change time - start from 0 case', () => {
    const v1 = runOneFrame({
      state: initialState,
      enableDraw: false,
      timeNow: 0,
    })

      expect(v1.time.timeNow).toBe(0);
      expect(v1.time.delta).toBe(0);

    const v2 = runOneFrame({
      state: v1,
      enableDraw: false,
      timeNow: 1000,
    })

    expect(v2.time.timeNow).toBe(1000);
    expect(v2.time.delta).toBe(1000);

    const v3 = runOneFrame({
      state: v2,
      enableDraw: false,
      timeNow: 1002,
    })

    expect(v3.time.timeNow).toBe(1002);
    expect(v3.time.delta).toBe(2);
  })

  it('should change time - start from non 0 case', () => {
    const v1 = runOneFrame({
      state: initialState,
      enableDraw: false,
      timeNow: 10,
    })

      expect(v1.time.timeNow).toBe(10);
      expect(v1.time.delta).toBe(10);

    const v2 = runOneFrame({
      state: v1,
      enableDraw: false,
      timeNow: 1000,
    })

    expect(v2.time.timeNow).toBe(1000);
    expect(v2.time.delta).toBe(990);

    const v3 = runOneFrame({
      state: v2,
      enableDraw: false,
      timeNow: 1002,
    })

    expect(v3.time.timeNow).toBe(1002);
    expect(v3.time.delta).toBe(2);
  })
})

// let runTests = () => {
//   Test_Util.describe("Time_System", it => {
//     it("Should change time - start from 0 case", _assert => {
//       let state1 =
//         Util.runOneFrame(
//           ~state=Type.initialState,
//           ~enableDraw=false,
//           ~performanceNow=0.0,
//           (),
//         );

//       _assert(state1.time.timeNow === 0.0);
//       _assert(state1.time.delta === 0.0);

//       let state2 =
//         Util.runOneFrame(
//           ~state=state1,
//           ~enableDraw=false,
//           ~performanceNow=1000.0,
//           (),
//         );

//       _assert(state2.time.timeNow === 1000.0);
//       _assert(state2.time.delta === 1000.0);

//       let state3 =
//         Util.runOneFrame(
//           ~state=state2,
//           ~enableDraw=false,
//           ~performanceNow=1002.0,
//           (),
//         );

//       _assert(state3.time.timeNow === 1002.0);
//       _assert(state3.time.delta === 2.0);
//     });

//     it("Should change time - start from non 0 case", _assert => {
//       let state1 =
//         Util.runOneFrame(
//           ~state=Type.initialState,
//           ~enableDraw=false,
//           ~performanceNow=10.0,
//           (),
//         );

//       _assert(state1.time.timeNow === 10.0);
//       _assert(state1.time.delta === 10.0);

//       let state2 =
//         Util.runOneFrame(
//           ~state=state1,
//           ~enableDraw=false,
//           ~performanceNow=1000.0,
//           (),
//         );

//       _assert(state2.time.timeNow === 1000.0);
//       _assert(state2.time.delta === 990.0);

//       let state3 =
//         Util.runOneFrame(
//           ~state=state2,
//           ~enableDraw=false,
//           ~performanceNow=1002.0,
//           (),
//         );

//       _assert(state3.time.timeNow === 1002.0);
//       _assert(state3.time.delta === 2.0);
//     });
//   });
// };
