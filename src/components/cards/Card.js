import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';

const Card = ({ id, go, fetchedUser }) => {
	const [ activeTab, setActiveTab ] = useState('all')
	return (
	<Panel id={id}>
		<PanelHeader>Mira</PanelHeader>
		<Group>
		{/*{fetchedUser &&*/}
		{/*<Group title="User Data Fetched with VK Connect">*/}
		{/*	<Cell*/}
		{/*		before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}*/}
		{/*		description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}*/}
		{/*	>*/}
		{/*		{`${fetchedUser.first_name} ${fetchedUser.last_name}`}*/}
		{/*	</Cell>*/}
		{/*</Group>}*/}

		{/*<Group title="Navigation Example">*/}
		{/*	<Div>*/}
		{/*		<Button size="xl" level="2" onClick={go} data-to="persik">*/}
		{/*			Show me the Persik, please*/}
		{/*		</Button>*/}
		{/*	</Div>*/}
		{/*</Group>*/}
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
	</Panel>
	)
};

Card.propTypes = {
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

export default Card;
