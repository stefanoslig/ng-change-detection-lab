import { Component } from '@angular/core';
import { SidePanelService } from './sidebar.service';

@Component({
  selector: 'syn-sidepanel',
  template: `
    <div class="side-panel">
      <h2>Side Panel</h2>
      <button (click)="close()">Close</button>
    </div>
  `,
  styles: [
    `
      .side-panel {
        padding: 20px;
        background: #ffffff;
        height: 100%;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
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
