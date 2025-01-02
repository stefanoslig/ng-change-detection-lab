import { ChangeDetectionStrategy } from '@angular/core';

export interface TreeNode {
  type: ChangeDetectionStrategy;
  children?: TreeNode[];
}
