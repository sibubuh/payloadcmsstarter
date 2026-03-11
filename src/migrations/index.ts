import * as migration_20260309_071510 from './20260309_071510'

export const migrations = [
  {
    up: migration_20260309_071510.up,
    down: migration_20260309_071510.down,
    name: '20260309_071510',
  },
]
