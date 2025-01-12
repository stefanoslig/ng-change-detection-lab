import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'syn-navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  zoneEnabled = input.required();
}
