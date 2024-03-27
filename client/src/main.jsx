'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import Entrypoint from './router/Entrypoint';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('app-mount')).render(
  <React.StrictMode>
    <Entrypoint />
  </React.StrictMode>
);
