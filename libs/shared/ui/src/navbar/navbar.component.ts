import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  AfterViewInit,
  viewChild,
  ElementRef,
  DestroyRef,
  NgZone,
} from '@angular/core';
import { SidePanelComponent } from '../sidebar/sidebar.component';
import { SidePanelService } from '../sidebar/sidebar.service';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'syn-navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements AfterViewInit {
  private readonly sidePanelService = inject(SidePanelService);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private readonly openSidebarBtn =
    viewChild<ElementRef<HTMLElement>>('openSidebarBtn');

  zoneEnabled = input.required();

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.openSidebarBtn()!.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.sidePanelService.open(SidePanelComponent));
    });
  }
}
