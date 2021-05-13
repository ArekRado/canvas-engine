import { vector, vectorZero } from '@arekrado/vector-2d'
import { componentName } from '../component'
import {
  Blueprint,
  Camera,
  Ellipse,
  GetDefaultComponent,
  Line,
  MouseInteraction,
  Rectangle,
} from '../type'
import { Animation, CollideBox, CollideCircle, Text, Sprite } from '../type'
import { createEntity } from '../entity'

export const animation: GetDefaultComponent<Animation> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.animation,
  keyframes: [],
  isPlaying: false,
  isFinished: false,
  currentTime: 0,
  property: {
    component: 'collideBox',
    path: '-',
    entityId: createEntity('-').id,
    index: -1,
  },
  wrapMode: 'once',
  timingMode: 'smooth',
  ...data,
})

export const collideBox: GetDefaultComponent<CollideBox> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.collideBox,
  size: vectorZero(),
  position: vectorZero(),
  collisions: [],
  ...data,
})

export const collideCircle: GetDefaultComponent<CollideCircle> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.collideCircle,
  radius: 1,
  position: vectorZero(),
  collisions: [],
  ...data,
})

export const sprite: GetDefaultComponent<Sprite> = ({ entityId, ...data }) => ({
  entityId,
  name: componentName.sprite,
  src: '',
  rotation: 0,
  scale: vector(1, 1),
  anchor: vector(0, 1),
  texture: undefined,
  ...data,
})

export const blueprint: GetDefaultComponent<Blueprint> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.blueprint,
  id: '',
  ...data,
})

export const mouseInteraction: GetDefaultComponent<MouseInteraction> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.mouseInteraction,
  clickSpeed: 200,
  doubleClickSpeed: 200,
  isClicked: false,
  isDoubleClicked: false,
  isMouseOver: false,
  isMouseEnter: false,
  isMouseLeave: false,
  ...data,
})

export const camera: GetDefaultComponent<Camera> = ({ entityId, ...data }) => ({
  entityId,
  name: componentName.camera,
  position: vectorZero(),
  zoom: 1,
  pivot: vectorZero(),
  ...data,
})

export const text: GetDefaultComponent<Text> = ({ entityId, ...data }) => ({
  entityId,
  name: componentName.text,
  value: '',
  rotation: 0,
  skew: vectorZero(),
  anchor: vectorZero(),
  // skewText.skew.set(0.65,-0.3);
  // skewText.anchor.set(0.5, 0.5);
  // skewText.x = 300;
  // skewText.y = 480;

  fontFamily: 'Arial',
  dropShadow: false,
  dropShadowAlpha: 0,
  dropShadowAngle: 0,
  dropShadowBlur: 0,
  dropShadowColor: [0, 0, 0, 0],
  dropShadowDistance: 0,
  fill: [],
  stroke: '',
  fontSize: 0,
  fontStyle: 'italic',
  fontWeight: 'lighter',
  lineJoin: 'round',
  wordWrap: false,
  strokeThickness: 0,
  ...data,
})

export const line: GetDefaultComponent<Line> = ({ entityId, ...data }) => ({
  entityId,
  name: componentName.line,
  path: [vectorZero()],
  borderColor: [0, 0, 0, 0],
  ...data,
})

export const rectangle: GetDefaultComponent<Rectangle> = ({
  entityId,
  ...data
}) => ({
  entityId,
  name: componentName.rectangle,
  size: vectorZero(),
  fillColor: [0, 0, 0, 0],
  fillAlpha: 0,
  color: '',
  ...data,
})

export const ellipse: GetDefaultComponent<Ellipse> = ({ entityId, ...data }) => ({
  entityId,
  name: componentName.ellipse,
  size: [0, 0],
  fillColor: [0, 0, 0, 0],
  fillAlpha: 0,
  color: '',
  ...data,
})
