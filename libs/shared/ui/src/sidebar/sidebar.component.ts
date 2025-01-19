import {
  Component,
  inject,
  DestroyRef,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SidePanelService } from './sidebar.service';
import { HttpClient } from '@angular/common/http';
import { marked } from 'marked';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'syn-sidepanel',
  template: `
    <div class="side-panel">
      <div class="header">
        <div class="header-title">
          <img class="logo" src="assets/shared/ui/logo.png" />
          <h2>Change detection cheat sheet</h2>
        </div>
        <button class="close-btn" (click)="close()">x</button>
      </div>
      <section class="content">
        @if(markdownContent()) {
        <p class="markdown-body" [innerHTML]="markdownContent()"></p>
        }
      </section>
    </div>
  `,
  styles: [
    `
      .header {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border-bottom: 1px solid #ded9d9;
      }

      .content {
        flex-grow: 1;
        overflow-y: auto;
        padding: 20px;
        font-size: 1rem;
      }

      .header-title {
        display: flex;
        align-items: center;

        .logo {
          margin-right: 5px;
          width: 32px;
        }
      }

      .side-panel {
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 0;
        width: 40%;
        max-width: 800px;
        background: #ffffff;
        height: 100%;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
      }

      .close-btn {
        background: white;
        border: 1px solid #8c8989;
        color: #8c8989;
        font-size: 1.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent {
  private readonly sidePanelService = inject(SidePanelService);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  markdownContent = signal<string | null>(null);

  constructor() {
    this.loadMarkdown();
  }

  close(): void {
    this.sidePanelService.close();
  }

  private loadMarkdown(): void {
    this.http
      .get('assets/shared/ui/guide.md', { responseType: 'text' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log(marked(data));
          this.markdownContent.set(marked(data) as string);
        },
        error: (err) => {
          console.error('Failed to load markdown file:', err);
        },
      });
  }
}
