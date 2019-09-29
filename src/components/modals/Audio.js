import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import ModalPage from '@vkontakte/vkui/dist/components/ModalPage/ModalPage';
import ModalPageHeader from '@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Search from '@vkontakte/vkui/dist/components/Search/Search';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import Icon24Play from '@vkontakte/icons/dist/24/play';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Start from '../icons/Start';
import Stop from '../icons/Stop';
import Camera from '../icons/Camera';
import { connect, useDispatch } from "react-redux";
import Chat from '../blocks/Chat'
import { downloadAudio } from '../../utils'
import Recorder from 'recorderjs'

const osName = platform();

const Audio = ({ id }) => {
    const dispatch = useDispatch()
    const mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    let mediaRecorder;
    let recordedBlobs;
    let sourceBuffer;
    let errorMsg = ''
    let audioContext
    let recorder

    const recordButton = document.querySelector('button#record');

    const [activeModal, setActiveModal] = useState(id)
    const [recordButtonState, setRecordButtonState] = useState(true)

    useEffect(() => {
        startRecording()
    });

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

    async function startRecording() {
      await init()
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
      // playButton.disabled = true;
      // downloadButton.disabled = true;
      mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
      };
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start(10); // collect 10ms of data
      console.log('MediaRecorder started', mediaRecorder);
    }

    async function stopRecording() {
      console.log('Recorded Blobs: ', recordedBlobs);
      setRecordButtonState(!recordButtonState)
      mediaRecorder.stop();
      // await downloadAudio(recordedBlobs)
      console.log('Recorded Blobs: ', recordedBlobs);
    }

    function handleSuccess(stream) {
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

    function sendText () {

    }

    return (
        <ModalPage
            header={<ModalPageHeader>Найти</ModalPageHeader>}
            id={activeModal}
            title='Найти'
            dynamicContentHeight={false}
            settlingHeight={30}
            onClose={stopRecording}
            style={{height: '100%'}}
        >
            <audio id="gum" playsInline type="audio/ogg" muted autoPlay></audio>
            <audio id="recorded" playsInline type="audio/ogg" loop></audio>
            <br/>
            <Search
                autoComplete='off'
                onChange={sendText}
                type="text"
                after=""
                defaultValue="Петров" placeholder={'&#61442;Поиск'}
            />
            <br/><br/>
            <Chat/>
            <br/>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch', paddingBottom: '30px'}}>
                <div style={{width: '50%', textAlign: 'center'}}>
                    <Button level="tertiary"
                            onClick={stopRecording}
                    >
                    {!recordButtonState &&
                    <Start color={'white'}/>
                    }
                    {recordButtonState &&
                    <Stop color={'white'}/>
                    }
                    </Button>

                    <div style={{fontSize: '14px', margin: '0 auto', width: '85px'}}>{recordButtonState ? 'Остановить' : 'Говорить'}</div>
                </div>
                <div style={{width: '50%', textAlign: 'center'}}>
                    <Button level="tertiary"
                            size="l"
                            onClick={() => dispatch({ type: 'CHANGE_ACTIVE_MODAL', payload: 'photoModal' })}
                    >
                        <Camera/>
                    </Button>
                    <div style={{fontSize: '14px', margin: '0 auto', width: '85px'}}>Сделать фото</div>
                </div>
            </div>
        </ModalPage>
    );
}

Audio.propTypes = {
	id: PropTypes.string.isRequired,
};

export default Audio;


