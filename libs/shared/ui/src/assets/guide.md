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

## When is a Change Detection Triggered?

Angular relies on a library called `Zone.js` to invoke a change detection cycle. `Zone.js` monkey-patches more than 250 browser APIs (e.g., XHR requests, DOM events, setInterval). Angular loads `Zone.js` and creates a zone called `NgZone`. `NgZone` contains an `onMicroTaskEmpty` observable, which Angular subscribes to. It triggers change detection when the microtask queue is empty by calling `AppRef.tick()`.

## Reactivity model using Signals in Angular

`Signals` is the reactivity model selected by the Angular team as a replacement for the existing model using `NgZone`.

> A Signal is a wrapper around a value that notifies interested consumers when the value changes.

### The Producer/Consumer Abstraction

The reactivity model in Angular using `Signals` is based on two abstractions: `Producers` and `Consumers`.

- `Consumers` represent `reactive contexts` (tracking scopes).
- `Producers` represent entities that hold a value. Changes to this value can be tracked only when the producer is accessed within a consumer's reactive context.

In this sense, we can think of consumers and producers as interconnected nodes, forming a `dependency graph` that describes the reactive behavior of a system. In an Angular component, the View acts as a consumer. When a producer, like a Signal, is accessed within the View, the consumer begins tracking it. When the value of the Signal changes, the reactive consumer of the template is notified. In that case, two things happen:

1. The View is marked with the **`RefreshView`** flag.
2. The **`markAncestorsForTraversal`** function is called, marking all ancestors of the View with the **`HasChildViewsToRefresh`** flag.

### Global/Targeted Change Detection

When `Zone.js` triggers a change detection cycle, Angular traverses the component tree from top to bottom, as described earlier. However, this traversal always happens in one of two modes: **`Global`** or **`Targeted`**.

In an Angular app using `Zone.js`, the traversal of the component tree begins in `Global` mode by default. In this mode, as previously discussed:

- A component is always checked when its change detection strategy is `Default`.
- A component with the `OnPush` strategy is checked only if it is marked as `dirty`.
- When Angular encounters a `non-dirty` component with the `OnPush` strategy, it switches to `Targeted` mode. In this mode, Angular will:

1. Visit components but will not perform change detection for components with the `Default` strategy or those marked as `dirty + OnPush`.
2. Perform change detection only for components marked with the `RefreshView` flag.
3. Switch back to `Global` mode when it reaches a component marked with the `RefreshView` flag.
