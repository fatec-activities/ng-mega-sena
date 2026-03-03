import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mega-sena',
  standalone: false,
  templateUrl: './mega-sena.html',
  styleUrl: './mega-sena.css',
})
export class MegaSena {
  megaSenaForm: FormGroup;
  response: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.megaSenaForm = this.formBuilder.group({
      megaSenaNumbers: [''],
      playerNumbers: [''],
    });
  }

  verifyNumbers() {
    const megaInput = this.megaSenaForm.value?.megaSenaNumbers;
    const playerInput = this.megaSenaForm.value?.playerNumbers;

    const result = this.parseInput(megaInput);
    const game = this.parseInput(playerInput);

    this.response = this.returnResult(result, game);
  }

  parseInput(input: string): number[] {
    const parts = input.split(',');
    const numbers: number[] = [];

    for (let i = 0; i < parts.length; i++) {
      const value = parts[i];
      const num = Number(value);

      if (value === '' || isNaN(num)) {
        return [];
      }

      numbers.push(num);
    }

    return numbers;
  }

  hasDuplicates(numbers: number[]): boolean {
    for (let a = 0; a < numbers.length; a++) {
      for (let b = a + 1; b < numbers.length; b++) {
        if (numbers[a] === numbers[b]) {
          return true;
        }
      }
    }

    return false;
  }

  isValidRange(numbers: number[]): boolean {
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] < 1 || numbers[i] > 60) {
        return false;
      }
    }

    return true;
  }

  countMatches(result: number[], game: number[]): string {
    let count = 0;

    for (let g = 0; g < game.length; g++) {
      for (let r = 0; r < result.length; r++) {
        if (game[g] === result[r]) {
          count++;
        }
      }
    }

    const matches: number = count;

    switch (matches) {
      case 6:
        return "You match 6 numbers. Sena.";
      case 5:
        return "You match 5 numbers. Quina.";
      case 4:
        return "You match 4 numbers. Quadra.";
      default:
        return "No prize.";
    }
  }

  returnResult(result: number[], game: number[]): string {
    if (result.length === 0 || game.length === 0) {
      return "Invalid input. Please enter numbers separated by commas.";
    }

    if (this.hasDuplicates(result) || this.hasDuplicates(game)) {
      return "The game and the result cannot have repeated numbers.";
    }

    if (result.length !== 6) {
      return "The result must have exactly 6 numbers.";
    }

    if (game.length < 6 || game.length > 10) {
      return "The game must have between 6 and 10 numbers.";
    }

    if (!this.isValidRange(result) || !this.isValidRange(game)) {
      return "The numbers must be between 1 and 60.";
    }

    return this.countMatches(result, game);
  }
}
