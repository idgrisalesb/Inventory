import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import 'siesa-ui-kit/styles.css';
import './index.css';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: (props: any) => {
    const token = props.token || props.authToken;
    return (
      <AuthProvider initialToken={token}>
        <App {...props} />
      </AuthProvider>
    );
  },
  errorBoundary(err: any, info: any, props: any) {
    console.error('Inventory Module Error:', err);
    return <div>Error loading module</div>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
