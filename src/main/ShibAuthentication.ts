import Store from "electron-store";
import {BrowserWindow} from "electron";

export default class ShibAuthentication {
  static async deeplinkLogin(link: string) {
    if (!link) return;

    let win = BrowserWindow.getAllWindows()[0];
    if (!win) return;

    let url = new URL(link);
    let user = JSON.parse(url.searchParams.get("user") || "");
    if (!user?.Token) return;

    let store = new Store();
    store.set("Token", user.Token)
    store.set("User", user)

    win.webContents.send("LoggedIn", user.Token, user);
  }
}
