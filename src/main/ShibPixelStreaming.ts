import jsonConfig from "../../config/config.json";
import {BrowserWindow} from "electron"
import {join} from "path";
import Store from "electron-store";
import {is} from "@electron-toolkit/utils";

const config = jsonConfig[jsonConfig.environment];

export default class ShibPixelStreaming {
  static async OpenPS() {
    const estore = new Store();
    if (!estore.get("Token") || !config?.frontend) return;

    let win = BrowserWindow.getAllWindows()[0];
    if (!win) return;
    await win.loadURL(`${config?.frontend}/stream?token=${estore.get("Token")}`);
  }

  static CloseWindow() {
    console.log("CloseWindow");
    let win = BrowserWindow.getAllWindows()[0];
    if (!win) return;

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      win.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      win.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }
}
