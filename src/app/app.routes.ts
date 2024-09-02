import { Routes } from '@angular/router';
import { GameboardComponent } from './gameboard/gameboard.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { OtherGamesComponent } from './other-games/other-games.component';
import { GameFormComponent } from './game-form/game-form.component';

export const routes: Routes = [
  {
    path: '',
    component: GameFormComponent,
    title: 'Minesweeper',
  },
  {
    path: 'scoreboard',
    component: ScoreboardComponent,
    title: 'Scoreboard',
  },
  {
    path: 'other-games',
    component: OtherGamesComponent,
    title: 'Other Games',
  },
];
