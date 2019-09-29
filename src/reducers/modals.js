const initialState = {
    activePage: 'start',
    activeModal: 'audioModal',
    messages: []
}

export default function modals(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_ACTIVE_PAGE':
            return {
                ...state,
                activePage: action.payload
            }
        case 'CHANGE_ACTIVE_MODAL':
            return {
                ...state,
                activeModal: action.payload
            }
        case 'PUSH_MESSAGE':
            state.messages.push(action.payload)
            return state
        default:
            return state
    }
}