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
    let mediaRecorder;
    let recordedBlobs;
    let sourceBuffer;
    let errorMsg = ''
    let activeModal = 'videoModal'
    let streaming = false
    let width = 320;    // We will scale the photo width to this
    let height = 0;     // This will be computed based on the input stream

    const recordButton = document.querySelector('button#record');
    // let canvas
    // recordButton.addEventListener('click', () => {
    //   if (recordButton.textContent === 'Start Recording') {
    //     startRecording();
    //   } else {
    //     stopRecording();
    //     recordButton.textContent = 'Start Recording';
    //     playButton.disabled = false;
    //     downloadButton.disabled = false;
    //   }
    // });

    function play () {
      const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
      const recorded = document.querySelector('audio#recorded');
      recorded.src = null;
      recorded.srcObject = null;
      recorded.src = window.URL.createObjectURL(superBuffer);
      recorded.controls = true;
      recorded.play();
    };

    function download () {
      const blob = new Blob(recordedBlobs, {type: 'video/webm'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'test.webm';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    };

    function handleSourceOpen(event) {
      console.log('MediaSource opened');
      sourceBuffer = mediaSource.addSourceBuffer('video/webm');
      console.log('Source buffer: ', sourceBuffer);
    }

    function handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
    }

    function startRecording() {
      recordedBlobs = [];
      let options = {mimeType: 'video/webm;codecs=vp9'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        errorMsg = `${options.mimeType} is not Supported`;
        options = {mimeType: 'video/webm; codecs=vp9'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not Supported`);
          errorMsg = `${options.mimeType} is not Supported`;
          options = {mimeType: 'video/webm;codecs=vp8'};
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`);
            errorMsg = `${options.mimeType} is not Supported`;
            options = {mimeType: ''};
          }
        }
      }

      try {
        mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        errorMsg = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
        return;
      }

      console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
      recordButton.textContent = 'Stop Recording';
      // playButton.disabled = true;
      // downloadButton.disabled = true;
      mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
      };
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start(10); // collect 10ms of data
      console.log('MediaRecorder started', mediaRecorder);
    }

    function stopRecording() {
      mediaRecorder.stop();
      console.log('Recorded Blobs: ', recordedBlobs);
    }

    function handleSuccess(stream) {
      recordButton.disabled = false;
      console.log('getUserMedia() got stream:', stream);
      window.stream = stream;

      const gumAudio = document.querySelector('audio#gum');
      gumAudio.srcObject = stream;
    }

    async function init() {
      console.log('inited')
      const constraints = {
        audio: true
      };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
            <ModalRoot activeModal={'audioModal'}>
                <ModalCard id={'errorModal'}>
                    {{errorMsg}}
                </ModalCard>
                <ModalCard id='audioModal'>
                    <audio id="gum" playsInline type="audio/ogg" muted autoPlay></audio>
                    <audio id="recorded" playsInline type="audio/ogg" loop></audio>
                    <Button size="l" onClick={() => init()}>Init</Button>
                    <Button size="l" onClick={startRecording}>Start</Button>
                    <Button size="l" onClick={stopRecording}>Stop</Button>
                    <Button size="l" onClick={download}>Download</Button>
                    <Button size="l" onClick={play}>Play</Button>
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


