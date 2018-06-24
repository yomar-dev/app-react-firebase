import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


firebase.initializeApp({
	apiKey: "AIzaSyCk5WafsDdWzj1-FvW2wJrIvshxJtyC_W8",
    authDomain: "app-react-firebase.firebaseapp.com",
    databaseURL: "https://app-react-firebase.firebaseio.com",
    projectId: "app-react-firebase",
    storageBucket: "app-react-firebase.appspot.com",
    messagingSenderId: "271296205604"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
