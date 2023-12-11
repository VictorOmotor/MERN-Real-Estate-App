import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload
    },
    deleteUserSuccess: (state, action) => {
      state.currentUser = null
    },
    signOutSuccess: (state) => {
      state.currentUser = null
    },
  },
})

export const {
  signInSuccess,
  updateUserSuccess,
  deleteUserSuccess,
  signOutSuccess,
} = userSlice.actions

export default userSlice.reducer
