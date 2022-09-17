/* @refresh reload */
import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';

import App from './App';
import { Store } from './components/Store';

render(() => (
    <Store>
        <Router>
            <App />
        </Router>
    </Store>
), document.getElementById('root') as HTMLElement);
