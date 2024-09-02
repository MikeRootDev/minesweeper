import { BlockStatus } from './enums/BlockStatus';

export type Block = {
  BlockId: number;
  BlockStatus: BlockStatus;
  X: number;
  Y: number;
  IsMine: boolean;
};
