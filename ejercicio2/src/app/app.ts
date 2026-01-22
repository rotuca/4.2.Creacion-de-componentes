import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyPanel } from './components/my-panel/my-panel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyPanel],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ejercicio2');
}
