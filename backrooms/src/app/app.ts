import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Wurzel der App. Toasts (MatSnackBar) und Dialoge (MatDialog) haengt Material
 * selbst ins Overlay, es braucht dafuer keine Container-Komponente mehr.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
