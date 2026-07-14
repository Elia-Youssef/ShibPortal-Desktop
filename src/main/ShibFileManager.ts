//import {spawn} from "child_process";
import {exec} from "child_process";

const { execFile} = require("child_process");
import {app, BrowserWindow} from "electron";
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
import Store  from 'electron-store';


interface Game {
  gameName: string;
  version: string;
}

interface StoreSchema {
  games: Record<number, Game>;
}

// Initialize the store with a schema
const estoreversion = new Store<StoreSchema>({
  schema: {
    games: {
      type: 'object',
      default: {} as Record<number, Game>, // Explicitly type the default value
    },
  },
});


export default class ShibFileManager {

  // static LaunchGame(path: string, args: string[]) {
  //   let bat = spawn("cmd.exe", ["/c", path, ...args],  {stdio: "inherit"});
  //
  //   //bat.stderr.on("error", (_) => {
  //   bat.on("error", (err) => {
  //     console.error("Failed to launch game:", err);
  //     // NOTIFY UI
  //     // LOG ERROR
  //   });
  //
  //   bat.on("exit", (_) => {
  //     const mainWindow = BrowserWindow.getAllWindows()[0];
  //     mainWindow.webContents.send('game-closed');
  //   });
  // };
  static LaunchGame(path, args) {
    const bat = execFile(path, args, (err) => {

      if (err) {
        console.error("Failed to launch game:", err.message);
        // NOTIFY UI
        const mainWindow = BrowserWindow.getAllWindows()[0];
        mainWindow.webContents.send('game-launch-failed', err.message);
        return;
      }
    });

    // Listen for process exit
    bat.on("exit", (code) => {
      if (code === 0) {
        console.log("Game exited successfully");
      } else {
        console.error(`Game exited with code ${code}`);
      }
      const mainWindow = BrowserWindow.getAllWindows()[0];
      mainWindow.webContents.send('game-closed');
    });
  }

  // static async ExtractZip(title: string, version: string) {
  //   const estore = new Store();
  //   const installDirectory = estore.get("Location") as string | undefined;
  //
  //   if (!installDirectory) {
  //     return 'Installation directory not found';
  //   }
  //
  //   const filePath = path.join(installDirectory, "downloads", title, `${version}.zip`);
  //   const unzipDestinationPath = path.join(installDirectory, "downloads", title);
  //
  //   try {
  //     // Ensure the destination path exists; create it if it doesn't
  //     if (!fs.existsSync(unzipDestinationPath)) {
  //       fs.mkdirSync(unzipDestinationPath, { recursive: true });
  //     }
  //
  //     // Stream the zip file extraction to handle large files
  //     const readStream = fs.createReadStream(filePath);
  //     await readStream.pipe(unzipper.Extract({ path: unzipDestinationPath })).promise();
  //
  //     console.log(`File unzipped to: ${unzipDestinationPath}`);
  //     return "Unzip successful";
  //   } catch (error) {
  //     console.error("Error unzipping file:", error);
  //     return `Failed to unzip file: ${error}`;
  //   } finally {
  //     // Delete the .zip file regardless of success or failure
  //     if (fs.existsSync(filePath)) {
  //       try {
  //         fs.unlinkSync(filePath);
  //         console.log(`Deleted zip file: ${filePath}`);
  //       } catch (unlinkError) {
  //         console.error(`Failed to delete zip file: ${unlinkError}`);
  //       }
  //     }
  //   }
  // }


  static async ExtractZip(title: string, File: string) {
    const estore = new Store();
    const installDirectory = estore.get("Location") as string | undefined;
    const filePath = path.join(installDirectory + "/downloads/" ,title,'/' + File + '.zip/');
    try {
      const readStream = fs.createReadStream(filePath);

      console.log(filePath);

      const destinationPath = path.join(installDirectory, 'downloads/' + title );
      const unzipdestinationPath = path.join(installDirectory, 'downloads/' + title);

      // Ensure the destination path exists; create it if it doesn't
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, {recursive: true});
      }
//delete if main folder exsits
      if (fs.existsSync(destinationPath  +'/' +  title )) {

        const filePath = path.join(destinationPath +'/' +  title);
        const deleteCommand = `Remove-Item -Path '${filePath}' -Recurse -Force`;

        exec(`powershell -Command "${deleteCommand}"`, (error) => {
          if (error) {
            console.error('Failed to delete folder:', error);
          } else {
            console.log('Folder deleted successfully.');
          }
        });
      }
      //
      await readStream
        .pipe(unzipper.Extract({path: unzipdestinationPath}))
        .promise();

