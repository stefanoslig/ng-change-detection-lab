import { ChangeDetectionStrategy } from '@angular/core';
import { TreeNode } from './node';

export function generateRandomTree(
  maxDepth: number,
  maxChildren: number,
  currentDepth: number = 0
): TreeNode {
  const node: TreeNode = {
    type:
      Math.random() > 0.5
        ? ChangeDetectionStrategy.Default
        : ChangeDetectionStrategy.OnPush,
  };

  if (currentDepth < maxDepth) {
    const numChildren = Math.max(
      1,
      Math.floor(Math.random() * (maxChildren + 1)) // Ensure at least one child
    );
    node.children = Array.from({ length: numChildren }, () =>
      generateRandomTree(maxDepth, maxChildren, currentDepth + 1)
    );
  }

  return node;
}
