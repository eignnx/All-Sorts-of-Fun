const SORTS = {
  "basic bubblesort": basicBubble,
  "better bubblesort": betterBubble,
  "simple pivot quicksort": quicksort(pivotSelects.simple),
  "median of 3 quicksort": quicksort(pivotSelects.medianOfThree),
  "pseudomedian quicksort": quicksort(pivotSelects.pseudomedian),
  "quick mean sort": quickMeanSort,
}
