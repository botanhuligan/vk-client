import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import '@vkontakte/vkui/dist/vkui.css';
// import adapter from 'webrtc-adapter';

import Home from './components/panels/Home';
import Persik from './components/panels/Persik';
import Audio from './components/modals/Audio';
import Video from './components/modals/Video';
import Photo from './components/modals/Photo';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	// useEffect(() => {
	// 	connect.subscribe(({ detail: { type, data }}) => {
	// 		if (type === 'VKWebAppUpdateConfig') {
	// 			const schemeAttribute = document.createAttribute('scheme');
	// 			schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
	// 			document.body.attributes.setNamedItem(schemeAttribute);
	// 		}
	// 	});
	// 	async function fetchData() {
	// 		const user = await connect.sendPromise('VKWebAppGetUserInfo');
	// 		setUser(user);
	// 		setPopout(null);
	// 	}
	// 	fetchData();
	// }, []);

	const go = e => {
		// setActivePanel(e.currentTarget.dataset.to);
		setActivePanel()
	};

	return (
		<View activePanel={'photo'}>
			{/*<Button onClick={setActivePanel('photo')}>Photo</Button>*/}
			{/*<Button onClick={setActivePanel('audio')}>Audio</Button>*/}
			{/*<Button onClick={setActivePanel('video')}>Video</Button>*/}
			<Persik id='persik' go={go} />
			<Audio id='audio' go={go} />
			<Video id='video' go={go} />
			<Photo id='photo' go={go} />
		</View>
	);
}

export default App;

