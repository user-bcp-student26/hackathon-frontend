import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  selector: 'app-auth-frame',
  templateUrl: './auth-frame.html',
  styleUrl: './auth-frame.scss',
})
export class AuthFrame {
  readonly headline = input.required<string>();
  readonly description = input.required<string>();
  readonly steps = input.required<readonly string[]>();
}