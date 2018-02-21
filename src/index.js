import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {IntlProvider, FormattedMessage, FormattedDate} from 'react-intl';

ReactDOM.render(
    <IntlProvider locale="en">
        <App />
    </IntlProvider>,
  document.getElementById('root')
);
