const SORTS = {
  "basic bubblesort": basicBubble,
  
  "optimized bubblesort": betterBubble,
  
  "insertion sort": insertionSort,
  
  "shell sort (Tokuda's gap seq.)": shellSort(tokudaGapSeq),
  
  "shell sort (experimentally optimal gap seq.)": shellSort(optimalGapSeq),
  
  "simple pivot quicksort": quicksort({selectPivot: pivotSelects.simple}),
  
  "random pivot quicksort": quicksort({selectPivot: pivotSelects.random}),
  
  "quicksort (random pivot, stop at 10); optimal shell":
    quicksort({
      selectPivot: pivotSelects.random,
      haltCriterion: len => (len <= 10),
    }).thenDoPass(shellSort(optimalGapSeq)),
  
  "quicksort (random pivot, stop at 10); insertion sort":
    quicksort({
      selectPivot: pivotSelects.random,
      haltCriterion: len => (len <= 10),
    }).thenDoPass(insertionSort),
  
  "quicksort (random pivot, stop at 5); insertion sort":
    quicksort({
      selectPivot: pivotSelects.random,
      haltCriterion: len => (len <= 5),
    }).thenDoPass(insertionSort),
  
  "quicksort (random pivot, (stop at 10; insertion sort))":
    quicksort({
      selectPivot: pivotSelects.random,
      haltCriterion: len => (len <= 10),
      postHaltAction: insertionSort,
    }),
  
  "quicksort (random pivot, (stop at 5; insertion sort))":
    quicksort({
      selectPivot: pivotSelects.random,
      haltCriterion: len => (len <= 5),
      postHaltAction: insertionSort,
    }),
  
  "quicksort (random pivot, (stop at 10; shell sort))":
    quicksort({
      selectPivot: pivotSelects.random,
      haltCriterion: len => (len <= 10),
      postHaltAction: shellSort(optimalGapSeq),
    }),
  
  "quicksort (random pivot, (stop at 5; shell sort))":
    quicksort({
      selectPivot: pivotSelects.random,
      haltCriterion: len => (len <= 5),
      postHaltAction: shellSort(optimalGapSeq),
    }),
  
  "median of 3 quicksort": quicksort({selectPivot: pivotSelects.medianOfThree}),
  
  "quicksort (median of sqrt(len) via insertion)":
    quicksort({selectPivot: pivotSelects.medianOfSqrtLenInsertion}),
  
  "quicksort (median of sqrt(len) via optimal shell)":
    quicksort({selectPivot: pivotSelects.medianOfSqrtLenShell(optimalGapSeq)}),
  
  "quicksort (median of sqrt(len) via optimal shell) optimized":
    quicksort({
      selectPivot: steppedSortMedian(steppedShellSort(optimalGapSeq), Math.sqrt),
      partition: presortAwarePartition((start, end) => {
        const subLen = Math.floor(Math.sqrt(end - start))
        return idx => (idx - start) % subLen === 0
      })
  }),
  
  "pseudomedian quicksort": quicksort({selectPivot: pivotSelects.pseudomedian}),
  
  "Levimedian quicksort": quicksort({selectPivot: pivotSelects.Levimedian}),

  "heapsort": heapsort,
}
