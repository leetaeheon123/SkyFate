export const locationReducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      const {latitude, longitude} = action.payload || {};

      const latlng = {
        latitude,
        longitude,
      };

      // console.log(latlng);
      // const { content } = action.payload || {};
      return {...state, latlng: latlng};
    }
    // case 'start-update': {
    //   return { ...state, updating: true, error: '' };
    // }
    // case 'end-update': {
    //   return { ...state, updating: false };
    // }
    // case 'error': {
    //   const { error } = action.payload || {};
    //   return { ...state, error };
    // }
  }
  return {...state};
};
