// Test Wallpaper Service Logic
import { wallpaperService, PRESET_WALLPAPERS } from "./js/wallpaper.js";

console.log("=== 1. Check Presets Available ===");
console.log("Presets Count:", PRESET_WALLPAPERS.length);
PRESET_WALLPAPERS.forEach(p => console.log(`- ${p.id}: ${p.name}`));

console.log("\n=== 2. Check Wallpaper Config API ===");
const initialConfig = wallpaperService.getConfig();
console.log("Initial Config:", initialConfig);

const updated = wallpaperService.setPreset("cyberpunk", 0.75, 2);
console.log("Set Preset Result:", updated);

const customData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...";
const customUpdated = wallpaperService.setCustomImage(customData, 0.8, 5);
console.log("Set Custom Image Result:", {
  type: customUpdated.type,
  overlayOpacity: customUpdated.overlayOpacity,
  blurAmount: customUpdated.blurAmount,
  hasData: customUpdated.customDataUrl.length > 0
});

const reset = wallpaperService.resetToDefault();
console.log("Reset Result:", reset);

console.log("\n=== Wallpaper Service Test Passed Successfully! ===");
