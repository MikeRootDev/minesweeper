import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { FormsModule, NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [GameboardComponent, FormsModule, NgIf],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.css',
})
export class GameFormComponent {
  //implements AfterViewInit {
  @ViewChild(GameboardComponent) gameBoardComponent!: GameboardComponent;
  hasGameStarted: boolean = false;
  height: number = 12;
  width: number = 20;
  numOfMines: number = 80;

  ngAfterViewInit(): void {
    this.startGame(false);
  }

  startGame(showWarning: boolean): void {
    if (showWarning) {
      const userConfirmed = confirm(
        "Hey bruh, sure you want to create a new game?  You'll lose all progress on your current game.  Proceed anyway?"
      );
    }
    if (this.gameBoardComponent) {
      this.gameBoardComponent.createMinefield(
        this.height,
        this.width,
        this.numOfMines
      );
    }
  }
}
