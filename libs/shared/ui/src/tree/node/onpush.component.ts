import { Component, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { NodeDirective } from './node.directive';
import { AsyncPipe, NgClass } from '@angular/common';
import { ContextMenuComponent } from '../../context-menu/context-menu.component';
import { DefaultComponent } from './default.component';

@Component({
  selector: 'syn-onpush',
  templateUrl: './node.html',
  styleUrl: 'node.directive.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    forwardRef(() => DefaultComponent),
    ContextMenuComponent,
    AsyncPipe,
    NgClass,
  ],
  providers: [
    {
      provide: NodeDirective,
      useExisting: forwardRef(() => OnpushComponent),
    },
  ],
})
export class OnpushComponent extends NodeDirective {}
