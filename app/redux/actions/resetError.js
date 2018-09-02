import { RESET_ERROR_MESSAGE }  from '../../constants/ActionTypes'

export const resetError = () => {
    return {
        type: RESET_ERROR_MESSAGE
    };
};
