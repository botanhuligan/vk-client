import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import { sendMsgToTTS } from '../../utils';
import { STT_SERVER_URL, MESSAGE_RECEIVE_SERVER_URL, MESSAGE_POST_SERVER_URL } from '../../constants/index'
import {useSelector, useDispatch} from "react-redux";

const Chat = ({ id, go, fetchedUser }) => {
    /* Кмопоннет чата музяя с посетителем*/
	// const [ messages, setMessages ] = useState([])
	const messages = useSelector(state => {
        return state.modals.messages
    })
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('mounted')
        // TODO первое сообщение отпарвляем пока от нас
        const message = 'привет'
        const axiosInstanse = axios.create({ baseURL: STT_SERVER_URL, withCredentials: true, headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        }  })
        dispatch({ type: 'PUSH_MESSAGE', payload: { author: 'self', text: message } });
        const response = axiosInstanse.post(``, { message_text: message, user_id: '123' }, {crossDomain: true, headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
                'Access-Control-Origin-Header': '*'
            }
        })
        dispatch({ type: 'PUSH_MESSAGE', payload: { author: 'self', text: message } });
        dispatch({ type: 'PUSH_MESSAGE', payload: { author: 'museum', text: response } });
    }, []);

	// Sending messages, a simple POST
    function PublishForm(url, message) {

      function sendMessage(message) {
        fetch(url, {
          method: 'POST',
          body: message
        });
      }

        if (message) {
          sendMessage(message);
        }
        return false;
    }

    // Receiving messages with long polling
    function SubscribePane(url) {

      function showMessage(message) {
        let messageElem = document.createElement('div');
        messageElem.append(message);
      }

      async function subscribe() {

          const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        let response = await fetch(url);
        let message = await response.text();
        if (response.status == 502) {
          // Connection timeout
          // happens when the connection was pending for too long
          // let's reconnect
          await subscribe();
        } else if (response.status != 200) {
          // Show Error
          // showMessage(response.statusText);
          // Reconnect in one second
          await new Promise(resolve => setTimeout(resolve, 1000));
          await subscribe();
        } else if (response.status === 200 && message.message_say) {
          console.log(message)
          // Got message
          dispatch({ type: 'PUSH_MESSAGE', payload: { author: 'museum', text: message } });
          await subscribe();
        }
      }

      subscribe();
    }

    // Регистрируем отпарвка
	new PublishForm(MESSAGE_POST_SERVER_URL);
    // random url to fix https://code.google.com/p/chromium/issues/detail?id=46104
    new SubscribePane(MESSAGE_RECEIVE_SERVER_URL);

	return (
            <Div>
                <audio id="player" autoPlay />
                {messages.forEach(message => (
                        message.author === 'museum' ?
                (<div style={{fontSize: '36px', textAlign: 'right'}}>{message.text}</div>) :
                (<div style={{fontSize: '24px', textAlign: 'left', backgroundColor: '#292929'}}>{message.text}</div>)
                ))}
                <Textarea top="О себе" onChange={(e) => dispatch({ type: 'PUSH_MESSAGE', payload: { author: 'self', text: e.currentTarget.value }})}/>
            </Div>
	)
};

Chat.propTypes = {

};

export default Chat;
