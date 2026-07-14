import { ipcRenderer} from 'electron'
import path from "path";
import * as fs from "fs-extra";
import {FetchProps} from '../main/ShibNetworking'
import Store from "electron-store";
export const ShibAPI = {
  LaunchGame: (path, args) => ipcRenderer.send('Files:LaunchGame', path, args),
  OpenPS: () => ipcRenderer.send('PixelStreaming:OpenPS'),
  CloseWindow: () => ipcRenderer.send('PixelStreaming:CloseWindow'),
  Fetch: (data) => ipcRenderer.invoke('Networking:Fetch', data),
  downloadFile: (urlCombined: string, title: string ,version: string) => ipcRenderer.invoke('Networking:DownloadFile', urlCombined,title,version),
  onDownloadProgress: (callback: (progress: number, downloadSpeed: number) => void) => {
    ipcRenderer.on('download-progress', (_, progress: number, downloadSpeed: number) => {
      callback(progress, downloadSpeed)
    })
  },
  onDownloadComplete: (callback: (message: string) => void) => {
    ipcRenderer.on('download-complete', (_, message: string) => {
      callback(message)
    })
  },
  onDownloadError: (callback: (error: string) => void) => {
    ipcRenderer.on('download-complete', (_, error: string) => {
      callback(error)
    })
  },
  unzipFile: (title: string, File: string) => ipcRenderer.invoke('Files:UnzipFile', title, File),
  CopyAndDeleteFile: (title: string, version: string,urls: string, entryFolder: string) => ipcRenderer.invoke('Files:CopyAndDeleteFile', title, version, urls, entryFolder),
  GetGamePath: () => ipcRenderer.invoke('Files:GetGamePath'),
  GetLocationPath: () => ipcRenderer.invoke('Files:GetLocationPath'),
  SetLocationPath: (folderPath: string) => ipcRenderer.invoke('Files:SetLocationPath',folderPath),
  GetVersionDownloaded: () => ipcRenderer.invoke('Files:GetVersionDownloaded'),
  deleteGameVersion: () => ipcRenderer.invoke('Files:deleteGameVersion'),
  SetVersionDownloaded: (gameId: number, gameName: string, version: string) => ipcRenderer.invoke('Files:SetVersionDownloaded',gameId, gameName, version),
  GetSettingsGraphics: () => ipcRenderer.invoke('Files:GetSettingsGraphics'),
  SetSettingsGraphics: (mode: string, resolutions: string, quality: number) => ipcRenderer.invoke('Files:SetSettingsGraphics',mode, resolutions, quality),
  GetSettingsAudio: () => ipcRenderer.invoke('Files:GetSettingsAudio'),
  SetSettingsAudio: (master: number, music: number, sfx: number) => ipcRenderer.invoke('Files:SetSettingsAudio',master, music, sfx),
  pauseDownload: () => ipcRenderer.invoke('Networking:PauseDownload'), // Pause the download
  checkIfFileExists: (title: string) => ipcRenderer.invoke('Files:checkIfFileExists', title),
  GetGameStatus: () => ipcRenderer.invoke('Files:GetGameStatus'),
  SetGameStatus: (GameStatus: string) => ipcRenderer.invoke('Files:SetGameStatus',GameStatus),
  GetGameDownloadUpdate: () => ipcRenderer.invoke('Files:GetGameDownloadUpdate'),
  SetGameDownloadUpdate: (Status: string) => ipcRenderer.invoke('Files:SetGameDownloadUpdate',Status),
  SetToken: (Token: string) => ipcRenderer.invoke('Files:SetToken',Token),
  GetToken: () => ipcRenderer.invoke('Files:GetToken'),
  GetUserData: () => ipcRenderer.invoke('Files:GetUserData'),
  resumeDownload: (urlCombined: string , title: string, version: string) => {
    const estore = new Store();
    const fileDirectory = estore.get('Location') + '/downloads/' + title;
    let progressFilePath: string = "";
      progressFilePath = path.join(fileDirectory,'download-progress.json');
    // Check if progress file exists
    if (fs.existsSync(progressFilePath)) {
      //const { downloadedLength } = fs.readJsonSync(progressFilePath);
      const  progressData  = fs.readJsonSync(progressFilePath);
      const firstIncompleteFile = progressData.files.find(file => file.downloadedLength < file.selfLength);
      const firstIncompleteFileIndex = progressData.files.findIndex(file => file.downloadedLength < file.selfLength);

      if (firstIncompleteFile) {
        const { downloadedLength, name } = firstIncompleteFile;
          console.log(`Row Number: ${firstIncompleteFileIndex}, Downloaded Length: ${downloadedLength}, Name: ${name}`);

      return ipcRenderer.invoke('Networking:DownloadFile', urlCombined, title, version, true, downloadedLength,firstIncompleteFileIndex);
    } else {
      return ipcRenderer.invoke('Networking:DownloadFile', urlCombined, title, version);
    }
    } else {
      console.log('All files are fully downloaded.');
      return false;
    }

  },
  cancelDownload: (title: string) => ipcRenderer.invoke('Networking:cancelDownload', title),
  selectFolder: () => ipcRenderer.invoke('Networking:selectFolder'),
  playGame: (title: string, EntryPoint: string) => ipcRenderer.invoke('Networking:playGame', title, EntryPoint),
  onGameClose: (callback: () => void) => ipcRenderer.on('game-closed', callback),


  onLogin: (callback: Function) => ipcRenderer.on("LoggedIn", (_, token: string, user: any) => callback(token, user))
}

export type ShibAPIProps = {
  LaunchGame: (path: string, args: string[]) => void
  OpenPS: () => void
  CloseWindow: () => void
  Fetch: (Data: FetchProps) => Promise<{ ok: boolean; data: any }>
  downloadFile: (urlCombined: string, title: string, version: string) => Promise<string>
  onDownloadProgress: (callback: any) => void
  onDownloadComplete: (callback: any) => void
  onDownloadError: (callback: any) => void
  unzipFile: (title: string,File: string) => Promise<string>
  CopyAndDeleteFile: (title: string,urls: string) => Promise<string>
  GetGamePath: () => Promise<{ exists: boolean, path: string }>
  pauseDownload: () => void;
  resumeDownload: (urlCombined: string, title: string, version: string) => Promise<string>;
  cancelDownload: (title: string) => void;
  playGame: (title: string, EntryPoint: string) => void;
  onGameClose:(callback: any)=> void;
  SetLocationPath: (folderPath: string) => void;
  GetLocationPath: () => Promise<{ location: string}>;
  SetSettingsGraphics: (mode: string, resolutions: string, quality: number) => void;
  GetSettingsGraphics: () => Promise<{ Mode: string, Resolution: string, Quality: number }>;
  SetSettingsAudio: (master: number, music: number, sfx: number) => void;
  GetSettingsAudio: () => Promise<{ Master: number, Music: number, Sfx: number }>;
  checkIfFileExists: (title: string) => Promise<string>;
  SetGameStatus: (GameStatus: string) => void;
  GetGameStatus: () => Promise<{ GameStatus:string }>;
  SetGameDownloadUpdate: (Status: string) => void;
  GetGameDownloadUpdate: () => Promise<{ Status:string }>;
  SetToken: (Token: string) => void;
  GetToken: () => Promise<{ Token:string }>;
  GetUserData: () => Promise<{ Udata:string }>;
  selectFolder: () => Promise<string>;
  SetVersionDownloaded : (gameId: number, gameName: string, version: string) => void;
  GetVersionDownloaded: () => Promise<{ version: string }>;
  deleteGameVersion: () => Promise<string>;


  onLogin: (callback: Function) => void;
}
