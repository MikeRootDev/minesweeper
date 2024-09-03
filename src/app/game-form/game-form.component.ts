import { Component, ViewChild } from '@angular/core';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { interval, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [GameboardComponent, FormsModule, NgIf],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.css',
})
export class GameFormComponent {
  @ViewChild(GameboardComponent) gameBoardComponent!: GameboardComponent;
  hasGameStarted: boolean = false;
  height: number = 12;
  width: number = 20;
  numOfMines: number = 80;
  flagCount: number = 0;
  timer: string = '000';

  private timerSubscription!: Subscription;

  ngAfterViewInit(): void {
    this.startGame(false);
  }

  onFlagCountChange(increment: number): void {
    this.flagCount = this.flagCount + increment;
  }

  onGameStatusChange(): void {
    this.hasGameStarted = true;
    this.startTimer();
  }

  startTimer(): void {
    this.timerSubscription = interval(1000)
      .pipe(
        map((seconds) => {
          // Format the seconds as a string with leading zeros
          return String(seconds + 1).padStart(3, '0');
        })
      )
      .subscribe((formattedTime) => {
        this.timer = formattedTime;
      });
  }

  get isTimerBelowThousand(): boolean {
    return parseInt(this.timer, 10) < 1000;
  }

  startGame(showWarning: boolean): void {
    if (showWarning && this.hasGameStarted) {
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
