## The need for Reactivity

> Reactivity is a design paradigm that refers to a system's ability to respond to changes in data or state automatically.

All modern front-end frameworks have implemented their own versions of reactivity so developers don't have to worry about synchronizing changes in the state or data (Model) with the UI (View).

A few years ago, Angular adopted `Zone.js` as the foundational tool for its implementation of reactivity. The following paragraphs serve as a cheat sheet explaining how reactivity works in Angular today using Zone.js, how it has evolved in recent years into a more fine-grained reactivity model with `Signals`, and finally, how reactivity functions without Zone.js.

In Angular, we traditionally refer to this process of keeping the View in sync with the Model as `Change Detection`.

## How Change Detection works

### Default Change Detection

An Angular app might consist of several components (in most cases, hundreds or even thousands in enterprise applications). These components form a structure known as the component tree. Angular allows us to specify two modes of change detection strategies in our components. When the `Default` strategy is selected, a change detection cycle always starts from the root component of this tree and traverses it in a depth-first order, visiting every node. For each node it visits, a number of actions are performed to ensure that changes in the `Model`(state/data) are reflected in the `View`. In most cases, this is a fast process. However, there are situations where change detection can become a performance bottleneck for an app.

### OnPush Change Detection

By setting the `OnPush` strategy for our components, we can exclude branches of the component tree during the change detection traversal. When a component uses the `OnPush` change detection strategy, the component itself and its children are checked for changes only when they are marked as "dirty" under one of the following scenarios:

- One of its `@Input` properties changes (Angular compares the values of `@Input` properties by reference).
- An event is emitted from the component.
- The `ChangeDetectorRef.markForCheck` function is called manually.
- An Observable consumed by an `async` pipe in the template emits a new value.

The `markForCheck` function marks the component itself and all of its ancestors in the component tree as "dirty," running recursively from the component up to the root component.

## When a Change Detection cycle is triggered?

WIP
