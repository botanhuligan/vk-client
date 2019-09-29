import axios from 'axios'
import { BASE_STT_URL, BASE_STT_METHOD, BASE_TTS_METHOD } from '../constants'

export const getBlobToBase64 = async (blob) => {
    let reader = new window.FileReader();
    let base64 = ''
    reader.readAsDataURL(blob[0]);
    reader.onloadend = function() {
       base64 = reader.result;
       base64 = base64.split(',')[1];
       console.log(base64 );
    }
    return base64
}

const getGoogleJSONRequest = (content) => {
    return {
      "config": {
        "encoding":"FLAC",
        "sampleRateHertz":16000,
        "languageCode":"en-US"
       },
      "audio": {
        content
      }
    }
}

export const downloadAudio = async (blob) => {
    console.log('start download')
    const formData = new FormData()
    formData.append('voice', blob)
    const headers = {
        Authorization: `Bearer `,
        'Content-Type': 'multipart/form-data',
        'boundary': '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    }
    const axiosInstance = axios.create({ headers, crossDomain: true })
    const response = axiosInstance.post(`${BASE_STT_URL}${BASE_STT_METHOD}`, formData)
    console.log('stop download', response)
    return response
}

export const sendMsgToTTS = async (msg) => {
    console.log('start send message to TTS')
    const headers = {
        Authorization: `Bearer ` // FIXME сделать авторизацию когда будет на бэкенде
    }
    const axiosInstance = axios.create({ headers, crossDomain: true })
    const response = axiosInstance.post(`${BASE_STT_URL}${BASE_TTS_METHOD}`, { text: msg })
    console.log('stop sending message', response)
    return response
}