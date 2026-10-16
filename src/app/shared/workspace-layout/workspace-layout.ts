import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthSessionService } from '../../core/auth/auth-session.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-workspace-layout',
  templateUrl: './workspace-layout.html',
  styleUrl: './workspace-layout.scss',
})
export class WorkspaceLayout {
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  readonly currentUser = this.authSession.currentUser;

  logout(): void {
    this.authSession.logout();
    void this.router.navigateByUrl('/ingresar');
  }
}