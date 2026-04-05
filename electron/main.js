const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  shell,
  session,
} = require("electron");
const path = require("path");

// ─── Configuration ───────────────────────────────────────────────
const APP_URL = "https://alecrae.app";
const WINDOW_WIDTH = 1200;
const WINDOW_HEIGHT = 800;
const MIN_WIDTH = 800;
const MIN_HEIGHT = 600;
const TITLE_BAR_COLOR = "#111920";

// ─── Single instance lock ────────────────────────────────────────
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  let mainWindow = null;
  let tray = null;
  let isQuitting = false;

  // ─── Helper: get icon path ───────────────────────────────────
  function getIconPath() {
    // Look for icon files in the assets directory
    const assetsDir = path.join(__dirname, "assets");
    if (process.platform === "win32") {
      return path.join(assetsDir, "icon.ico");
    } else if (process.platform === "darwin") {
      return path.join(assetsDir, "icon.icns");
    }
    return path.join(assetsDir, "icon.png");
  }

  // ─── Helper: get tray icon path ──────────────────────────────
  function getTrayIconPath() {
    const assetsDir = path.join(__dirname, "assets");
    // Use a 16x16 or 22x22 PNG for the tray
    const trayIcon = path.join(assetsDir, "tray-icon.png");
    const fallback = path.join(assetsDir, "icon.png");
    try {
      require("fs").accessSync(trayIcon);
      return trayIcon;
    } catch {
      return fallback;
    }
  }

  // ─── Create main window ──────────────────────────────────────
  function createWindow() {
    mainWindow = new BrowserWindow({
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      minWidth: MIN_WIDTH,
      minHeight: MIN_HEIGHT,
      title: "AlecRae Voice",
      icon: getIconPath(),
      backgroundColor: TITLE_BAR_COLOR,
      titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
      titleBarOverlay:
        process.platform === "win32"
          ? { color: TITLE_BAR_COLOR, symbolColor: "#ffffff", height: 36 }
          : undefined,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
      },
      show: false,
    });

    // Show window once content is ready (avoids white flash)
    mainWindow.once("ready-to-show", () => {
      mainWindow.show();
    });

    // Load the deployed web app
    mainWindow.loadURL(APP_URL);

    // Grant microphone permission for the app domain
    session.defaultSession.setPermissionRequestHandler(
      (webContents, permission, callback) => {
        const url = webContents.getURL();
        if (url.startsWith(APP_URL) || url.startsWith("https://alecrae.app")) {
          if (
            permission === "media" ||
            permission === "microphone" ||
            permission === "clipboard-read"
          ) {
            return callback(true);
          }
        }
        callback(false);
      }
    );

    // Open external links in the default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (!url.startsWith(APP_URL)) {
        shell.openExternal(url);
        return { action: "deny" };
      }
      return { action: "allow" };
    });

    // Intercept navigation to external URLs
    mainWindow.webContents.on("will-navigate", (event, url) => {
      if (
        !url.startsWith(APP_URL) &&
        !url.startsWith("https://alecrae.app")
      ) {
        event.preventDefault();
        shell.openExternal(url);
      }
    });

    // ─── Close / minimize to tray behaviour ──────────────────
    mainWindow.on("close", (event) => {
      if (!isQuitting) {
        event.preventDefault();
        mainWindow.hide();

        // On macOS, hide from dock when minimized to tray
        if (process.platform === "darwin") {
          app.dock.hide();
        }
      }
    });

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  }

  // ─── Create system tray ──────────────────────────────────────
  function createTray() {
    let trayImage;
    try {
      trayImage = nativeImage.createFromPath(getTrayIconPath());
      // Resize for tray (16x16 on most platforms)
      trayImage = trayImage.resize({ width: 16, height: 16 });
    } catch {
      // If no icon file exists, create a simple empty image
      trayImage = nativeImage.createEmpty();
    }

    tray = new Tray(trayImage);
    tray.setToolTip("AlecRae Voice");

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Open AlecRae Voice",
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            if (process.platform === "darwin") {
              app.dock.show();
            }
          }
        },
      },
      { type: "separator" },
      {
        label: "Quit",
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]);

    tray.setContextMenu(contextMenu);

    // Double-click tray icon to restore window
    tray.on("double-click", () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
        if (process.platform === "darwin") {
          app.dock.show();
        }
      }
    });
  }

  // ─── App lifecycle ───────────────────────────────────────────

  // Second instance tried to launch — focus existing window
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
      if (process.platform === "darwin") {
        app.dock.show();
      }
    }
  });

  app.whenReady().then(() => {
    createWindow();
    createTray();

    // macOS: re-create window if dock icon clicked and no windows open
    app.on("activate", () => {
      if (mainWindow === null) {
        createWindow();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
      if (process.platform === "darwin") {
        app.dock.show();
      }
    });
  });

  // macOS: Cmd+Q should actually quit
  app.on("before-quit", () => {
    isQuitting = true;
  });

  // Windows/Linux: quit when all windows closed (only if actually quitting)
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  // ─── Application menu (macOS) ────────────────────────────────
  if (process.platform === "darwin") {
    const menuTemplate = [
      {
        label: app.name,
        submenu: [
          { role: "about" },
          { type: "separator" },
          { role: "hide" },
          { role: "hideOthers" },
          { role: "unhide" },
          { type: "separator" },
          { role: "quit" },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "selectAll" },
        ],
      },
      {
        label: "View",
        submenu: [
          { role: "reload" },
          { role: "forceReload" },
          { type: "separator" },
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
          { type: "separator" },
          { role: "togglefullscreen" },
        ],
      },
      {
        label: "Window",
        submenu: [{ role: "minimize" }, { role: "zoom" }, { role: "close" }],
      },
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  }
}
