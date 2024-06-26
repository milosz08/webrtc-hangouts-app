'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { Suspense } from 'react';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SuspenseLoader from '../components/SuspenseLoader';
import AppContextProvider from '../context/AppContextProvider';
import PeerProvider from '../context/PeerProvider';
import SocketProvider from '../context/SocketProvider';
import AppRouter from './AppRouter';

const Entrypoint = () => (
  <Suspense fallback={<SuspenseLoader />}>
    <SnackbarProvider>
      <AppContextProvider>
        <SocketProvider>
          <PeerProvider>
            <BrowserRouter>
              <div className="flex-col flex min-h-screen">
                <Navbar />
                <AppRouter />
              </div>
            </BrowserRouter>
          </PeerProvider>
        </SocketProvider>
      </AppContextProvider>
    </SnackbarProvider>
  </Suspense>
);

export default Entrypoint;
