import jsonConfig from "../../config/config.json";
import {net} from "electron"
import path from "path";
import * as fs from "fs-extra";
import axios from "axios";
import { exec } from 'child_process';
import Store from "electron-store";
import ShibFileManager from "./ShibFileManager";
// import * as http from "node:http";

//const {ThrottleGroup} = require("stream-throttle");

const {dialog} =require('electron');
const config = jsonConfig[jsonConfig.environment];
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export default class ShibNetworking {

  private static async GetResponseAsJson(response: Response) {
    try {
      return await response.json();
    } catch (err) {
      return {};
    }
  };
  static async Fetch({method = "get", api, body, query}: FetchProps) {
    try {
      let url = config.backend
      url += api
      if (query) url += new URLSearchParams(JSON.stringify(query))
      const estore = new Store();
      let response = await net.fetch(url,
        {
          method: method,
          headers: {
            ...headers,
             authorization: `Bearer ${estore.get('Token')}`,
          },
          ...(method == "get" ? {} : {body: JSON.stringify(body)})
        }
      );

      let res = await this.GetResponseAsJson(response);

      return {ok: response.ok, data: res};
    } catch (error) {
      return {ok: false, data: null};
    }
  }

  static controller = new AbortController();

    static async DownloadFile(event: any, urlCombined: string, title: string, version: string, resume = false, previousDownloadedSize = 0,index = 0 ) {
    try
    {
      ShibNetworking.controller = new AbortController();
      const signal = ShibNetworking.controller.signal;
      const estore = new Store();
      const installDirectory = estore.get('Location');
      let fileCount: number = -1;

      const urls = JSON.parse(urlCombined);
      let totalLength = 0;
      let totalDownloaded = 0;

      let fileDirectory: string = "";
      if (typeof installDirectory === "string") {
        fileDirectory = path.join(installDirectory, 'downloads/'+ title);
      }
      await fs.ensureDir(fileDirectory);
      console.log('File will be saved to:', fileDirectory );
      console.log(version)
      const progressFilePath = path.join(fileDirectory, 'download-progress.json');
      let progressData = {
        files: urls.map(() => ({
          selfLength: 0,
          downloadedLength: 0,
          name :""
        }))
      };
      // Load progress data if resuming
      if (resume && fs.existsSync(progressFilePath)) {
        progressData = fs.readJsonSync(progressFilePath);
      } else {
        // Initialize progressData for each file
        await fs.writeJson(progressFilePath, progressData);
      }

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i]["url"];

        const response = await axios({
          url,
          method: 'GET',
          headers,
          responseType: 'stream',
          signal
        });
        const fileSize = Number(response.headers['content-length']) ;
        progressData.files[i].selfLength = fileSize;
        totalLength += fileSize;
        totalDownloaded += progressData.files[i].downloadedLength
      }
      let writer: fs.WriteStream;
      let downloadedLength = previousDownloadedSize;
      for (let i = index; i < urls.length; i++) {
        // Initialize or retrieve progress data for this file
        let fileProgress: any = progressData.files[i];
        const headers = resume ? { Range: `bytes=${fileProgress.downloadedLength}-` } : {};
        const filePath = path.join(fileDirectory,  '/'+ urls[i]["fileName"]);
        const url = urls[i]["url"];
        // const agent = new http.Agent({ keepAlive: true });

        const response = await axios({
          url,
          method: 'GET',
           headers,
           responseType: 'stream',
          signal
        });
        // const response = await axios.get(  url,{
        //
        //   headers,
        //   responseType: 'stream',
        //   httpAgent: agent,
        //   signal,
        // });

        response.data._readableState.highWaterMark = 1024 * 1024 * 10;
       // var tg = new ThrottleGroup({rate: 1024*1024*10});
        fileProgress.name = urls[i]["fileName"];
        if (!fileProgress.selfLength) {
          fileProgress.selfLength = Number(response.headers['content-length']);
        }
        writer = fs.createWriteStream(filePath, { flags: resume ? 'a' : 'w' });

        let lastDownloadedLength = 0;
        let lastTime = Date.now();
        let averageSpeed = 0;
        const smoothingFactor = 0.1;
        response.data.on('data', async (chunk: Buffer) => {
          downloadedLength += chunk.length;
          fileProgress.downloadedLength += chunk.length;
          totalDownloaded += chunk.length;
          const progress = Math.round((totalDownloaded / totalLength) * 100);

          // Calculate download speed
          const currentTime = Date.now();
          const timeElapsed = (currentTime - lastTime) / 1000;

          if (timeElapsed > 0.1) {
            const bytesDownloaded = downloadedLength - lastDownloadedLength;
            const currentSpeed = bytesDownloaded / timeElapsed;
            averageSpeed = smoothingFactor * currentSpeed + (1 - smoothingFactor) * averageSpeed;
            lastDownloadedLength = downloadedLength;
            lastTime = currentTime;
          }

          progressData.files[i] = fileProgress
          await fs.writeJson(progressFilePath, progressData);
          event.sender.send('download-progress', {progress, downloadSpeed: averageSpeed});
        });
          //response.data.pipe(tg.throttle())
          response.data.pipe(writer);
        //response.data.pipe(tg.throttle).pipe(writer);
        response.data.on('error', async (err) => {
          console.error('Stream error:', err.message);
          // Save current progress
          await fs.writeJson(progressFilePath, progressData);
          // Optionally retry or abort
        });


        await new Promise<void>((resolve, reject) => {
          writer.on('finish', () => {
            resolve();
            fileCount += 1;
          });
          signal.addEventListener('abort', () => {
            resolve();
          });
          writer.on('error', (err) => {
            console.error('Error writing file:', err);
            reject();
          });

        });
      }

        return new Promise<string>((resolve, reject) => {

          if(totalDownloaded == totalLength)
          {
           resolve('File downloaded successfully');
            fs.removeSync(path.join(fileDirectory, 'download-progress.json'));
          }
          else if (totalDownloaded < totalLength)
          {
            resolve('Download paused by user');
          }
          else
          {
            reject('Failed to download file');
          }
        });

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Download paused');
      } else {
        console.error('Download error:', error);
      }
      return 'Error downloading file' + error;
    }

  }
  // static async DownloadFile(
  //   event: any,
  //   urlCombined: string,
  //   title: string,
  //   version: string,
  //   resume = false,
  //   previousDownloadedSize = 0,
  //   index = 0
  // ) {
  //   try {
  //     ShibNetworking.controller = new AbortController();
  //     const signal = ShibNetworking.controller.signal;
  //     const estore = new Store();
  //     const installDirectory = estore.get('Location');
  //     let fileCount: number = -1;
  //
  //     const urls = JSON.parse(urlCombined);
  //     let totalLength = 0;
  //     let totalDownloaded = 0;
  //
  //     let fileDirectory: string = "";
  //     if (typeof installDirectory === "string") {
  //       fileDirectory = path.join(installDirectory, 'downloads/' + title);
  //     }
  //     await fs.ensureDir(fileDirectory);
  //
  //     console.log('File will be saved to:', fileDirectory);
  //     console.log(version);
  //
  //     const progressFilePath = path.join(fileDirectory, 'download-progress.json');
  //     let progressData = {
  //       files: urls.map(() => ({
  //         selfLength: 0,
  //         downloadedLength: 0,
  //         name: ""
  //       }))
  //     };
  //
  //     // Load progress data if resuming
  //     if (resume && fs.existsSync(progressFilePath)) {
  //       progressData = fs.readJsonSync(progressFilePath);
  //     } else {
  //       // Initialize progressData for each file
  //       fs.writeJsonSync(progressFilePath, progressData);
  //     }
  //
  //     for (let i = 0; i < urls.length; i++) {
  //       const url = urls[i]["url"];
  //
  //       const response = await axios({
  //         url,
  //         method: 'GET',
  //         headers,
  //         responseType: 'stream',
  //         signal,
  //       });
  //
  //       const fileSize = Number(response.headers['content-length']);
  //       progressData.files[i].selfLength = fileSize;
  //       totalLength += fileSize;
  //       totalDownloaded += progressData.files[i].downloadedLength;
  //     }
  //
  //     let writer: fs.WriteStream;
  //     let downloadedLength = previousDownloadedSize;
  //
  //     for (let i = index; i < urls.length; i++) {
  //       let fileProgress: any = progressData.files[i];
  //       const filePath = path.join(fileDirectory, '/' + urls[i]["fileName"]);
  //       const url = urls[i]["url"];
  //       const headers = resume
  //         ? { Range: `bytes=${fileProgress.downloadedLength}-` }
  //         : {};
  //       const agent = new http.Agent({ keepAlive: true });
  //
  //       while (true) {
  //         try {
  //           const response = await axios({
  //             url,
  //             method: 'GET',
  //             headers,
  //             responseType: 'stream',
  //             httpAgent: agent,
  //             signal,
  //           });
  //
  //           response.data._readableState.highWaterMark = 1024 * 1024 * 10;
  //
  //           fileProgress.name = urls[i]["fileName"];
  //           if (!fileProgress.selfLength) {
  //             fileProgress.selfLength = Number(response.headers['content-length']);
  //           }
  //
  //           writer = fs.createWriteStream(filePath, { flags: resume ? 'a' : 'w' });
  //
  //           let lastDownloadedLength = 0;
  //           let lastTime = Date.now();
  //           let averageSpeed = 0;
  //           const smoothingFactor = 0.1;
  //
  //           response.data.on('data', async (chunk: Buffer) => {
  //             downloadedLength += chunk.length;
  //             fileProgress.downloadedLength += chunk.length;
  //             totalDownloaded += chunk.length;
  //             const progress = Math.round((totalDownloaded / totalLength) * 100);
  //
  //             const currentTime = Date.now();
  //             const timeElapsed = (currentTime - lastTime) / 1000;
  //
  //             if (timeElapsed > 0.1) {
  //               const bytesDownloaded = downloadedLength - lastDownloadedLength;
  //               const currentSpeed = bytesDownloaded / timeElapsed;
  //               averageSpeed = smoothingFactor * currentSpeed + (1 - smoothingFactor) * averageSpeed;
  //               lastDownloadedLength = downloadedLength;
  //               lastTime = currentTime;
  //             }
  //
  //             progressData.files[i] = fileProgress;
  //             await fs.writeJson(progressFilePath, progressData);
  //             event.sender.send('download-progress', { progress, downloadSpeed: averageSpeed });
  //           });
  //
  //           response.data.pipe(writer);
  //
  //           await new Promise<void>((resolve, reject) => {
  //             writer.on('finish', () => {
  //               resolve();
  //               fileCount += 1;
  //             });
  //             signal.addEventListener('abort', () => resolve());
  //             writer.on('error', (err) => {
  //               console.error('Error writing file:', err);
  //               reject(err);
  //             });
  //           });
  //
  //           break; // Exit the retry loop on successful download
  //         } catch (error) {
  //           if (axios.isCancel(error)) {
  //             console.log('Download paused');
  //             throw error;
  //           } else {
  //             console.error('Network error occurred. Retrying...', error);
  //             await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
  //           }
  //         }
  //       }
  //     }
  //
  //     return new Promise<string>((resolve, reject) => {
  //       if (totalDownloaded === totalLength) {
  //         resolve('File downloaded successfully');
  //         fs.removeSync(path.join(fileDirectory, 'download-progress.json'));
  //       } else if (totalDownloaded < totalLength) {
  //         resolve('Download paused by user');
  //       } else {
  //         reject('Failed to download file');
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Download error:', error);
  //     return 'Error downloading file: ' + error;
  //   }
  // }



  static PauseDownload() {
    ShibNetworking.controller.abort();
  }
  static resumeDownload() {
    ShibNetworking.controller = new AbortController(); // Create a new AbortController for resuming
  }
