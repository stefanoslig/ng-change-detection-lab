import {
  ChangeDetectorRef,
  inject,
  model,
  Directive,
  ElementRef,
  viewChild,
  AfterViewInit,
  DestroyRef,
} from '@angular/core';
import { BaseNodeDirective } from './node.base';
import { Subject, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

type CdStatus =
  | 'HasChildViewsToRefresh'
  | 'RefreshView'
  | 'dirty'
  | 'Consumer dirty'
  | null;

@Directive()
export abstract class NodeDirective
  extends BaseNodeDirective
  implements AfterViewInit
{
  private readonly cd = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);

  private readonly parentNode = inject(NodeDirective, {
    optional: true,
    skipSelf: true,
  });

  private readonly updateSignal =
    viewChild<ElementRef<HTMLElement>>('updateSignal');
  private readonly async = viewChild<ElementRef<HTMLElement>>('async');
  private readonly mark = viewChild<ElementRef<HTMLElement>>('mark');
  private readonly detect = viewChild<ElementRef<HTMLElement>>('detect');
  private readonly httpRequestButton =
    viewChild<ElementRef<HTMLElement>>('httpRequestButton');

  public readonly value = model<number>(0);
  protected readonly value$ = new Subject();

  protected clicked() {
    this.traverseToRoot(this.el);
  }

  protected httpRequest() {
    this.http.get('', { responseType: 'text' }).subscribe();
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.updateSignal()!.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.value.update((value) => value + 1);
          this.traverseToRoot(this.el);
        });

      fromEvent(this.async()!.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.value$.next('');
          this.traverseToRoot(this.el);
        });

      fromEvent(this.mark()!.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.cd.markForCheck();
          this.traverseToRoot(this.el);
        });

      fromEvent(this.detect()!.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.cd.detectChanges();
          this.traverseToRoot(this.el);
        });
    });

    fromEvent(this.httpRequestButton()!.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.httpRequestButton();
      });
  }

  private traverseToRoot(
    element: ElementRef<HTMLElement>,
    cd: ChangeDetectorRef = this.cd
  ): void {
    const currentStatus = this.getCdStatus(cd);

    switch (currentStatus) {
      case 'dirty':
        element.nativeElement.querySelector('.dirty')?.classList.add('enabled');
        break;
      case 'HasChildViewsToRefresh':
        element.nativeElement
          .querySelector('.views-to-refresh')
          ?.classList.add('enabled');
        break;
    }

    if (this.parentNode) {
      this.parentNode.traverseToRoot(this.parentNode.el, this.parentNode.cd);
    }
  }

  private getCdStatus(cdRef: ChangeDetectorRef): CdStatus {
    const lView = (cdRef as any)._lView;
    const flags: number = lView[2];
    const consumer = lView[23];

    if (flags & 64) {
      return 'dirty';
    } else if (flags & 8192) {
      return 'HasChildViewsToRefresh';
    } else if (flags & 1024) {
      return 'RefreshView';
    } else if (consumer?.dirty) {
      return 'Consumer dirty';
    } else {
      return null;
    }
  }
}
