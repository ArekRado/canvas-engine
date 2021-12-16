import { boxWithGap } from '../../blueprints/gridBlueprint';
import { State } from '../../ecs/type';
import { getCamera } from '../cameraSystem';

export const getCameraSizes = ({
  state,
  boxScaleFactor,
}: {
  state: State;
  boxScaleFactor: number;
}) => {
  const camera = getCamera({ state });

  if (camera) {
    const leftEdge = camera.position[0] + camera.left;
    const topEdge = camera.position[1] + camera.top;
    const boxSize = boxWithGap / boxScaleFactor;
    const screenSize = [camera.right * 2, camera.top * 2];

    return {
      leftEdge,
      topEdge,
      boxSize,
      screenSize,
    };
  }
  return {
    leftEdge: 0,
    topEdge: 0,
    boxSize: 0,
    screenSize: [0, 0],
    
  };
};
