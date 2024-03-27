'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import * as React from 'react';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import SuspenseLoader from '../components/SuspenseLoader';
import { AppRouter } from './AppRouter';

const Entrypoint = () => (
  <React.StrictMode>
    <Suspense fallback={<SuspenseLoader />}>
      <BrowserRouter>
        {/* Define here shared content upper outlet, ex header */}
        <AppRouter />
        {/* Define here shared content below outlet, ex footer */}
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);

export default Entrypoint;
