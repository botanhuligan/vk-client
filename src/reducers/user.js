const initialState = {}

export default function user(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...action.payload
            }
        default:
            return state
    }
}