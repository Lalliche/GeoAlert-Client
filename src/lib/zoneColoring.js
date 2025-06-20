export const getZoneColor = (zone) => {
  if (!zone?.isActive) return "grey"; // grey when inactive

  const baseColor = zone?.alertType?.color || "#0E2B5BFF";
  const gravity = zone?.gravity?.toLowerCase();

  let opacity = 1;
  if (gravity === "minor") opacity = 0.2;
  else if (gravity === "moderate") opacity = 0.6;
  else if (gravity === "severe") opacity = 1;

  return hexToRgba(baseColor, opacity);
};

const hexToRgba = (hex, alpha = 1) => {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
