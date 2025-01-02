import { TreeNode } from '@ng-change-detection-lab/data-access';
import {
  ChangeDetectionStrategy,
  DoCheck,
  ElementRef,
  NgZone,
  input,
  inject,
  Directive,
} from '@angular/core';

@Directive()
export class BaseNodeDirective {
  protected el = inject(ElementRef<HTMLElement>);
  protected zone = inject(NgZone);

  public readonly node = input<TreeNode>();

  public strategy = ChangeDetectionStrategy;

  private timeout?: any;

  public cdCheck() {
    this.zone.runOutsideAngular(() => {
      const nodeElement = this.el.nativeElement.querySelector('.node');
      nodeElement.classList.add('checked');
      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        nodeElement.classList.remove('checked');
        this.timeout = undefined;
      }, 800);
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
      }, 800);
    });
  }
}
