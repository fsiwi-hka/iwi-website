import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule, EmptyState],
  templateUrl: './not-found.html',
})
export class NotFound {}
