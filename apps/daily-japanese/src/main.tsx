import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { environment } from './environments/environment';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter basename={environment.baseHref}>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
