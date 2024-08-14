import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  venueState: {
    description: '',
    highlight: ''
  },
  isLoading: false // Add isLoading state to handle loading state
}

const venueSlice = createSlice({
  name: 'venue',
  initialState: initialState,
  reducers: {
    venueData: (state, action) => {
      if (Object.keys(action.payload).length === 0) {
        state.venueState = {
          description: '',
          highlight: ''
        };
      } else {
        state = {
          ...state,
          venueState: {
            ...state.venueState,
            ...action.payload
          }
        };
      }
      // localStorage.setItem('adsf546a5sdf4', JSON.stringify(state.venueState));
      return state;
    }
  }
});

export const { venueData } = venueSlice.actions;

export default venueSlice.reducer;