// static async cancelDownload(title: string) {
//   ShibNetworking.controller.abort(); // Abort the download to cancel it
//   const estore = new Store();
//   const installDirectory = estore.get('Location');
//   let fileDirectory: string = "";
//
//   if (typeof installDirectory === "string") {
//     fileDirectory = path.join(installDirectory);
//   }
//   const filePath = path.join(fileDirectory +'/downloads/', title);
//   const deleteCommand = `Remove-Item -Path '${filePath}' -Recurse -Force`;
//
//   exec(`powershell -Command "${deleteCommand}"`, (error) => {
//     if (error) {
//       console.error('Failed to delete folder:', error);
//     } else {
//       console.log('Folder deleted successfully.');
//     }
//   });
//   console.log('Download canceled and partially downloaded file deleted.');
// }
  static async cancelDownload(title: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        ShibNetworking.controller.abort(); // Abort the download to cancel it
        const estore = new Store();
        const installDirectory = estore.get('Location');
        let fileDirectory: string = "";

        if (typeof installDirectory === "string") {
          fileDirectory = path.join(installDirectory);
        }

        const filePath = path.join(fileDirectory + '/downloads/', title);
        const deleteCommand = `Remove-Item -Path '${filePath}' -Recurse -Force`;

        exec(`powershell -Command "${deleteCommand}"`, (error) => {
          if (error) {
            console.error('Failed to delete folder:', error);
            reject(error);
          } else {
            console.log('Folder deleted successfully.');
            resolve();
          }
        });
      } catch (error) {
        console.error('Error during cancel download:', error);
        reject(error);
      }
    });
  }


  static async playGame(title: string, EntryPoint: string) {
    try {
      const estore = new Store();
      const installDirectory = estore.get('Location');
      let fileDirectory: string = "";

      if (typeof installDirectory === "string") {
        fileDirectory = path.join(installDirectory);
      }
      const filePath = path.join(fileDirectory + '/downloads/' + title + '/' + title, EntryPoint);
      ShibFileManager.LaunchGame(filePath, [`-token=${estore.get('Token')}`, `-user_data={\\"WalletId\\":\\"";\\"UserId\\":\\"69\\"}`]);

    } catch (err) {
      console.error('Error while trying to play the downloaded file:', err);
    }
  }
  static async selectFolder()  {
  const result =  await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
    if (result.canceled) {
      return null; // No folder selected
    } else {
      return result.filePaths[0]; // Return the selected folder path
    }
  }

}


export type FetchProps = {
  method?: "get" | "post" | "put" | "patch" | "delete",
  api: string,
  body?: object,
  query?: object,
  headers?: object
  // tokenkey?: string | null
};
