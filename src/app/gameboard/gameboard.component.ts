import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Game } from '../models/Game';
import { BlockStatus } from '../models/enums/BlockStatus';
import { GameStatus } from '../models/enums/GameStatus';
import { AppConstants } from '../app-constants';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-gameboard',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './gameboard.component.html',
  styleUrl: './gameboard.component.css',
})
export class GameboardComponent {
  public game: Game = {
    GameId: 1,
    GameStatus: GameStatus.NotStarted,
    Height: 12, // default - override before anything else
    Width: 20, // default - override before anything else
    UserId: '1',
    NumOfMines: 1,
    Minefield: [],
  };

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  public createMinefield(
    height: number,
    width: number,
    numOfMines: number
  ): void {
    this.game.Height = height;
    this.game.Width = width;
    this.game.NumOfMines = numOfMines;

    const parentElement =
      this.elRef.nativeElement.querySelector('#gameContainer');
    while (parentElement.firstChild) {
      this.renderer.removeChild(parentElement, parentElement.firstChild);
    }
    const fragment = document.createDocumentFragment();

    let counter = 0;
    for (let row = 0; row < this.game.Height; row++) {
      for (let col = 0; col < this.game.Width; col++) {
        counter++;
        const X = counter - row * this.game.Width;
        const Y = row + 1;
        const isMine = Math.random() >= 0.75;

        this.game.Minefield.push({
          BlockId: counter,
          BlockStatus: BlockStatus.Shielded,
          X,
          Y,
          IsMine: isMine,
        });

        const div = this.renderer.createElement('div');
        this.renderer.addClass(div, 'block');
        this.renderer.setAttribute(div, 'id', `X${col + 1}Y${row + 1}`);
        this.renderer.setStyle(div, 'height', `${AppConstants.BlockHeight}px`);
        this.renderer.setStyle(div, 'float', 'left');
        if (isMine) {
          this.renderer.addClass(div, 'mine');
        }

        // how we handle alternating block colors differs whether the num of cols is even or odd
        let className = '';
        // if the game has an even number of cols
        if (this.game.Width % 2 === 0) {
          className =
            (counter + row) % 2 === 1 ? 'block-style-one' : 'block-style-two';
        }
        // if the game has an odd number of cols
        else {
          className = counter % 2 === 1 ? 'block-style-one' : 'block-style-two';
        }

        this.renderer.addClass(div, className);
        this.renderer.listen(div, 'click', () => this.onBlockClick(div));
        this.renderer.listen(div, 'contextmenu', (event: MouseEvent) =>
          this.flagBlock(event)
        );

        fragment.appendChild(div);
      }
    }

    this.renderer.appendChild(parentElement, fragment);
  }

  flagBlock(event: MouseEvent): void {
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    if (targetElement.classList.contains('block')) {
      if (!targetElement.classList.contains('flagged')) {
        const coordinates: { x: number; y: number } = this.extractCoordinates(
          targetElement.id
        );
        let thisBlock = this.game.Minefield.find(
          (a) => a.X === coordinates.x && a.Y === coordinates.y
        );
        if (thisBlock?.BlockStatus != BlockStatus.Flagged) {
          let flagImage = this.renderer.createElement('img');
          this.renderer.addClass(flagImage, 'flag');
          this.renderer.setAttribute(flagImage, 'src', '/assets/flag.png');
          this.renderer.appendChild(event.target, flagImage);
          this.renderer.addClass(event.target, 'flagged');
          thisBlock!.BlockStatus = BlockStatus.Flagged;
        }
      }
    } else if (targetElement.classList.contains('flag')) {
      this.renderer.removeClass(targetElement.parentElement, 'flagged');
      this.renderer.removeChild(targetElement.parentElement, targetElement);
      const coordinates: { x: number; y: number } = this.extractCoordinates(
        targetElement!.parentElement!.id
      );
      let thisBlock = this.game.Minefield.find(
        (a) => a.X === coordinates.x && a.Y === coordinates.y
      );
      thisBlock!.BlockStatus = BlockStatus.Shielded;
    }
  }

  onBlockClick(element: HTMLElement): void {
    let coordinates: { x: number; y: number } = this.extractCoordinates(
      element.id
    );
    let potentialMine = this.game.Minefield.find(
      (a) => a.X === coordinates.x && a.Y === coordinates.y
    );
    if (potentialMine?.IsMine) {
      this.renderer.addClass(element, 'exploded');
    } else {
      if (element.classList.contains('block-style-one')) {
        this.renderer.addClass(element, 'empty-style-one');
      } else {
        this.renderer.addClass(element, 'empty-style-two');
      }

      let numOfMines = this.countSurroundingMines(coordinates.x, coordinates.y);
      if (numOfMines > 0) {
        let p = this.renderer.createElement('p');
        this.renderer.addClass(p, 'number');
        this.renderer.appendChild(
          p,
          this.renderer.createText(numOfMines.toString())
        );
        this.renderer.appendChild(element, p);
      }
    }
  }

  countSurroundingMines(x: number, y: number): number {
    let numOfMines = 0;
    // check left top corner
    if (this.game.Minefield.find((a) => y + 1 === a.Y && x - 1 === a.X)?.IsMine)
      numOfMines++;
    // check top middle
    if (this.game.Minefield.find((a) => y + 1 === a.Y && x === a.X)?.IsMine)
      numOfMines++;
    // check right top corner
    if (this.game.Minefield.find((a) => y + 1 === a.Y && x + 1 === a.X)?.IsMine)
      numOfMines++;
    // check left middle
    if (this.game.Minefield.find((a) => y === a.Y && x - 1 === a.X)?.IsMine)
      numOfMines++;
    // check right middle
    if (this.game.Minefield.find((a) => y === a.Y && x + 1 === a.X)?.IsMine)
      numOfMines++;
    // check left bottom corner
    if (this.game.Minefield.find((a) => y - 1 === a.Y && x - 1 === a.X)?.IsMine)
      numOfMines++;
    // check bottom middle
    if (this.game.Minefield.find((a) => y - 1 === a.Y && x === a.X)?.IsMine)
      numOfMines++;
    // check right bottom corner
    if (this.game.Minefield.find((a) => y - 1 === a.Y && x + 1 === a.X)?.IsMine)
      numOfMines++;
    return numOfMines;
  }

  extractCoordinates(input: string): { x: number; y: number } {
    const match = input.match(/X(\d+)Y(\d+)/);

    if (match && match.length === 3) {
      const x = parseInt(match[1], 10);
      const y = parseInt(match[2], 10);
      return { x, y };
    }
    throw new Error('Invalid input format');
  }
}
