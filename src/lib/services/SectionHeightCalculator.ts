/**
 * SectionHeightCalculator - Pure service for calculating section heights
 *
 * Guarantees that heights ALWAYS sum to exactly the available height,
 * preventing layout jumps during scroll animations.
 *
 * Single Responsibility: Only calculates height distribution
 * Open/Closed: Configurable via options, extensible activation functions
 * Dependency Inversion: Pure functions, no external dependencies
 */

export interface HeightCalculatorConfig {
  /** Ratio of active section height to inactive section height (e.g., 5 means 5x larger) */
  activeToInactiveRatio: number
  /** Minimum height any section can have (as percentage of available height) */
  minHeightPercent: number
  /** Maximum height any section can have (as percentage of available height) */
  maxHeightPercent: number
}

export interface HeightCalculatorResult {
  /** Heights for each section as percentage (0-100), guaranteed to sum to 100 */
  heights: number[]
  /** Index of the currently most active section */
  activeIndex: number
  /** Activation level for each section (0-1) */
  activations: number[]
}

const DEFAULT_CONFIG: HeightCalculatorConfig = {
  activeToInactiveRatio: 5,
  minHeightPercent: 8,
  maxHeightPercent: 60,
}

/**
 * Calculate activation level for each section based on scroll progress.
 * Returns values between 0 and 1 for each section.
 */
export function calculateActivations(
  sectionCount: number,
  scrollProgress: number
): number[] {
  if (sectionCount <= 0) return []
  if (sectionCount === 1) return [1]

  // Clamp scroll progress to valid range
  const progress = Math.max(0, Math.min(1, scrollProgress))

  // Each section occupies an equal portion of the scroll range
  const segmentSize = 1 / sectionCount

  const activations: number[] = []

  for (let i = 0; i < sectionCount; i++) {
    const segmentCenter = (i + 0.5) * segmentSize

    // Distance from current progress to this section's center
    // Normalized so that distance of 0 = at center, distance of segmentSize = at edge
    const distance = Math.abs(progress - segmentCenter)

    // Convert distance to activation (closer = higher activation)
    // Use smooth curve for natural feel
    const maxDistance = segmentSize * 1.5 // Sections influence extends slightly beyond their segment
    const normalizedDistance = Math.min(distance / maxDistance, 1)

    // Smooth activation curve (ease-in-out style)
    const activation = 1 - (normalizedDistance * normalizedDistance)

    activations.push(Math.max(0, activation))
  }

  return activations
}

/**
 * Normalize activations so they can be used for height distribution.
 * Ensures the sum of weighted heights equals exactly 100%.
 */
export function normalizeActivations(activations: number[]): number[] {
  if (activations.length === 0) return []

  const sum = activations.reduce((a, b) => a + b, 0)
  if (sum === 0) {
    // Edge case: all zeros, distribute equally
    return activations.map(() => 1 / activations.length)
  }

  return activations.map(a => a / sum)
}

/**
 * Convert normalized activations to actual heights with constraints.
 * Guarantees heights sum to exactly 100.
 */
export function calculateHeightsFromActivations(
  normalizedActivations: number[],
  config: HeightCalculatorConfig
): number[] {
  const n = normalizedActivations.length
  if (n === 0) return []
  if (n === 1) return [100]

  const { minHeightPercent, maxHeightPercent, activeToInactiveRatio } = config

  // Calculate base heights using activation weights
  // Higher activation = more height
  const weights = normalizedActivations.map(a => {
    // Transform activation to weight: inactive gets 1, active gets activeToInactiveRatio
    return 1 + a * (activeToInactiveRatio - 1)
  })

  const totalWeight = weights.reduce((a, b) => a + b, 0)

  // Calculate initial heights proportional to weights
  let heights = weights.map(w => (w / totalWeight) * 100)

  // Apply constraints and redistribute
  heights = applyConstraints(heights, minHeightPercent, maxHeightPercent)

  // Final normalization to guarantee sum = 100
  heights = normalizeToSum(heights, 100)

  return heights
}

