class Data {
  // data = {
  //   1024: {
  //     "true random": {
  //       "quicksort": [
  //         { "comparisons": 120, "loads": 239, "stores": 88, "swaps": 44}
  //       ]
  //     }
  //   }
  // }

  static LOCAL_STORAGE_KEY = "Data.data"

  constructor() {
    this.data = JSON.parse(localStorage.getItem(Data.LOCAL_STORAGE_KEY)) ?? {}
  }

  addRunResults(arrSize, initMethod, sortName, info) {
    setOrDefault(this.data, arrSize, {}, o1 => {
      setOrDefault(o1, initMethod, {}, o2 => {
        setOrDefault(o2, sortName, [], runs => {
          runs.push(info)
        })
      })
    })

    localStorage.setItem(Data.LOCAL_STORAGE_KEY, JSON.stringify(this.data))
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

  deleteSortRows([arrSize, initMethod, sortName]) {
    delete this.data[arrSize][initMethod][sortName]
    
    if (Object.isEmpty(this.data[arrSize][initMethod]))
      delete this.data[arrSize][initMethod]
    
    if (Object.isEmpty(this.data[arrSize]))
      delete this.data[arrSize]

    localStorage.setItem(Data.LOCAL_STORAGE_KEY, JSON.stringify(this.data))
  }

  deleteAll() {
    this.data = {}
    localStorage.removeItem(Data.LOCAL_STORAGE_KEY)
  }

  nonempty() {
    return Object.keys(this.data).length > 0
  }

  
}
