import { Block } from './Block';
import { GameStatus } from './enums/GameStatus';

export type Game = {
  GameId: number;
  GameStatus: GameStatus;
  Minefield: Block[];
  Height: number;
  Width: number;
  NumOfMines: number;
  UserId: string;
};