/**
 * Apply min/max constraints to heights, redistributing excess.
 */
function applyConstraints(
  heights: number[],
  minHeight: number,
  maxHeight: number
): number[] {
  const result = [...heights]
  let iterations = 0
  const maxIterations = 10 // Prevent infinite loops

  while (iterations < maxIterations) {
    let needsAdjustment = false
    let deficit = 0
    let surplus = 0
    let adjustableCount = 0

    // Find violations and calculate adjustment needed
    for (let i = 0; i < result.length; i++) {
      if (result[i] < minHeight) {
        deficit += minHeight - result[i]
        result[i] = minHeight
        needsAdjustment = true
      } else if (result[i] > maxHeight) {
        surplus += result[i] - maxHeight
        result[i] = maxHeight
        needsAdjustment = true
      } else {
        adjustableCount++
      }
    }

    if (!needsAdjustment) break

    // Redistribute surplus/deficit among adjustable sections
    const totalAdjustment = surplus - deficit
    if (adjustableCount > 0 && totalAdjustment !== 0) {
      const adjustmentPerSection = totalAdjustment / adjustableCount
      for (let i = 0; i < result.length; i++) {
        if (result[i] > minHeight && result[i] < maxHeight) {
          result[i] += adjustmentPerSection
        }
      }
    }

    iterations++
  }

  return result
}

/**
 * Normalize heights to sum to exactly the target value.
 * Uses proportional scaling to maintain relative sizes.
 */
function normalizeToSum(heights: number[], targetSum: number): number[] {
  const currentSum = heights.reduce((a, b) => a + b, 0)

  if (currentSum === 0) {
    // Edge case: distribute equally
    return heights.map(() => targetSum / heights.length)
  }

  if (Math.abs(currentSum - targetSum) < 0.0001) {
    // Already at target (within floating point tolerance)
    return heights
  }

  const scale = targetSum / currentSum
  const scaled = heights.map(h => h * scale)

  // Fix any floating point errors by adjusting the largest section
  const finalSum = scaled.reduce((a, b) => a + b, 0)
  const error = targetSum - finalSum

  if (Math.abs(error) > 0.0001) {
    // Find largest section and adjust
    let maxIndex = 0
    for (let i = 1; i < scaled.length; i++) {
      if (scaled[i] > scaled[maxIndex]) maxIndex = i
    }
    scaled[maxIndex] += error
  }

  return scaled
}

/**
 * Main function: Calculate section heights based on scroll progress.
 *
 * @param sectionCount - Number of sections to distribute height among
 * @param scrollProgress - Current scroll position (0 = top, 1 = bottom)
 * @param config - Optional configuration for height distribution
 * @returns Heights and metadata, heights guaranteed to sum to 100
 */
export function calculateSectionHeights(
  sectionCount: number,
  scrollProgress: number,
  config: Partial<HeightCalculatorConfig> = {}
): HeightCalculatorResult {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }

  if (sectionCount <= 0) {
    return { heights: [], activeIndex: -1, activations: [] }
  }

  // Step 1: Calculate activation levels
  const activations = calculateActivations(sectionCount, scrollProgress)

  // Step 2: Find most active section
  let activeIndex = 0
  let maxActivation = activations[0]
  for (let i = 1; i < activations.length; i++) {
    if (activations[i] > maxActivation) {
      maxActivation = activations[i]
      activeIndex = i
    }
  }

  // Step 3: Normalize activations for height calculation
  const normalizedActivations = normalizeActivations(activations)

  // Step 4: Calculate heights (guaranteed to sum to 100)
  const heights = calculateHeightsFromActivations(normalizedActivations, fullConfig)

  return {
    heights,
    activeIndex,
    activations,
  }
}

/**
 * Validate that heights sum to expected value (for testing).
 */
export function validateHeightSum(heights: number[], expectedSum: number = 100): boolean {
  const sum = heights.reduce((a, b) => a + b, 0)
  return Math.abs(sum - expectedSum) < 0.01 // Allow 0.01% tolerance
}