       // fs.unlinkSync(filePath);
      return 'Unzip successful';
    } catch (error) {
      console.error('Error unzipping file:', error);
      return 'Failed to unzip file: ${error.message}';

    }
  }
  static async CopyAndDeleteFile(title: string,urls: string): Promise<string> {
    try {
      const estore = new Store();
      const installDirectory = estore.get("Location") as string | undefined;
      const urlCombined = JSON.parse(urls);
      if (!installDirectory) {
        throw new Error("Installation directory not found.");
      }
      for (let i = 0; i < urlCombined.length; i++) {

        const url = urlCombined[i]["fileName"];
        const pathfile = urlCombined[i]["filePath"];
      // Source file path
      const sourceFilePath = path.join(installDirectory, "downloads", title + '/' + url);

      // Destination directory and file path
        if (url.substring(url.length-4, url.length) == '.zip')
        {
          fs.unlinkSync(sourceFilePath);
          console.error('Delete the zip file', i);
          if(fs.lstatSync(sourceFilePath.replace('.zip','')).isDirectory() )
          {
            await fs.cp(sourceFilePath.replace('.zip',''),  path.join(installDirectory, pathfile),{recursive:true},(error) =>
            {console.log(error)});
            fs.unlinkSync(sourceFilePath.replace('.zip',''));
          }
        }

        else{

          const destinationDirectory = path.join(installDirectory, pathfile);//'downloads/' + title + '/' + version + '/' + entryFolder + '/Content/Paks/'
          const destinationFilePath = path.join(installDirectory, pathfile + url);

          console.error('Error unzipping file:',destinationDirectory);
          // Ensure the destination directory exists; create it if it doesn't
          if (!fs.existsSync(destinationDirectory)) {
            fs.mkdirSync(destinationDirectory, {recursive: true});
          }

          // Copy the file to the new director
          // y
          await new Promise<void>((resolve, reject) => {
            const readStream = fs.createReadStream(sourceFilePath);
            const writeStream = fs.createWriteStream(destinationFilePath);
            console.error('1', sourceFilePath);
            console.error('2', destinationFilePath);
            readStream.on("error", reject);
            writeStream.on("error", reject);

            writeStream.on("close", () => {
              resolve();
            });

            readStream.pipe(writeStream);
          });

          // Delete the original file
          fs.unlinkSync(sourceFilePath);
          }

      }
      return "File copied and original deleted successfully.";
    } catch (error) {
      console.error("Error copying and deleting file:", error);
      return `Failed to copy and delete file: ${error}`;
    }
  }
  ////////////////////////////////
  static async GetGamePath() {
    const installDirectory = app.getPath('userData');
    const gamePath = path.join(installDirectory, 'downloads/1-0-1/Windows/ShibRun.exe')

    return { exists: fs.existsSync(gamePath), path: gamePath };
  }

  static async SetLocationPath(folderPath: string)
  {
    const estore = new Store();
     estore.set('Location', folderPath);
  }
  static async GetLocationPath()
  {
    const estore = new Store();
    if (!estore.get('Location')) {
      const installDirectory = "C:/ShibLauncher";
      const filePath = path.join(installDirectory);
      estore.set('Location', filePath);
    }
    return { location :estore.get('Location') };
  }
  static async SetVersionDownloaded(gameId: number, gameName: string, version: string) {
    //   const estore = new Store();
    //   estore.set('VersionDownloaded', VersionDownloaded);
    // }
     const games = estoreversion.get('games'); // Retrieve current games
      games[gameId] = { gameName, version }; // Update or add game entry
      estoreversion.set('games', games); // Save back to the store
      console.log(`Game "${gameName}" has been added/updated to version "${version}".`);
   }

  static async deleteGameVersion(gameId: number) {
    const games = estoreversion.get('games');
    delete games[gameId];
    estoreversion.set('games', games);
    console.log(`Game ${gameId} has been removed.`);
  }

  static async GetVersionDownloaded()
  {
    // const estore = new Store();
    // return { VersionDownloaded :estore.get('VersionDownloaded') };
    return estoreversion.get('games');
  }
  static async SetSettingsGraphics(mode: string, resolutions: string, quality: number )
  {
    const estore = new Store();
    estore.set('Mode', mode);
    estore.set('Resolution', resolutions);
    estore.set('Quality', quality);
  }
  static async GetSettingsGraphics()
  {
    const estore = new Store();
    return { Mode :estore.get('Mode'), Resolution : estore.get('Resolution'), Quality :estore.get('Quality')  };
  }

  static async SetSettingsAudio(master: number, music: number, sfx: number )
  {
    const estore = new Store();
    estore.set('Master', master);
    estore.set('Music', music);
    estore.set('Sfx', sfx);
  }
  static async GetSettingsAudio()
  {
    const estore = new Store();
    return { Master :estore.get('Master'), Music : estore.get('Music'), Sfx :estore.get('Sfx')  };
  }
  static async  checkIfFileExists(title: string) {
    try {
      const estore = new Store();
      const baseDirectory = estore.get("Location") as string | undefined;
      if (!baseDirectory) {
        throw new Error("Installation directory not found in store."+baseDirectory + "123");
      }

      const installDirectory = path.join(baseDirectory + "/downloads/" ,title);
      if (fs.existsSync(installDirectory)) {

        const filePath = path.join(installDirectory, "download-progress.json");
        console.log("path:" + filePath)
        return fs.existsSync(filePath) ? "DownloadIncomplete": "DownloadCompleted";
      }
      else
      {
        return "FolderNotExisting";
      }

    } catch (error) {
      console.error("Error checking file existence:", error);
      return false;
    }
  }
  static async SetGameStatus(GameStatus: string)
  {
    const estore = new Store();
    estore.set('GameStatus', GameStatus);
  }
  static async GetGameStatus()
  {
    const estore = new Store();
    return { GameStatus :estore.get('GameStatus') };
  }
  static async SetGameDownloadUpdate(Status: string)
  {
    const estore = new Store();
    estore.set('Status', Status);
  }
  static async GetGameDownloadUpdate()
  {
    const estore = new Store();
    return { Status :estore.get('Status') };
  }
  static async SetToken(Token: string)
  {
    const estore = new Store();
    estore.set('Token', Token);
  }
  static async GetToken()
  {
    const estore = new Store();
    return { Token :estore.get('Token') };
  }
  static async GetUserData()
  {
    const estore = new Store();
    return { Udata :estore.get('user') };
  }
}
