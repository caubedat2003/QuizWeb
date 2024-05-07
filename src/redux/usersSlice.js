import { createSlice } from '@reduxjs/toolkit';

// Slice
//purpose: to store the users data
const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: null
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        }
    }
});
export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;