import { Component } from '@angular/core';
import { SidePanelService } from './sidebar.service';

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
      <section class="content"><p>WIP</p></section>
    </div>
  `,
  styles: [
    `
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border-bottom: 1px solid #ded9d9;
      }

      .content {
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
        position: absolute;
        right: 0;
        width: 40%;
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
})
export class SidePanelComponent {
  constructor(private sidePanelService: SidePanelService) {}

  close(): void {
    this.sidePanelService.close();
  }
}
