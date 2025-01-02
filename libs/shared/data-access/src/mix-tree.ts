import { ChangeDetectionStrategy } from '@angular/core';
import { TreeNode } from './node';

const tree: TreeNode = {
  type: ChangeDetectionStrategy.Default,
  children: [
    {
      type: ChangeDetectionStrategy.OnPush,
      children: [
        {
          type: ChangeDetectionStrategy.OnPush,
        },
        {
          type: ChangeDetectionStrategy.Default,
        },
      ],
    },
    {
      type: ChangeDetectionStrategy.Default,
      children: [
        {
          type: ChangeDetectionStrategy.OnPush,
        },
        {
          type: ChangeDetectionStrategy.Default,
        },
      ],
    },
  ],
};

export default tree;
