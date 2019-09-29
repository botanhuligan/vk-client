import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import ModalRoot from '@vkontakte/vkui/dist/components/ModalRoot/ModalRoot';
import ModalCard from '@vkontakte/vkui/dist/components/ModalCard/ModalCard';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import {useDispatch} from "react-redux";

const osName = platform();

const Photo = props => {
    const dispatch = useDispatch()
    const mediaSource = new MediaSource();
    const [height, setHeight] = useState(0)
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    let sourceBuffer;
    let errorMsg = ''
    let streaming = false
    let width = 320;    // We will scale the photo width to this

    useEffect(() => {
        init()
    })

    const [ activePage, setActivePage ] = useState('start')

    function handleSourceOpen(event) {
      console.log('MediaSource opened');
      sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
      console.log('Source buffer: ', sourceBuffer);
    }

    function handleSuccess(stream) {
      const video = document.querySelector('video#recorded');
      window.stream = stream; // make stream available to browser console
      video.srcObject = stream;
    }

    function takePhoto() {
        const canvas = document.getElementById('canvas')
        const video = document.getElementById('recorded')
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL('image/png');
        console.log('data', data)
    }

    window.addEventListener('load', init)

    async function init() {
      console.log('inited')
      const canvas = window.canvas = document.getElementById('canvas')
      const video = document.getElementById('recorded')
      video.addEventListener('canplay', function(ev){
          if (!streaming) {
            setHeight(video.videoHeight / (video.videoWidth/width))
            console.log('height', width, height)
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.width = width;
            canvas.height = height;
            streaming = true;
          }
      }, false);
      try {
        console.log('navigator', navigator.mediaDevices)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true});
        handleSuccess(stream);
      } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        errorMsg = `navigator.getUserMedia error:${e.toString()}`;
      }
    }

    return (
        <ModalCard id='photoModal' onClose={() => dispatch({ type: 'CHANGE_ACTIVE_MODAL', payload: null })}>
            <video id="recorded" playsInline autoPlay></video>
            <canvas id="canvas" width="320" height="240">
            </canvas>
            <Button size="l" onClick={takePhoto}>Take a photo</Button>
        </ModalCard>
    );
}

Photo.propTypes = {
	id: PropTypes.string.isRequired,
};

export default Photo;


