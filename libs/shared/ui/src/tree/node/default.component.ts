import { Component, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { NodeDirective } from './node.directive';
import { AsyncPipe, NgClass } from '@angular/common';
import { ContextMenuComponent } from '../../context-menu/context-menu.component';
import { OnpushComponent } from './onpush.component';

@Component({
  selector: 'syn-default',
  templateUrl: './node.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: 'node.directive.scss',
  imports: [
    forwardRef(() => OnpushComponent),
    ContextMenuComponent,
    AsyncPipe,
    NgClass,
  ],
  providers: [
    {
      provide: NodeDirective,
      useExisting: forwardRef(() => DefaultComponent),
    },
  ],
})
export class DefaultComponent extends NodeDirective {}
