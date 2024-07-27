import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SettingProvider } from './contexts/setting/SettingContext';
import { ModalProvider } from './contexts/modal/ModalContext';
import { AuthProvider } from './contexts/auth/AuthContext';
import { ConversationProvider } from './contexts/conversation/ConversationContext';
import { MovementProvider } from './contexts/movement/MovementContext';
import { QueryClient, QueryClientProvider } from 'react-query'
import {disableReactDevTools} from '@fvilers/disable-react-devtools'

// if(process.env.NODE_ENV === 'production') {
//   disableReactDevTools()
// }

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SettingProvider>
        <ModalProvider>
          <AuthProvider>
            <ConversationProvider>
              <MovementProvider>
                  <App />
              </MovementProvider>
            </ConversationProvider>
          </AuthProvider>
        </ModalProvider>
      </SettingProvider>
    </QueryClientProvider>
  </React.StrictMode >
)
