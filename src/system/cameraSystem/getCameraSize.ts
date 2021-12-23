export const getCameraSize = (distance: number, aspectRatio: number) => {
  if (aspectRatio > 1) {
    return {
      left: -distance,
      right: distance,
      bottom: -distance * aspectRatio,
      top: distance * aspectRatio,
    }
  } else {
    return {
      bottom: -distance,
      top: distance,
      left: -distance / aspectRatio,
      right: distance / aspectRatio,
    }
  }
}
