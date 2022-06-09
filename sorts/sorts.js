const SORTS = {
  "basic bubblesort": basicBubble,
  "better bubblesort": betterBubble,
  "insertion sort": insertionSort,
  "shell sort (Tokuda's gap seq.)": shellSort(tokudaGapSeq),
  "shell sort (experimentally optimal gap seq.)": shellSort(optimalGapSeq),
  "simple pivot quicksort": quicksort(pivotSelects.simple),
  "median of 3 quicksort": quicksort(pivotSelects.medianOfThree),
  "pseudomedian quicksort": quicksort(pivotSelects.pseudomedian),
  "quick mean sort": quickMeanSort,
  "Levimedian quicksort": quicksort(pivotSelects.Levimedian),
}
