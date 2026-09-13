import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { AuthStore } from '../../auth/auth.store';
import { APP_CONFIG } from '../../config/app-config';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

/** Ab dieser Breite steht die Navigation dauerhaft neben dem Inhalt. */
const DESKTOP = '(min-width: 1024px)';

/** Rahmen fuer alle angemeldeten Seiten: Sidenav, Toolbar, Inhalt. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, Sidebar, Topbar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly config = inject(APP_CONFIG);
  protected readonly user = this.auth.user;

  /** requireSync: der BreakpointObserver liefert den ersten Wert synchron. */
  protected readonly isDesktop = toSignal(
    inject(BreakpointObserver)
      .observe(DESKTOP)
      .pipe(map((state) => state.matches)),
    { requireSync: true },
  );

  private readonly mobileNavOpen = signal(false);

  protected readonly sidenavMode = computed(() => (this.isDesktop() ? 'side' : 'over'));
  protected readonly sidenavOpened = computed(() => this.isDesktop() || this.mobileNavOpen());

  protected toggleSidenav(): void {
    this.mobileNavOpen.update((open) => !open);
  }

  protected closeSidenav(): void {
    this.mobileNavOpen.set(false);
  }

  /** Nach einem Navigationsklick schliesst sich nur das mobile Overlay. */
  protected closeOnMobile(): void {
    if (!this.isDesktop()) {
      this.mobileNavOpen.set(false);
    }
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    this.toast.info('Du bist abgemeldet.');
    await this.router.navigate(['/login']);
  }
}
