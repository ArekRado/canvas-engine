type EventBus = 'runOneFrame';

export const eventBusOn = <Data>(event: EventBus, callback: (data: Data) => void) => {
  document.addEventListener(event, (e: any) => callback(e.detail));
};

export const eventBusDispatch = <Data>(event: EventBus, data: Data) => {
  document.dispatchEvent(new CustomEvent(event, { detail: data }));
};

export const eventBusRemove = (
  event: EventBus,
  callback: () => void
) => {
  document.removeEventListener(event, callback);
};
