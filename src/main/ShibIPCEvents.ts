import { ipcMain} from "electron";

import ShibFileManager from "./ShibFileManager";
import ShibNetworking, {FetchProps} from "./ShibNetworking";
import ShibPixelStreaming from "./ShibPixelStreaming";
// import {join} from "path";
// import ShibAuthentication from "./ShibAuthentication";

export default function BindIPCEvents() {
  // Files
  ipcMain.on("Files:LaunchGame", (_, path, args) => ShibFileManager.LaunchGame(path, args));
  ipcMain.handle('Files:UnzipFile',(_ ,gameTitle, File) => ShibFileManager.ExtractZip(gameTitle, File));
  ipcMain.handle('Files:CopyAndDeleteFile',(_ ,gameTitle,  urls) => ShibFileManager.CopyAndDeleteFile(gameTitle, urls));
  ipcMain.handle('Files:GetGamePath', ShibFileManager.GetGamePath);
  ipcMain.handle('Files:SetLocationPath', (_, folderPath) => ShibFileManager.SetLocationPath(folderPath));
  ipcMain.handle('Files:GetLocationPath', ShibFileManager.GetLocationPath);
  ipcMain.handle('Files:SetSettingsGraphics', (_, mode, resolutions, quality) => ShibFileManager.SetSettingsGraphics(mode, resolutions, quality));
  ipcMain.handle('Files:GetSettingsGraphics', ShibFileManager.GetSettingsGraphics);
  ipcMain.handle('Files:SetSettingsAudio', (_, master, music, sfx) => ShibFileManager.SetSettingsAudio(master, music, sfx));
  ipcMain.handle('Files:GetSettingsAudio', ShibFileManager.GetSettingsAudio);
  ipcMain.handle('Files:checkIfFileExists', (_ ,gameTitle) => ShibFileManager.checkIfFileExists(gameTitle));
  ipcMain.handle('Files:SetGameStatus', (_, GameStatus) => ShibFileManager.SetGameStatus(GameStatus));
  ipcMain.handle('Files:GetGameStatus', ShibFileManager.GetGameStatus);
  ipcMain.handle('Files:SetGameDownloadUpdate', (_, Status) => ShibFileManager.SetGameDownloadUpdate(Status));
  ipcMain.handle('Files:GetGameDownloadUpdate', ShibFileManager.GetGameDownloadUpdate);
  ipcMain.handle('Files:SetToken', (_, Token) => ShibFileManager.SetToken(Token));
  ipcMain.handle('Files:GetToken', ShibFileManager.GetToken);
  ipcMain.handle('Files:GetUserData', ShibFileManager.GetUserData);
  ipcMain.handle('Files:GetVersionDownloaded',  ShibFileManager.GetVersionDownloaded);
  ipcMain.handle('Files:deleteGameVersion', (_, gameId) =>ShibFileManager.deleteGameVersion(gameId));
  ipcMain.handle('Files:SetVersionDownloaded', (_, gameId, gameName, version) => ShibFileManager.SetVersionDownloaded(gameId, gameName, version));
  // Networking
  ipcMain.handle("Networking:Fetch", (_, Data: FetchProps) => ShibNetworking.Fetch(Data));
  ipcMain.handle('Networking:DownloadFile', ShibNetworking.DownloadFile);
  ipcMain.handle('Networking:PauseDownload', ShibNetworking.PauseDownload);
  ipcMain.handle('Networking:ResumeDownload', ShibNetworking.resumeDownload);
  ipcMain.handle('Networking:cancelDownload', (_ ,gameTitle) => ShibNetworking.cancelDownload(gameTitle));
  ipcMain.handle('Networking:playGame', (_ ,gameTitle, EntryPoint) => ShibNetworking.playGame(gameTitle, EntryPoint));
  ipcMain.handle('Networking:selectFolder', ShibNetworking.selectFolder);
  // Pixel Streaming
  ipcMain.on("PixelStreaming:OpenPS", (_) => ShibPixelStreaming.OpenPS());
  ipcMain.on("PixelStreaming:CloseWindow", (_) => ShibPixelStreaming.CloseWindow());
}
