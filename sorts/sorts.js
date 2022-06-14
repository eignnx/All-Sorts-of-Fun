const SORTS = {
  "basic bubblesort": basicBubble,
  
  "optimized bubblesort": betterBubble,
  
  "insertion sort": insertionSort,
  
  "shell sort (Tokuda's gap seq.)": shellSort(tokudaGapSeq),
  
  "shell sort (experimentally optimal gap seq.)": shellSort(optimalGapSeq),
  
  "simple pivot quicksort": quicksort(pivotSelects.simple),
  
  "random pivot quicksort": quicksort(pivotSelects.random),
  
  "median of 3 quicksort": quicksort(pivotSelects.medianOfThree),
  
  "quicksort (median of sqrt(len) via insertion)":
    quicksort(pivotSelects.medianOfSqrtLenInsertion),
  
  "quicksort (median of sqrt(len) via optimal shell)":
    quicksort(pivotSelects.medianOfSqrtLenShell(optimalGapSeq)),
  
  "quicksort (median of sqrt(len) via optimal shell) optimized":
    quicksort(
      steppedSortMedian(steppedShellSort(optimalGapSeq), Math.sqrt),
      presortAwarePartition((start, end) => {
        const subLen = Math.floor(Math.sqrt(end - start))
        return idx => (idx - start) % subLen === 0
      })
    ),
  
  "pseudomedian quicksort": quicksort(pivotSelects.pseudomedian),
  
  "Levimedian quicksort": quicksort(pivotSelects.Levimedian),
}
