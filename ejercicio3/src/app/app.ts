import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Boton } from './components/boton/boton';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Boton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ejercicio3');
}
