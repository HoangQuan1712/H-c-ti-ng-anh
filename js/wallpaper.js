// Wallpaper & Theme Appearance Controller
// Allows users to upload custom images from device or choose curated presets

export const PRESET_WALLPAPERS = [
  {
    id: "default",
    name: "Fluent Dark Neon (Mặc định)",
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    url: "",
    desc: "Nền Gradient tối neon hiện đại & nhẹ máy"
  },
  {
    id: "cyberpunk",
    name: "Tokyo Cyberpunk Neon",
    thumb: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1920&q=85",
    desc: "Ánh đèn neon tương lai sống động"
  },
  {
    id: "galaxy",
    name: "Deep Cosmos Galaxy",
    thumb: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&q=80",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1920&q=85",
    desc: "Vũ trụ vô tận đầy cảm hứng"
  },
  {
    id: "study_library",
    name: "Cozy Vintage Library",
    thumb: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80",
    url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=85",
    desc: "Thư viện tri thức cổ điển, yên tĩnh tập trung"
  },
  {
    id: "aurora",
    name: "Nordic Aurora Sky",
    thumb: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=85",
    desc: "Cực quang xanh ngọc bắc cực huyền ảo"
  },
  {
    id: "rainy_cafe",
    name: "Rainy Glass Study Cafe",
    thumb: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80",
    url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920&q=85",
    desc: "Quán cà phê ngày mưa êm dịu"
  }
];

const WALLPAPER_STORAGE_KEY = "fluentactive_custom_wallpaper_config";

const DEFAULT_CONFIG = {
  type: "default", // "default" | "preset" | "custom"
  presetId: "default",
  customDataUrl: "",
  overlayOpacity: 0.72, // 0.3 to 0.95
  blurAmount: 0 // 0 to 15px
};

let inMemoryWallpaperConfig = null;

export const wallpaperService = {
  getConfig() {
    try {
      if (typeof localStorage !== "undefined") {
        const saved = localStorage.getItem(WALLPAPER_STORAGE_KEY);
        if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
      return inMemoryWallpaperConfig || { ...DEFAULT_CONFIG };
    } catch {
      return inMemoryWallpaperConfig || { ...DEFAULT_CONFIG };
    }
  },

  saveConfig(config) {
    const merged = { ...this.getConfig(), ...config };
    inMemoryWallpaperConfig = merged;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(WALLPAPER_STORAGE_KEY, JSON.stringify(merged));
      }
    } catch (e) {
      console.warn("Wallpaper save error:", e.message);
    }
    this.applyWallpaper(merged);
    return merged;
  },

  setCustomImage(dataUrl, overlayOpacity, blurAmount) {
    const config = {
      type: "custom",
      presetId: "",
      customDataUrl: dataUrl,
      overlayOpacity: overlayOpacity !== undefined ? overlayOpacity : (this.getConfig().overlayOpacity || 0.72),
      blurAmount: blurAmount !== undefined ? blurAmount : (this.getConfig().blurAmount || 0)
    };
    return this.saveConfig(config);
  },

  setPreset(presetId, overlayOpacity, blurAmount) {
    const preset = PRESET_WALLPAPERS.find(p => p.id === presetId);
    if (!preset || preset.id === "default") {
      return this.resetToDefault();
    }
    const config = {
      type: "preset",
      presetId: preset.id,
      customDataUrl: preset.url,
      overlayOpacity: overlayOpacity !== undefined ? overlayOpacity : (this.getConfig().overlayOpacity || 0.72),
      blurAmount: blurAmount !== undefined ? blurAmount : (this.getConfig().blurAmount || 0)
    };
    return this.saveConfig(config);
  },

  updateAdjustments(overlayOpacity, blurAmount) {
    const cur = this.getConfig();
    cur.overlayOpacity = Number(overlayOpacity);
    cur.blurAmount = Number(blurAmount);
    return this.saveConfig(cur);
  },

  resetToDefault() {
    const config = {
      type: "default",
      presetId: "default",
      customDataUrl: "",
      overlayOpacity: 0.72,
      blurAmount: 0
    };
    return this.saveConfig(config);
  },

  initDOM() {
    if (typeof document === "undefined") return;
    if (!document.getElementById("app-custom-wallpaper-bg")) {
      const bgEl = document.createElement("div");
      bgEl.id = "app-custom-wallpaper-bg";
      document.body.prepend(bgEl);
    }
    if (!document.getElementById("app-custom-wallpaper-overlay")) {
      const overlayEl = document.createElement("div");
      overlayEl.id = "app-custom-wallpaper-overlay";
      document.body.prepend(overlayEl);
    }
  },

  applyWallpaper(config) {
    if (typeof document === "undefined") return;
    this.initDOM();
    const bgEl = document.getElementById("app-custom-wallpaper-bg");
    const overlayEl = document.getElementById("app-custom-wallpaper-overlay");
    if (!bgEl || !overlayEl) return;

    const targetConfig = config || this.getConfig();

    if (targetConfig.type === "default" || (!targetConfig.customDataUrl && targetConfig.type !== "preset")) {
      bgEl.style.opacity = "0";
      bgEl.style.backgroundImage = "none";
      overlayEl.style.opacity = "0";
      document.body.classList.remove("has-custom-wallpaper");
      return;
    }

    const imgUrl = targetConfig.customDataUrl;
    if (imgUrl) {
      bgEl.style.backgroundImage = `url("${imgUrl}")`;
      bgEl.style.opacity = "1";
      bgEl.style.filter = targetConfig.blurAmount > 0 ? `blur(${targetConfig.blurAmount}px)` : "none";
      
      const op = targetConfig.overlayOpacity !== undefined ? targetConfig.overlayOpacity : 0.72;
      overlayEl.style.backgroundColor = `rgba(8, 12, 20, ${op})`;
      overlayEl.style.opacity = "1";

      document.body.classList.add("has-custom-wallpaper");
    }
  }
};
