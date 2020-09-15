const initialState = {
  text: '',
  variant: '',
};

const Snackbar = (state = initialState, action) => {
  switch (action.type) {
    case 'MESSAGE':
      const { text, variant } = action?.payload;
      return {
        ...state,
        text,
        variant,
      };
    case 'ERROR':
      return {
        ...state,
        text,
        variant,
      };
    default:
      return state;
  }
};

export default Snackbar;
