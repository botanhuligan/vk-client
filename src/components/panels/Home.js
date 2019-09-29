import axios from  'axios'
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon24User from '@vkontakte/icons/dist/24/user';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import ModalWrapper from '../panels/ModalWrapper';
import Mic from '../icons/Mic';
import {useSelector, useDispatch} from "react-redux";
import connect from '@vkontakte/vk-connect';
// import exhibitions from '../../img/exhibitions.png';
// import collections from '../../img/collections.png';
// import programs from '../../img/programs.png';
// import toilet from '../../img/toilet.png';
// import walking from '../../img/walking.png';
import {MESSAGE_SERVER_URL} from "../../constants";

const Home = ({ id, }) => {
	const [ activeTab, setActiveTab ] = useState('story')
	const messages = useSelector(state => {
        return state.user.messages
    })
	const activePage = useSelector(state => {
        return state.modals.activePage
    })
	const activeModal = useSelector(state => {
        return state.modals.activeModal
    })
	const user = useSelector(state => {
        return state.user
    })
    const dispatch = useDispatch()
    const [messageCount, setMessageCount] = useState(0);
    const [inRoom, setInRoom] = useState(false);
    // const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		/*
		** Получаем данные о пользователе
		* */
		connect.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await connect.sendPromise('VKWebAppGetUserInfo');
			await dispatch({ type: 'SET_USER', payload: user })
			console.log('user', user)
			setPopout(null);
		}
		dispatch({type: 'SET_ACTIVE_PAGE', payload: 'start' })
		fetchData();
	}, []);

      const itemStyle = {
    flexShrink: 0,
    width: 80,
    height: 94,
    display: 'flex',
    flexDirection:
    'column',
    alignItems: 'center',
    fontSize: 12
  };

	return (
	<Panel id={id}>
		<PanelHeader >Mira</PanelHeader>
		<Group>
			<Tabs theme='header' type='buttons'>
				<TabsItem
					onClick={() => setActiveTab('all')}
					selected={activeTab === 'all'}
				>Все</TabsItem>
				<TabsItem
					onClick={() => setActiveTab('museums')}
					selected={activeTab === 'museums'}
				>
					Музеи
				</TabsItem>
				<TabsItem
					onClick={() => setActiveTab('exhibitions')}
					selected={activeTab === 'exhibitions'}
				>
					Выставки
				</TabsItem>
				<TabsItem
					onClick={() => setActiveTab('programs')}
					selected={activeTab === 'programs'}
				>
					Программы
				</TabsItem>
			</Tabs>
		</Group>
		{activePage === 'start' &&
		<Group>
			<Header style={{height: '100%'}}>У вас нет историй</Header>
			<Div style={{height: '300px'}}>
				Ходите в музей и на выставки, делайте фото и сторис будет пополняться
			</Div>
		</Group>}
		{activePage === 'story' &&
		<Group>
			<Tabs>
				<TabsItem
					onClick={() => setActiveTab({type: 'SET_ACTIVE_TAB', activeTab: 'story'})}
					selected={activeTab === 'story'}
				>История</TabsItem>
				<TabsItem
					onClick={() => setActiveTab({type: 'SET_ACTIVE_TAB', activeTab: 'nav'})}
					selected={activeTab === 'nav'}
				>Навигация</TabsItem>
			</Tabs>
			{activeTab === 'story' && <Header level='secondary'>Истории</Header>}
			{activeTab === 'story' &&
			<HorizontalScroll>
				<div style={{display: 'flex'}}>
					<div style={{...itemStyle, paddingLeft: 4}}>
						<Avatar size={64} style={{marginBottom: 8}}><Icon24User/></Avatar>
						Элджей
					</div>
					<div style={{...itemStyle, paddingLeft: 4}}>
						<Avatar size={64} style={{marginBottom: 8}}><Icon24User/></Avatar>
						Ольга
					</div>
					<div style={{...itemStyle, paddingLeft: 4}}>
						<Avatar size={64} style={{marginBottom: 8}}><Icon24User/></Avatar>
						Элджей
					</div>
					<div style={{...itemStyle, paddingLeft: 4}}>
						<Avatar size={64} style={{marginBottom: 8}}><Icon24User/></Avatar>
						Ольга
					</div>
					<div style={{...itemStyle, paddingLeft: 4}}>
						<Avatar size={64} style={{marginBottom: 8}}><Icon24User/></Avatar>
						Элджей
					</div>
				</div>
			</HorizontalScroll>
			}
		</Group>
		}
		<ModalWrapper />
		<FixedLayout vertical="bottom" style={{ backgroundColor: '#2E3238', height: '77px' }}>
			<Button
				style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}
				level='tertiary'
				onClick={() => {
					console.log('clicked')
					dispatch({ type: 'CHANGE_ACTIVE_MODAL', payload: 'audioModal' })
				}}
			>
				<Mic/>
			</Button>
		</FixedLayout>
	</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
