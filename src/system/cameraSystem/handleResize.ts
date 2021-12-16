import { Camera, EventHandler } from '../../ecs/type';
import { CameraEvent, getCamera, getCameraSize, setCamera } from '../cameraSystem';
import { camera, scene } from '../..';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export const adjustBabylonCameraToComponentCamera = ({
  component,
}: {
  component: Partial<Camera>;
}) => {
  if (component.position) {
    camera.position.x = component.position[1];
    camera.position.y = component.position[0];
    camera.position.z = -10;
    camera.setTarget(new Vector3(component.position[1], component.position[0]));
  }

  const size = getCameraSize(component.distance ?? 0, scene);

  camera.orthoLeft = size.left;
  camera.orthoRight = size.right;
  camera.orthoBottom = size.bottom;
  camera.orthoTop = size.top;

  return size;
};

export const handleResize: EventHandler<Camera, CameraEvent.ResizeEvent> = ({
  state,
}) => {
  const camera = getCamera({ state });

  state = setCamera({
    state,
    data: camera || {},
  });

  return state;
};
