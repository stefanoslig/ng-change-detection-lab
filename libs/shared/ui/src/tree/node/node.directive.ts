import {
  ChangeDetectorRef,
  inject,
  Directive,
  ElementRef,
  viewChild,
  AfterViewInit,
  DestroyRef,
  signal,
  model,
  NgZone,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { TreeNode } from '@ng-change-detection-lab/data-access';

type CdStatus =
  | 'HasChildViewsToRefresh'
  | 'RefreshView'
  | 'dirty'
  | 'Consumer dirty'
  | null;

@Directive()
export abstract class NodeDirective implements AfterViewInit {
  private readonly cd = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);

  public readonly node = input<TreeNode>();

  private readonly parentNode = inject(NodeDirective, {
    optional: true,
    skipSelf: true,
  });
  protected readonly strategy = ChangeDetectionStrategy;
  private timeout?: any;

  private readonly updateSignal =
    viewChild<ElementRef<HTMLElement>>('updateSignal');
  private readonly updateInput =
    viewChild<ElementRef<HTMLElement>>('updateInput');
  private readonly async = viewChild<ElementRef<HTMLElement>>('async');
  private readonly mark = viewChild<ElementRef<HTMLElement>>('mark');
  private readonly detect = viewChild<ElementRef<HTMLElement>>('detect');
  private readonly httpRequestButton =
    viewChild<ElementRef<HTMLElement>>('httpRequestButton');

  public readonly valueNoPassedAsInput = signal<number>(0);
  public readonly value = model<number>(0);
  protected readonly value$ = new Subject();

  protected clicked() {
    this.traverseToRoot(this.el);
  }

  protected httpRequest() {
    this.http.get('', { responseType: 'text' }).subscribe();
  }

  protected cdCheck() {
    this.zone.runOutsideAngular(() => {
      const nodeElement = this.el.nativeElement.querySelector('.node');
      nodeElement.classList.add('checked');
      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        nodeElement.classList.remove('checked');
        this.timeout = undefined;
      }, 1000);
    });
  }

  ngDoCheck() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.el.nativeElement
          .querySelector('.views-to-refresh')
          ?.classList.remove('enabled');
        this.el.nativeElement
          .querySelector('.dirty')
          ?.classList.remove('enabled');
      }, 1000);
    });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.updateSignal()!.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.valueNoPassedAsInput.update((value) => value + 1);
          this.traverseToRoot(this.el);
        });

      fromEvent(this.updateInput()!.nativeElement, 'click')
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
