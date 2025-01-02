import { AfterViewInit, Component, ElementRef, NgZone, viewChild, input, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'syn-context-menu',
  templateUrl: './context-menu.component.html',
})
export class ContextMenuComponent implements AfterViewInit {
  private zone = inject(NgZone);
  private destroyRef = inject(DestroyRef);

  readonly target = input.required<HTMLElement>();

  readonly menu = viewChild<ElementRef>('contextMenu');

  ngAfterViewInit(): void {
    const targetElement = this.target();
    const menuElement = this.menu()?.nativeElement;

    this.zone.runOutsideAngular(() => {
      fromEvent<PointerEvent>(targetElement, 'click')
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter((event) => event.target === targetElement),
          tap((event) => {
            menuElement.classList.add('display');
            menuElement.style.transform = `translate(${event.offsetX}px,${event.offsetY}px)`;
          }),
          switchMap(() => {
            return fromEvent<PointerEvent>(document, 'click', {
              capture: true, // ignore the opening click
            }).pipe(
              take(1),
              tap(() => {
                menuElement.classList.remove('display');
              }),
            );
          }),
        )
        .subscribe();
    });
  }
}
