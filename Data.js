class Data {
  data = {}
  // {
  //   1024: {
  //     "true random": {
  //       "quicksort": [
  //         { "comparisons": 120, "loads": 239, "stores": 88, "swaps": 44}
  //       ]
  //     }
  //   }
  // }
  
  addRunResults(arrSize, initMethod, sortName, info) {
    setOrDefault(this.data, arrSize, {}, o1 => {
      setOrDefault(o1, initMethod, {}, o2 => {
        setOrDefault(o2, sortName, [], runs => {
          runs.push(info)
        })
      })
    })
  }

  getAverages(arrSize, initMethod, sortName) {
    const runs = this.data[arrSize][initMethod][sortName]

    const schema = Object.keys(runs[0])
    const averages = Object.fromEntries(schema.map(attr => [attr, 0]))
    
    for (const run of runs) {
      for (const [attr, value] of Object.entries(run)) {
        averages[attr] += value
      }
    }

    for (const attr of Object.keys(averages)) {
      averages[attr] = (averages[attr] / runs.length).toPrecision(3)
    }

    return averages
  }
}
