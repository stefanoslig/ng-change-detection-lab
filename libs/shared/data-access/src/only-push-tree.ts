import { ChangeDetectionStrategy } from '@angular/core';
import { TreeNode } from './node';

const tree: TreeNode = {
  type: ChangeDetectionStrategy.OnPush,
  children: [
    {
      type: ChangeDetectionStrategy.OnPush,
      children: [
        {
          type: ChangeDetectionStrategy.OnPush,
          children: [
            {
              type: ChangeDetectionStrategy.OnPush,
            },
            {
              type: ChangeDetectionStrategy.OnPush,
            },
          ],
        },
        {
          type: ChangeDetectionStrategy.OnPush,
          children: [
            {
              type: ChangeDetectionStrategy.OnPush,
            },
            {
              type: ChangeDetectionStrategy.OnPush,
            },
          ],
        },
      ],
    },
    {
      type: ChangeDetectionStrategy.OnPush,
      children: [
        {
          type: ChangeDetectionStrategy.OnPush,
          children: [
            {
              type: ChangeDetectionStrategy.OnPush,
            },
            {
              type: ChangeDetectionStrategy.OnPush,
            },
          ],
        },
        {
          type: ChangeDetectionStrategy.OnPush,
          children: [
            {
              type: ChangeDetectionStrategy.OnPush,
            },
            {
              type: ChangeDetectionStrategy.OnPush,
            },
          ],
        },
      ],
    },
  ],
};

export default tree;
