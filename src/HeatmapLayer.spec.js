import { computeAggregate } from './Heatmap'

const POINTS = [
  {
    coordinates: [1, 2],
    intensity: 5,
  },
  {
    coordinates: [5, 6],
    intensity: 6,
  },
  {
    coordinates: [8, 7],
    intensity: 99,
  },
  {
    coordinates: [9, 1],
    intensity: 1,
  },
]

const AGG = {
  data: {},
  same: new Set(),
  seen: 1,
}

const getKey = (point) => `${point.coordinates[0]} - ${point.coordinates[1]}`

describe('computeAggregate', () => {
  describe('sum', () => {
    test('returns the intensity when given a single intensity', () => {
      const result = computeAggregate(AGG, 5, 'sum')
      expect(result).toBe(5)
    })

    test('returns the intensity for each intensity when given multiple different points', () => {
      const aggregates = {}

      POINTS.forEach((point) => {
        const key = getKey(point)

        aggregates[key] = {
          data: {},
          seen: 0,
        }

        aggregates[key].seen++

        const result = computeAggregate(aggregates[key], point.intensity, 'sum')
        expect(result).toBe(point.intensity)
      })
    })

    test('sums the intensity for each intensity when points overlap', () => {
      const aggregates = {}

      const point = {
        coordinates: [7, 1],
        intensity: 3,
      }

      const key = getKey(point)

      aggregates[key] = {
        data: {},
        seen: 0,
      }

      const n = 20

      for (let i = 0; i < n; i++) {
        aggregates[key].seen++
        computeAggregate(aggregates[key], point.intensity, 'sum')
      }

      expect(aggregates[key].data.sum).toBe(n * point.intensity)
    })
  })

  describe('count', () => {
    test('returns 1 when given a single intensity', () => {
      const result = computeAggregate(AGG, 5, 'count')
      expect(result).toBe(1)
    })

    test('increments the count for the same point each time', () => {
      const aggregates = {}

      const point = {
        coordinates: [5, 5],
        intensity: 3,
      }

      const key = getKey(point)

      aggregates[key] = {
        data: {},
        seen: 0,
      }

      const n = 5

      for (let i = 0; i < n; i++) {
        aggregates[key].seen++
        computeAggregate(aggregates[key], point.intensity, 'count')
      }

      expect(aggregates[key].data.count).toBe(n)
    })
  })

  describe('mean', () => {
    test('returns the intensity when given a single intensity', () => {
      const result = computeAggregate(AGG, 5, 'mean')
      expect(result).toBe(5)
    })

    test('computes a cumulative moving average for each point', () => {
      const aggregates = {}

      const visited = []

      POINTS.forEach((point) => {
        const key = getKey(point)

        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            seen: 0,
          }
        }

        aggregates[key].seen++

        const result = computeAggregate(aggregates[key], point.intensity, 'mean')

        // calculate average of all previously visited points
        // and then calculate the new average using a cumulative moving average
        let average = visited.reduce((p, c) => p + c, 0) / visited.length || 0
        average += (point.intensity - average) / aggregates[key].seen

        visited.push(point.intensity)

        expect(result).toBe(average)
      })
    })

    test('computes a final average for all points', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [5, 7],
          intensity: 4,
        },
        {
          coordinates: [5, 7],
          intensity: 3,
        },
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 9,
        },
        {
          coordinates: [5, 7],
          intensity: 11,
        },
        {
          coordinates: [5, 7],
          intensity: 6,
        },
      ]

      const key = getKey(points[0])

      points.forEach((point) => {
        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'mean')
      })

      expect(aggregates[key].data.mean).toBe(5.833333333333333)
    })
  })

  describe('distinct', () => {
    test('returns 1 when given a single unique intensity', () => {
      const result = computeAggregate(AGG, 5, 'distinct')
      expect(result).toBe(1)
    })

    test('returns the number of unique elements when given multiple intensity points', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [5, 7],
          intensity: 4,
        },
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 9,
        },
      ]

      const key = getKey(points[0])

      points.forEach((point) => {
        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'distinct')
      })

      expect(aggregates[key].data.distinct).toBe(3)
    })

    test('returns the number of unique elements when given duplicate intensities', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 9,
        },
        {
          coordinates: [5, 7],
          intensity: 9,
        },
        {
          coordinates: [5, 7],
          intensity: 10,
        },
      ]

      const key = getKey(points[0])

      points.forEach((point) => {
        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'distinct')
      })

      expect(aggregates[key].data.distinct).toBe(3)
    })
  })

  describe('min', () => {
    test('returns the intensity when given a single intensity', () => {
      const result = computeAggregate(AGG, 5, 'min')
      expect(result).toBe(5)
    })

    test('returns the min intensity value when given points at the same location', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [5, 7],
          intensity: 4,
        },
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 9,
        },
      ]

      const key = getKey(points[0])

      points.forEach((point) => {
        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'min')
      })

      expect(aggregates[key].data.min).toBe(2)
    })
  })

  describe('max', () => {
    test('returns the intensity when given a single intensity', () => {
      const result = computeAggregate(AGG, 5, 'max')
      expect(result).toBe(5)
    })

    test('returns the max intensity value when given points at the same location', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [5, 7],
          intensity: 4,
        },
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 9,
        },
      ]

      const key = getKey(points[0])

      points.forEach((point) => {
        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'max')
      })

      expect(aggregates[key].data.max).toBe(9)
    })
  })

  describe('stdev', () => {
    test('returns 0 when given a single intensity', () => {
      const result = computeAggregate(AGG, 5, 'stdev')
      expect(result).toBe(0)
    })

    test('returns the stdev when given points at the same location', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 5,
        },
        {
          coordinates: [5, 7],
          intensity: 1,
        },
        {
          coordinates: [5, 7],
          intensity: 89,
        },
        {
          coordinates: [5, 7],
          intensity: 6,
        },
      ]

      const key = getKey(points[0])

      points.forEach((point) => {
        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'stdev')
      })

      expect(aggregates[key].data.stdev).toBe(38.29229687548136)
    })

    test('returns the stdev when given points at different locations', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [6, 7],
          intensity: 2,
        },
        {
          coordinates: [9, 2],
          intensity: 5,
        },
        {
          coordinates: [6, 7],
          intensity: 1,
        },
        {
          coordinates: [6, 7],
          intensity: 89,
        },
        {
          coordinates: [1, 4],
          intensity: 6,
        },
      ]

      const targetKey = getKey(points[0])

      points.forEach((point) => {
        const key = getKey(point)

        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'stdev')
      })

      expect(aggregates[targetKey].data.stdev).toBe(50.52062285179522)
    })
  })

  describe('stdevp', () => {
    test('returns 0 when given a single intensity', () => {
      const result = computeAggregate(AGG, 5, 'stdevp')
      expect(result).toBe(0)
    })

    test('returns the population stdev when given points at the same location', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 5,
        },
        {
          coordinates: [5, 7],
          intensity: 1,
        },
        {
          coordinates: [5, 7],
          intensity: 89,
        },
        {
          coordinates: [5, 7],
          intensity: 6,
        },
      ]

      const key = getKey(points[0])

      points.forEach((point) => {
        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'stdevp')
      })

      expect(aggregates[key].data.stdevp).toBe(34.24967153127165)
    })

    test('returns the population stdev when given points at different locations', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [6, 7],
          intensity: 2,
        },
        {
          coordinates: [9, 2],
          intensity: 5,
        },
        {
          coordinates: [6, 7],
          intensity: 1,
        },
        {
          coordinates: [6, 7],
          intensity: 89,
        },
        {
          coordinates: [1, 4],
          intensity: 6,
        },
      ]

      const targetKey = getKey(points[0])

      points.forEach((point) => {
        const key = getKey(point)

        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'stdevp')
      })

      expect(aggregates[targetKey].data.stdevp).toBe(41.24991582482994)
    })
  })

  describe('variance', () => {
    test('returns 0 when given a single intensity', () => {
      const result = computeAggregate(AGG, 5, 'variance')
      expect(result).toBe(0)
    })

    test('returns the sample variance when given points at the same location', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 5,
        },
        {
          coordinates: [5, 7],
          intensity: 1,
        },
        {
          coordinates: [5, 7],
          intensity: 89,
        },
        {
          coordinates: [5, 7],
          intensity: 6,
        },
      ]

      const key = getKey(points[0])

      points.forEach((point) => {
        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'variance')
      })

      expect(aggregates[key].data.variance).toBe(1466.3)
    })

    test('returns the sample variance when given points at different locations', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [6, 7],
          intensity: 2,
        },
        {
          coordinates: [9, 2],
          intensity: 5,
        },
        {
          coordinates: [6, 7],
          intensity: 1,
        },
        {
          coordinates: [6, 7],
          intensity: 89,
        },
        {
          coordinates: [1, 4],
          intensity: 6,
        },
      ]

      const targetKey = getKey(points[0])

      points.forEach((point) => {
        const key = getKey(point)

        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'variance')
      })

      expect(aggregates[targetKey].data.variance).toBe(2552.333333333333)
    })
  })

  describe('variancep', () => {
    test('returns 0 when given a single intensity', () => {
      const result = computeAggregate(AGG, 5, 'variancep')
      expect(result).toBe(0)
    })

    test('returns the population variance when given points at the same location', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [5, 7],
          intensity: 2,
        },
        {
          coordinates: [5, 7],
          intensity: 5,
        },
        {
          coordinates: [5, 7],
          intensity: 1,
        },
        {
          coordinates: [5, 7],
          intensity: 89,
        },
        {
          coordinates: [5, 7],
          intensity: 6,
        },
      ]

      const key = getKey(points[0])

      points.forEach((point) => {
        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'variancep')
      })

      expect(aggregates[key].data.variancep).toBe(1173.04)
    })

    test('returns the population variance when given points at different locations', () => {
      const aggregates = {}

      const points = [
        {
          coordinates: [6, 7],
          intensity: 2,
        },
        {
          coordinates: [9, 2],
          intensity: 5,
        },
        {
          coordinates: [6, 7],
          intensity: 1,
        },
        {
          coordinates: [6, 7],
          intensity: 89,
        },
        {
          coordinates: [1, 4],
          intensity: 6,
        },
      ]

      const targetKey = getKey(points[0])

      points.forEach((point) => {
        const key = getKey(point)

        if (!aggregates[key]) {
          aggregates[key] = {
            data: {},
            same: new Set(),
            seen: 0,
          }
        }

        aggregates[key].seen++

        computeAggregate(aggregates[key], point.intensity, 'variancep')
      })

      expect(aggregates[targetKey].data.variancep).toBe(1701.5555555555554)
    })
  })
})
