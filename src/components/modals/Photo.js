import React from 'react';
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

import persik from '../../img/persik.png';

const osName = platform();

const Audio = props => {
    const mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    let sourceBuffer;
    let errorMsg = ''
    let streaming = false
    let width = 320;    // We will scale the photo width to this
    let height = 0;     // This will be computed based on the input stream

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

    async function takePhoto() {
        const canvas = document.getElementById('canvas')
        const video = document.getElementById('recorded')
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        // const photo = document.getElementById('photo');
        // const gumVideo = document.querySelector('video#recorded');
        // console.log('height', height)
        // canvas.width = width;
        // canvas.height = height;
        // console.log('gumVideo', gumVideo)
        // context.drawImage(gumVideo, 0, 0, width, height);
        //
        const data = canvas.toDataURL('image/png');
        // photo.setAttribute('src', data);
        console.log('data', data)
    }

    async function init() {
      console.log('inited')
      const canvas = window.canvas = document.getElementById('canvas')
      const video = document.getElementById('recorded')
      video.addEventListener('canplay', function(ev){
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth/width);
            console.log('height', width, height)
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            // canvas.setAttribute('width', width);
            // canvas.setAttribute('height', height);
            canvas.width = width;
            canvas.height = height;
            streaming = true;
          }
      }, false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true});
        handleSuccess(stream);
      } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        errorMsg = `navigator.getUserMedia error:${e.toString()}`;
      }
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={<HeaderButton onClick={props.go} data-to="home">
                    {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </HeaderButton>}
            >
                Audio/Video
            </PanelHeader>
            <video id="recorded"  playsInline autoPlay></video>
            <canvas id="canvas" width="300" height="300">
            </canvas>
            <img id="photo" alt="The screen capture will appear in this box."/>
            <ModalRoot activeModal={'photoModal'}>
                <ModalCard id={'errorModal'}>
                    {{errorMsg}}
                </ModalCard>
                <ModalCard id='photoModal'>
                    <Button size="l" onClick={() => init()}>Init</Button>
                    <Button size="l" onClick={takePhoto}>Take a photo</Button>
                </ModalCard>
            </ModalRoot>
        </Panel>
    );
}

Audio.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Audio;


