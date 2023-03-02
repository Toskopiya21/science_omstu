import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import { CookiesProvider } from 'react-cookie';
import {BrowserRouter} from "react-router-dom";
import store from "./store/Store";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <CookiesProvider>
            <App/>
            </CookiesProvider>
        </Provider>
    </BrowserRouter>
);

reportWebVitals();
