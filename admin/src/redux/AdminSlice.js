import { createSlice } from '@reduxjs/toolkit';

export const AdminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null,
  },
  reducers: {
    Login: (state, action) => {
      state.admin = action.payload;
    },
    Logout: (state) => {
      state.admin = null;
    },
  },
});

export const { Login, Logout } = AdminSlice.actions;
export default AdminSlice.reducer;
