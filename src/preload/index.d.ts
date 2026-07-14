import { ElectronAPI } from '@electron-toolkit/preload'
import {ShibAPIProps} from "./ShibAPI";

declare global {
  interface Window {
    electron: ElectronAPI
    ShibAPI: ShibAPIProps,

    openLoginModal: (guid: string) => Promise<void>
    userAddress: string | undefined
    result: string
  }
}
