import React, { useState, useEffect } from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import '@vkontakte/vkui/dist/vkui.css';
import { createStore } from 'redux'
import {Provider, useDispatch} from 'react-redux'
import { MESSAGE_SERVER_URL } from './constants';
import Home from './components/panels/Home';
import reducers from './reducers'

const App = () => {
	const store = createStore(reducers)
	const [activePanel, setActivePanel] = useState('home');
    // var socket = new WebSocket(MESSAGE_SERVER_URL);
	const go = (e, panel) => {
		setActivePanel(panel)
		e.preventDefault()
	};

	return (
		<Provider store={store}>
			<View activePanel={activePanel}>
				<Home id='home' go={go} />
			</View>
		</Provider>
	);
}

export default App;

