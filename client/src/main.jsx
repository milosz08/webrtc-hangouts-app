'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { createRoot } from 'react-dom/client';
import Entrypoint from './router/Entrypoint';
import './styles/index.css';

createRoot(document.getElementById('app-mount')).render(<Entrypoint />);
