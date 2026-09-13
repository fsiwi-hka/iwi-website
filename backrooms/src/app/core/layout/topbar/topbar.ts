import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { User } from '../../../shared/models';

@Component({
  selector: 'app-topbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  readonly user = input<User | null>(null);
  readonly showMenuButton = input(false);
  readonly toggleNav = output<void>();
  readonly logout = output<void>();

  protected readonly initials = computed(() =>
    (this.user()?.displayName ?? '?')
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );

  protected readonly roleLabel = computed(() =>
    this.user()?.roles.includes('admin') ? 'Admin' : 'Redaktion',
  );
}
