import { Injectable, Type } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class SidePanelService {
  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay) {}

  open<T>(component: Type<T>): void {
    if (this.overlayRef) {
      this.close(); // Close any existing panel before opening a new one
    }

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().right('0').top('0'),
      width: '400px', // Adjust the width of the side panel
      height: '100vh', // Full viewport height
    });

    overlayRef.backdropClick().subscribe(() => this.close());

    const portal = new ComponentPortal(component, null);
    overlayRef.attach(portal);
    this.overlayRef = overlayRef;
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
