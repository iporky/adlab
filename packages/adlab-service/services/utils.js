export const formatResponse = (targetingData) => {
  const targetingKeys = Object.keys(targetingData);
  return targetingKeys.map((targetingKey) => ({
    name: targetingKey,
    value: targetingData[targetingKey],
  }));
};
