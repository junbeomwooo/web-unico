import React from 'react';
import ReactDOM from 'react-dom/client';

/**/
import App from './App';
/*/
import App from './Test';
/**/

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Meta from './Meta';
import store from './store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <Meta />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);