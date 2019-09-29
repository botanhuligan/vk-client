import React, { useState } from 'react';
import ModalRoot from '@vkontakte/vkui/dist/components/ModalRoot/ModalRoot';
import Audio from '../modals/Audio';
import Photo from '../modals/Photo';
import {useSelector, useDispatch} from "react-redux";

const ModalWrapper = props => {
    const activeModal = useSelector(state => {
        console.log('state', state.modals)
        return state.modals.activeModal
    })
    const dispatch = useDispatch()
    // const [activeModal, setActiveModal] = useState('audioModal')
    console.log('activeModal', activeModal)
    return (
        <ModalRoot
            activeModal={activeModal}
            style={{height: '500px'}}
        >
            <Audio onClose={() => () => dispatch({ type: 'CHANGE_ACTIVE_MODAL', payload: null })} id={'audioModal'}></Audio>
            <Photo onClose={() => () => dispatch({ type: 'CHANGE_ACTIVE_MODAL', payload: null })} id={'photoModal'}></Photo>
        </ModalRoot>
    );
}

ModalWrapper.propTypes = {
};

export default ModalWrapper;
