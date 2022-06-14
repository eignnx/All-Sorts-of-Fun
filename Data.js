class Data {
  data = {}
  // {
  //   "quicksort": {
  //     1024: {
  //     "true random": [
  //         { "comparisons": 120, "loads": 239, "stores": 88, "swaps": 44}
  //       ]
  //     }
  //   }
  // }
  
  addRunResults(sortName, arrSize, initMethod, info) {
    setOrDefault(this.data, sortName, {}, o1 => {
      setOrDefault(o1, arrSize, {}, o2 => {
        setOrDefault(o2, initMethod, [], runs => {
          runs.push(info)
        })
      })
    })
  }

  getAverages(sortName, arrSize, initMethod) {
    const runs = this.data[sortName][arrSize][initMethod]

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
