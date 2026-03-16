import * as migration_20260309_071510 from './20260309_071510';
import * as migration_20260316_021732 from './20260316_021732';

export const migrations = [
  {
    up: migration_20260309_071510.up,
    down: migration_20260309_071510.down,
    name: '20260309_071510',
  },
  {
    up: migration_20260316_021732.up,
    down: migration_20260316_021732.down,
    name: '20260316_021732'
  },
];
