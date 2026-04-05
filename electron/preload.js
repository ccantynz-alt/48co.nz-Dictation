const { contextBridge } = require("electron");

// Expose a minimal API to the renderer process.
// contextIsolation remains enabled for security.
contextBridge.exposeInMainWorld("electronAPI", {
  // Let the web app detect it is running inside the desktop wrapper
  isDesktop: true,
  platform: process.platform,

  // App version (read from package.json at build time)
  getVersion: () => {
    try {
      const pkg = require("./package.json");
      return pkg.version;
    } catch {
      return "1.0.0";
    }
  },
});
