export type Guid = string

export const humanFriendlyEntity = (entity: Guid) => entity.split('###')[0]
