import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { Camera, State } from '../ecs/type';
import { getAspectRatio } from '../utils/getAspectRatio';
import { setBackground } from './backgroundSystem';
import { adjustBabylonCameraToComponentCamera } from './cameraSystem/handleResize';
import { setLogo } from './logoSystem';
import { ECSEvent } from '../ecs/createEventSystem';
import { Scene } from '@babylonjs/core/scene';

export const cameraEntity = 'cameraEntity';
export namespace CameraEvent {
  export enum Type {
    resize = 'CameraEvent-resize',
  }

  export type All = ResizeEvent;

  export type ResizeEvent = ECSEvent<Type.resize, {}>;
}

const cameraGetSet = createGetSetForUniqComponent<Camera>({
  entity: cameraEntity,
  name: componentName.camera,
});

export const getCamera = cameraGetSet.getComponent;
export const setCamera = ({
  state,
  data,
}: {
  state: State;
  data: Partial<Camera>;
}) => {
  const size = adjustBabylonCameraToComponentCamera({ component: data });
  state = cameraGetSet.setComponent({ state, data: { ...data, ...size } });

  state = setBackground({ state, data: {} });
  state = setLogo({ state, data: {} });

  return state;
};

export const getCameraSize = (distance: number, scene: Scene) => {
  const aspect = getAspectRatio(scene);

  if (aspect > 1) {
    return {
      left: -distance,
      right: distance,
      bottom: -distance * aspect,
      top: distance * aspect,
    };
  } else {
    return {
      bottom: -distance,
      top: distance,
      left: -distance / aspect,
      right: distance / aspect,
    };
  }
};

export const cameraSystem = (state: State) =>
  createSystem<Camera>({
    state,
    name: componentName.camera,
    create: ({ state, component }) => {
      state = setCamera({ state, data: component });

      return state;
    },
  });
