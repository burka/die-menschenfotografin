import { describe, it, expect } from 'vitest'
import {
  calculateSectionHeights,
  calculateActivations,
  normalizeActivations,
  calculateHeightsFromActivations,
  validateHeightSum,
  HeightCalculatorConfig,
} from '../../src/lib/services/SectionHeightCalculator'

describe('SectionHeightCalculator', () => {
  describe('validateHeightSum', () => {
    it('returns true when heights sum to 100', () => {
      expect(validateHeightSum([25, 25, 25, 25])).toBe(true)
      expect(validateHeightSum([50, 30, 20])).toBe(true)
      expect(validateHeightSum([100])).toBe(true)
    })

    it('returns false when heights do not sum to 100', () => {
      expect(validateHeightSum([25, 25, 25, 24])).toBe(false)
      expect(validateHeightSum([50, 50, 1])).toBe(false)
    })

    it('allows small floating point tolerance', () => {
      expect(validateHeightSum([33.333, 33.333, 33.334])).toBe(true)
    })
  })

  describe('calculateActivations', () => {
    it('returns empty array for 0 sections', () => {
      expect(calculateActivations(0, 0.5)).toEqual([])
    })

    it('returns [1] for single section', () => {
      expect(calculateActivations(1, 0)).toEqual([1])
      expect(calculateActivations(1, 0.5)).toEqual([1])
      expect(calculateActivations(1, 1)).toEqual([1])
    })

    it('returns activations for multiple sections', () => {
      const activations = calculateActivations(4, 0.5)
      expect(activations).toHaveLength(4)
      activations.forEach(a => {
        expect(a).toBeGreaterThanOrEqual(0)
        expect(a).toBeLessThanOrEqual(1)
      })
    })

    it('first section has highest activation at scroll 0', () => {
      const activations = calculateActivations(4, 0)
      expect(activations[0]).toBeGreaterThan(activations[1])
      expect(activations[0]).toBeGreaterThan(activations[2])
      expect(activations[0]).toBeGreaterThan(activations[3])
    })

    it('last section has highest activation at scroll 1', () => {
      const activations = calculateActivations(4, 1)
      expect(activations[3]).toBeGreaterThan(activations[0])
      expect(activations[3]).toBeGreaterThan(activations[1])
      expect(activations[3]).toBeGreaterThan(activations[2])
    })

    it('middle section is most active at scroll 0.5 for 4 sections', () => {
      const activations = calculateActivations(4, 0.5)
      // At 0.5, sections 1 and 2 should be most active (centers at 0.375 and 0.625)
      expect(activations[1]).toBeGreaterThan(activations[0])
      expect(activations[2]).toBeGreaterThan(activations[3])
    })

    it('clamps scroll progress to valid range', () => {
      const activationsNegative = calculateActivations(4, -0.5)
      const activationsZero = calculateActivations(4, 0)
      expect(activationsNegative).toEqual(activationsZero)

      const activationsOver = calculateActivations(4, 1.5)
      const activationsOne = calculateActivations(4, 1)
      expect(activationsOver).toEqual(activationsOne)
    })
  })

  describe('normalizeActivations', () => {
    it('returns empty array for empty input', () => {
      expect(normalizeActivations([])).toEqual([])
    })

    it('normalizes activations to sum to 1', () => {
      const normalized = normalizeActivations([2, 2, 2, 2])
      const sum = normalized.reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(1, 10)
    })

    it('handles all zeros by distributing equally', () => {
      const normalized = normalizeActivations([0, 0, 0, 0])
      expect(normalized).toEqual([0.25, 0.25, 0.25, 0.25])
    })

    it('preserves relative proportions', () => {
      const normalized = normalizeActivations([4, 2, 2])
      expect(normalized[0]).toBeCloseTo(0.5, 10)
      expect(normalized[1]).toBeCloseTo(0.25, 10)
      expect(normalized[2]).toBeCloseTo(0.25, 10)
    })
  })

  describe('calculateHeightsFromActivations', () => {
    const config: HeightCalculatorConfig = {
      activeToInactiveRatio: 5,
      minHeightPercent: 8,
      maxHeightPercent: 60,
    }

    it('returns [100] for single section', () => {
      expect(calculateHeightsFromActivations([1], config)).toEqual([100])
    })

    it('returns heights that sum to 100', () => {
      const heights = calculateHeightsFromActivations([0.4, 0.2, 0.2, 0.2], config)
      expect(validateHeightSum(heights)).toBe(true)
    })

    it('respects minimum height constraint', () => {
      const heights = calculateHeightsFromActivations([0.9, 0.033, 0.033, 0.034], config)
      heights.forEach(h => {
        expect(h).toBeGreaterThanOrEqual(config.minHeightPercent - 0.01)
      })
    })

    it('respects maximum height constraint', () => {
      const heights = calculateHeightsFromActivations([0.9, 0.033, 0.033, 0.034], config)
      heights.forEach(h => {
        expect(h).toBeLessThanOrEqual(config.maxHeightPercent + 0.01)
      })
    })
  })

  describe('calculateSectionHeights - main function', () => {
    it('returns empty result for 0 sections', () => {
      const result = calculateSectionHeights(0, 0.5)
      expect(result.heights).toEqual([])
      expect(result.activeIndex).toBe(-1)
      expect(result.activations).toEqual([])
    })

    it('returns correct structure for valid input', () => {
      const result = calculateSectionHeights(4, 0.5)
      expect(result.heights).toHaveLength(4)
      expect(result.activations).toHaveLength(4)
      expect(result.activeIndex).toBeGreaterThanOrEqual(0)
      expect(result.activeIndex).toBeLessThan(4)
    })

    it('heights always sum to exactly 100', () => {
      // Test many different scroll positions
      for (let i = 0; i <= 100; i++) {
        const progress = i / 100
        const result = calculateSectionHeights(4, progress)
        expect(validateHeightSum(result.heights)).toBe(true)
      }
    })

    it('active section changes as scroll progresses', () => {
      const result0 = calculateSectionHeights(4, 0)
      const result25 = calculateSectionHeights(4, 0.25)
      const result50 = calculateSectionHeights(4, 0.5)
      const result75 = calculateSectionHeights(4, 0.75)
      const result100 = calculateSectionHeights(4, 1)

      expect(result0.activeIndex).toBe(0)
      expect(result100.activeIndex).toBe(3)
      // Middle values should transition
      expect([0, 1]).toContain(result25.activeIndex)
      expect([1, 2]).toContain(result50.activeIndex)
      expect([2, 3]).toContain(result75.activeIndex)
    })

    it('active section has largest height', () => {
      for (let i = 0; i <= 10; i++) {
        const progress = i / 10
        const result = calculateSectionHeights(4, progress)
        const activeHeight = result.heights[result.activeIndex]

        result.heights.forEach((h, idx) => {
          if (idx !== result.activeIndex) {
            expect(activeHeight).toBeGreaterThanOrEqual(h - 0.01)
          }
        })
      }
    })

    it('respects custom config', () => {
      const config = {
        activeToInactiveRatio: 10,
        minHeightPercent: 5,
        maxHeightPercent: 70,
      }
      const result = calculateSectionHeights(4, 0.125, config)

      expect(validateHeightSum(result.heights)).toBe(true)
      result.heights.forEach(h => {
        expect(h).toBeGreaterThanOrEqual(config.minHeightPercent - 0.01)
        expect(h).toBeLessThanOrEqual(config.maxHeightPercent + 0.01)
      })
    })

    it('handles 2 sections correctly', () => {
      const result0 = calculateSectionHeights(2, 0)
      const result1 = calculateSectionHeights(2, 1)

      expect(validateHeightSum(result0.heights)).toBe(true)
      expect(validateHeightSum(result1.heights)).toBe(true)
      expect(result0.activeIndex).toBe(0)
      expect(result1.activeIndex).toBe(1)
    })

    it('handles 5 sections correctly', () => {
      for (let i = 0; i <= 10; i++) {
        const progress = i / 10
        const result = calculateSectionHeights(5, progress)
        expect(validateHeightSum(result.heights)).toBe(true)
        expect(result.heights).toHaveLength(5)
      }
    })

    it('height transitions are smooth (no large jumps)', () => {
      const sectionCount = 4
      let prevHeights: number[] | null = null
      const maxJump = 5 // Maximum allowed height change per 1% scroll

      for (let i = 0; i <= 100; i++) {
        const progress = i / 100
        const result = calculateSectionHeights(sectionCount, progress)

        if (prevHeights) {
          result.heights.forEach((h, idx) => {
            const diff = Math.abs(h - prevHeights![idx])
            expect(diff).toBeLessThan(maxJump)
          })
        }

        prevHeights = result.heights
      }
    })
  })

  describe('edge cases and stress tests', () => {
    it('handles rapid scroll progress changes', () => {
      const progressValues = [0, 1, 0.5, 0.25, 0.75, 0, 1, 0.33, 0.66]

      progressValues.forEach(progress => {
        const result = calculateSectionHeights(4, progress)
        expect(validateHeightSum(result.heights)).toBe(true)
      })
    })

    it('handles very small scroll increments', () => {
      for (let i = 0; i <= 1000; i++) {
        const progress = i / 1000
        const result = calculateSectionHeights(4, progress)
        expect(validateHeightSum(result.heights)).toBe(true)
      }
    })

    it('heights never go negative', () => {
      for (let i = 0; i <= 100; i++) {
        const progress = i / 100
        const result = calculateSectionHeights(4, progress)
        result.heights.forEach(h => {
          expect(h).toBeGreaterThanOrEqual(0)
        })
      }
    })

    it('works with extreme config values', () => {
      const extremeConfig = {
        activeToInactiveRatio: 20,
        minHeightPercent: 1,
        maxHeightPercent: 95,
      }

      for (let i = 0; i <= 10; i++) {
        const progress = i / 10
        const result = calculateSectionHeights(4, progress, extremeConfig)
        expect(validateHeightSum(result.heights)).toBe(true)
      }
    })
  })
})
