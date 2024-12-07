// src/lib/utils/levelCalculations.ts
const XP_BASE = 100;
const SCALE = 1.1;

// calculates XP needed for user to level up
export function calculateRemainingXP(currentLevel: number, currentXp: number): number {
  const totalXpNeeded = Math.floor(Math.pow(XP_BASE * (currentLevel + 1), SCALE));
  const alreadyEarnedXp = currentXp;
  return totalXpNeeded - alreadyEarnedXp;
}

// calculates XP needed to go from one level to the other
export function calculateXpBetweenLevels(currentLevel: number, nextLevel: number): number {
  if (nextLevel <= currentLevel) return 0;

  const currentLevelTotalXp = Math.floor(Math.pow(XP_BASE * currentLevel, SCALE));
  const nextLevelTotalXp = Math.floor(Math.pow(XP_BASE * nextLevel, SCALE));

  return nextLevelTotalXp - currentLevelTotalXp;
}

// calculates level from XP
export function calculateLevelFromXP(currentXp: number): number {
  let level = 1;
  while (currentXp >= Math.floor(Math.pow(XP_BASE * level, SCALE))) {
    level++;
  }
  return level - 1;
}

export function calculateCurrentLevelProgress(currentXp: number): { currentLevelXp: number, xpBetweenLevels: number } {
  const currentLevel = calculateLevelFromXP(currentXp);
  const remainingXp = calculateRemainingXP(currentLevel, currentXp);
  const xpBetweenLevels = calculateXpBetweenLevels(currentLevel, currentLevel + 1);
  const currentLevelXp = xpBetweenLevels - remainingXp;

  return {
    currentLevelXp,
    xpBetweenLevels
  };
}
