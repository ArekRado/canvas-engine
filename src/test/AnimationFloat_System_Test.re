const runTests = () => {
  Test_Util.describe("Animation_System - Float", it => {
    const tick = (performanceNow, state) =>
      Util.runOneFrame(~state, ~enableDraw=false, ~performanceNow, ());

    const entity = "entity";
    const animationName = "animationName";
    const fieldFloatName = "testFieldFloat";

    const getAnimation = (state: Type.state) =>
      switch (Animation_Component.get(~state, ~name=animationName, ~entity)) {
      | Some(animation) => animation
      | None => failwith("Can't find animation " ++ animationName)
      };

    const getFieldFloat = (state: Type.state) =>
      switch (FieldFloat_Component.get(~state, ~name=fieldFloatName, ~entity)) {
      | Some(field) => field
      | None => failwith("Can't find fieldFloat " ++ fieldFloatName)
      };

    it("Linear animation should change value in proper way", _assert => {
      const keyframe: Type.keyframe = {
        duration: 10.0,
        timingFunction: Linear,
        valueRange: Float((0.0, 1.0)),
      };
      Type.initialState
      ->Entity.create(~entity, ~state=_)
      ->FieldFloat_Component.create(
          ~entity,
          ~state=_,
          ~name=fieldFloatName,
          ~value=0.0,
        )
      ->Animation_Component.create(
          ~state=_,
          ~data={
            component: FieldFloat(entity, fieldFloatName),
            isPlaying: true,
            keyframes: [keyframe],
            entity,
            name: animationName,
            currentTime: 0.0,
            wrapMode: Once,
            isFinished: false,
          }
        )
      ->(
          state => {
            const newState = tick(0.0, state);
            _assert(getFieldFloat(newState).value === 0.0);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(1.0, state);
            _assert(getFieldFloat(newState).value === 0.0);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(2.0, state);
            _assert(getFieldFloat(newState).value === 0.1);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(2.0, state);
            _assert(getFieldFloat(newState).value === 0.2);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(10.0, state);
            _assert(getFieldFloat(newState).value === 0.2);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(10.0, state);
            _assert(getFieldFloat(newState).value === 1.0);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(12.0, state);
            _assert(getFieldFloat(newState).value === 1.0);
          }
        );
      ();
    });

    it("Should not update frame values when time is over", _assert => {
      const keyframe: Type.keyframe = {
        duration: 10.0,
        timingFunction: Linear,
        valueRange: Float((0.0, 1.0)),
      };
      Type.initialState
      ->Entity.create(~entity, ~state=_)
      ->FieldFloat_Component.create(
          ~entity,
          ~state=_,
          ~name=fieldFloatName,
          ~value=0.0,
        )
      ->Animation_Component.create(
          ~state=_,
          ~data={
            component: FieldFloat(entity, fieldFloatName),
            isPlaying: true,
            keyframes: [keyframe],
            entity,
            name: animationName,
            currentTime: 0.0,
            wrapMode: Once,
            isFinished: false,
          }
        )
      ->(
          state => {
            const newState = tick(0.0, state);
            _assert(getFieldFloat(newState).value === 0.0);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(20.0, state);
            _assert(getFieldFloat(newState).value === 0.0);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(40.0, state);
            _assert(getFieldFloat(newState).value === 1.0);
          }
        );
      ();
    });

    it("Should works with negative values", _assert => {
      const keyframe: Type.keyframe = {
        duration: 10.0,
        timingFunction: Linear,
        valueRange: Float(((-1.0), (-2.0))),
      };
      Type.initialState
      ->Entity.create(~entity, ~state=_)
      ->FieldFloat_Component.create(
          ~entity,
          ~state=_,
          ~name=fieldFloatName,
          ~value=0.0,
        )
      ->Animation_Component.create(
          ~state=_,
          ~data={
            component: FieldFloat(entity, fieldFloatName),
            isPlaying: true,
            keyframes: [keyframe],
            name: animationName,
            entity,
            currentTime: 0.0,
            wrapMode: Once,
            isFinished: false,
          }
        )
      ->(
          state => {
            const newState = tick(0.0, state);
            _assert(getFieldFloat(newState).value === 0.0);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(1.0, state);
            _assert(getFieldFloat(newState).value === 0.0);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(22.0, state);
            _assert(
              getFieldFloat(newState).value === (-0.1),
            );
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(22.0, state);
            _assert(
              getFieldFloat(newState).value === (-2.0),
            );
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(2.0, state);
            _assert(
              getFieldFloat(newState).value === (-2.0),
            );
          }
        );
      ();
    });

    it("Should works with multiple frames", _assert => {
      const keyframes = [
        (
          {
            duration: 10.0,
            timingFunction: Linear,
            valueRange: Float((0.0, 1.0)),
          }: Type.keyframe
        ),
        (
          {
            duration: 1.0,
            timingFunction: Linear,
            valueRange: Float((0.0, 1.0)),
          }: Type.keyframe
        ),
        (
          {
            duration: 2.0,
            timingFunction: Linear,
            valueRange: Float((0.0, 1.0)),
          }: Type.keyframe
        ),
        (
          {
            duration: 100.0,
            timingFunction: Linear,
            valueRange: Float((0.0, 1.0)),
          }: Type.keyframe
        ),
      ];

      Type.initialState
      ->Entity.create(~entity, ~state=_)
      ->FieldFloat_Component.create(
          ~entity,
          ~state=_,
          ~name=fieldFloatName,
          ~value=0.0,
        )
      ->Animation_Component.create(
          ~state=_,
          ~data={
            component :FieldFloat(entity, fieldFloatName),
            isPlaying :true,
            keyframes,
            name :animationName,
            entity,
            currentTime: 0.0,
            wrapMode: Once,
            isFinished: false,
          }
        )
      ->(
          state => {
            const newState = tick(0.0, state);
            _assert(getFieldFloat(newState).value === 0.0);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(5.0, state);
            _assert(getFieldFloat(newState).value === 0.0);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(10.5, state);
            _assert(getFieldFloat(newState).value === 0.5);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(12.0, state);
            _assert(getFieldFloat(newState).value === 0.5);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(100.0, state);
            _assert(getFieldFloat(newState).value === 0.5);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(300.0, state);
            _assert(getFieldFloat(newState).value === 0.87);
            newState;
          }
        )
      ->(
          state => {
            const newState = tick(100.0, state);

            // _assert(getFieldFloat(newState).value === 0.0);
            _assert(getAnimation(newState).isPlaying === false);
            _assert(getAnimation(newState).currentTime === 0.0);
          }
        );
      ();
    });

    it("Should works with looped animations", _assert => {
      const keyframes = [
        (
          {
            duration: 10.0,
            timingFunction: Linear,
            valueRange: Float((0.0, 1.0)),
          }: Type.keyframe
        ),
        (
          {
            duration: 1.0,
            timingFunction: Linear,
            valueRange: Float((0.0, 1.0)),
          }: Type.keyframe
        ),
        (
          {
            duration: 2.0,
            timingFunction: Linear,
            valueRange: Float((0.0, 1.0)),
          }: Type.keyframe
        ),
        (
          {
            duration: 100.0,
            timingFunction: Linear,
            valueRange: Float((0.0, 1.0)),
          }: Type.keyframe
        ),
      ];

      const _ =
        Type.initialState
        ->Entity.create(~entity, ~state=_)
        ->FieldFloat_Component.create(
            ~entity,
            ~state=_,
            ~name=fieldFloatName,
            ~value=0.0,
          )
        ->Animation_Component.create(
            ~state=_,
            ~data={
              component: FieldFloat(entity, fieldFloatName),
              isPlaying: true,
              keyframes,
              entity,
              name: animationName,
              wrapMode: Loop,
              currentTime: 0.0,
              isFinished: false,
            }
          )
        ->tick(2000.0, _)
        ->(
            state => {
              const newState = tick(2000.0, state);

              _assert(
                getFieldFloat(newState).value === 0.66,
              );
              _assert(getAnimation(newState).isFinished === true);
              _assert(getAnimation(newState).isPlaying === true);
              _assert(getAnimation(newState).currentTime === 66.0);

              newState;
            }
          )
        ->(
            // Second tick should reset isFinished flag
            state => {
              const newState = tick(2010.0, state);

              _assert(getAnimation(newState).isFinished === false);
              _assert(getAnimation(newState).currentTime === 76.0);

              newState;
            }
          );

      ();
    });

    it("getActiveFrame - should return active frame", _assert => {
      const animation: Type.animation = {
        entity,
        name: animationName,
        isPlaying: true,
        currentTime: 0.0,
        component: FieldFloat(entity, fieldFloatName),
        keyframes: [
          (
            {
              duration: 10.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
        ],
        isFinished: false,
        wrapMode: Once,
      };

      const {keyframeCurrentTime, keyframeIndex}: Animation_System.activeKeyframe =
        Animation_System.getActiveKeyframe(animation, false);

      _assert(keyframeCurrentTime === 0.0);
      _assert(keyframeIndex === 0);
    });

    it("getActiveFrame - should return active frame", _assert => {
      const animation: Type.animation = {
        entity: "",
        name: animationName,
        isPlaying: true,
        currentTime: 5.0,
        component: FieldFloat(entity, fieldFloatName),
        keyframes: [
          (
            {
              duration: 10.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
        ],
        isFinished: false,
        wrapMode: Once,
      };

      const {keyframeCurrentTime, keyframeIndex}: Animation_System.activeKeyframe =
        Animation_System.getActiveKeyframe(animation, false);

      _assert(keyframeCurrentTime === 5.0);
      _assert(keyframeIndex === 0);
    });

    it("getActiveFrame - should return active frame", _assert => {
      const animation: Type.animation = {
        entity: "",
        name: animationName,
        isPlaying: true,
        currentTime: 10.5,
        component: FieldFloat(entity, fieldFloatName),
        keyframes: [
          (
            {
              duration: 10.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
          (
            {
              duration: 1.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
        ],
        isFinished: false,
        wrapMode: Once,
      };

      const {keyframeCurrentTime, keyframeIndex}: Animation_System.activeKeyframe =
        Animation_System.getActiveKeyframe(animation, false);

      _assert(keyframeCurrentTime === 0.5);
      _assert(keyframeIndex === 1);
    });

    it("getActiveFrame - should return active frame", _assert => {
      const animation: Type.animation = {
        entity: "",
        name: animationName,
        isPlaying: true,
        currentTime: 2000.0,
        component: FieldFloat(entity, fieldFloatName),
        keyframes: [
          (
            {
              duration: 10.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
          (
            {
              duration: 1.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
          (
            {
              duration: 2.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
          (
            {
              duration: 100.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
        ],
        isFinished: false,
        wrapMode: Once,
      };

      const {keyframeCurrentTime, keyframeIndex, timeExceeded}: Animation_System.activeKeyframe =
        Animation_System.getActiveKeyframe(animation, false);

      _assert(keyframeCurrentTime === 1887.0);
      _assert(timeExceeded === true);
      _assert(keyframeIndex === (-1));
    });

    it("getActiveFrame - should works with Loop animation", _assert => {
      const animation: Type.animation = {
        entity: "",
        name: animationName,
        isPlaying: true,
        currentTime: 2000.0,
        component: FieldFloat(entity, fieldFloatName),
        keyframes: [
          (
            {
              duration: 10.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
          (
            {
              duration: 1.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
          (
            {
              duration: 2.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
          (
            {
              duration: 100.0,
              timingFunction: Linear,
              valueRange: Float((0.0, 1.0)),
            }: Type.keyframe
          ),
        ],
        isFinished: false,
        wrapMode: Loop,
      };

      const {keyframeCurrentTime, keyframeIndex, timeExceeded}: Animation_System.activeKeyframe =
        Animation_System.getActiveKeyframe(animation, false);

      _assert(keyframeCurrentTime === 66.0);
      _assert(timeExceeded === true);
      _assert(keyframeIndex === 3);
    });
  });
};
