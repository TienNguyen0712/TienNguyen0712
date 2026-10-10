---
title: A visual guide to time complexity
date: 2026-05-02
category: cs
tags: [Algorithms, CS]
summary: Big-O notation with intuitive examples and practical trade-offs.
---

Big-O describes how the work an algorithm does **grows** as the input grows. It ignores constants and machine speed, and asks one question: *what happens when n gets large?*

## The common growth rates

| Notation | Name | Doubling n makes it… | Example |
| --- | --- | --- | --- |
| O(1) | constant | the same | array index lookup |
| O(log n) | logarithmic | one step slower | binary search |
| O(n) | linear | 2× slower | scanning a list |
| O(n log n) | linearithmic | a bit over 2× slower | merge sort |
| O(n²) | quadratic | 4× slower | comparing every pair |

## Feel the difference

Searching a sorted list of one million numbers:

```python
def linear_search(items, target):          # O(n): up to 1,000,000 steps
    for i, x in enumerate(items):
        if x == target:
            return i
    return -1

def binary_search(items, target):          # O(log n): about 20 steps
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

Twenty steps versus a million. That gap is why complexity matters more than a faster laptop.

## Trade-offs worth remembering

1. **Constants still exist.** For small inputs an O(n²) loop can beat an O(n log n) algorithm.
2. **Memory counts too.** Many fast algorithms buy speed with extra space.
3. **Measure before optimizing.** Big-O tells you the shape; a profiler tells you where the time really goes.

> Rule of thumb: if you see a loop inside a loop over the same data, stop and ask whether a hash map could replace the inner loop.
