import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import {
  TreeNode,
  TreeSelection,
  generateRandomTree,
} from '@ng-change-detection-lab/data-access';
import { fromEvent } from 'rxjs';
import {
  DefaultComponent,
  FooterComponent,
  NavbarComponent,
  OnpushComponent,
} from '@ng-change-detection-lab/ui';

@Component({
  selector: 'cdl-zoneless-app',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    DefaultComponent,
    OnpushComponent,
    FooterComponent,
    NavbarComponent,
  ],
})
export class AppComponent implements AfterViewInit {
  private readonly app = inject(ApplicationRef);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  protected ChangeDetectionStrategy = ChangeDetectionStrategy;

  private readonly tickButton =
    viewChild<ElementRef<HTMLElement>>('tickButton');
  private readonly setTimeoutButton =
    viewChild<ElementRef<HTMLElement>>('setTimeoutButton');
  private readonly httpRequestButton =
    viewChild<ElementRef<HTMLElement>>('httpRequestButton');

  protected selectedTree = signal<TreeNode>(TreeSelection[0]);
  protected select(event: any) {
    if (event.target.value === '3') {
      this.selectedTree.set(generateRandomTree(4, 2));
    } else {
      this.selectedTree.set(TreeSelection[event.target.value]);
    }
    this.app.tick();
  }

  protected httpRequest() {
    this.http.get('', { responseType: 'text' }).subscribe();
  }

  protected setTimeout() {
    setTimeout(() => {}, 1000);
  }

  ngAfterViewInit() {
    fromEvent(this.tickButton()!.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.app.tick());
    fromEvent(this.setTimeoutButton()!.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.setTimeout());
    fromEvent(this.httpRequestButton()!.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.httpRequest());
  }
}
