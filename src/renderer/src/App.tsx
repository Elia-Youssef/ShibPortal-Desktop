import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ShibContext } from './hooks/context'
import Login from './pages/Login'
import BootScreen from './pages/BootScreen'
import Home from './pages/Home'
import ViewGame from "./pages/ViewGame";
import LoginForm from "./pages/LoginForm";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import PopupUpdate from "./pages/PopupUpdate";
import jsonConfig from "../../../config/config.json";
import {
  Environments,
  ShibAuthSdk,
  IAuthOptions,
  sepoliaChain,
  shibariumChain,
  puppynetChain,
  ethereumChain
} from '@shibaone/shib-auth-sdk'

export default function App(): JSX.Element {
  const networkOptions: IAuthOptions = {
    Chains: [sepoliaChain, shibariumChain, puppynetChain, ethereumChain],
    WalletConnectProjectId: "398b88d053e195542fe90f7454be3680",
    PasswordlessProvider: undefined,
    IsDecentralizedDisabled: false,
    DiscordProvider: undefined,
    GoogleProvider: undefined,
    AppName: "Shib Launcher",
  }

  return (
    <ShibContext>
      <ShibAuthSdk
        mode={jsonConfig.environment == "prod" ? Environments.PROD : Environments.DEV}
        options={networkOptions}
      >
      <Router>
        <Routes>
          <Route path="/" element={<BootScreen />} />
          <Route path="/popupUpdate" element={<PopupUpdate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/LoginForm" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/view_game/:game_id" element={<ViewGame />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
        </ShibAuthSdk>
    </ShibContext>
  )
}
