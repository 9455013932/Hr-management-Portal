import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    rank: [],
    user: null,
    associate: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userRank: (state, action) => {
            state.rank = action.payload;
        },
        userDetails: (state, action) => {
            state.user = action.payload;
        },
        AssociateDetails: (state, action) => {
            state.associate = action.payload
        }
    },
});

export const { userDetails, userRank,AssociateDetails } = userSlice.actions;

export default userSlice.reducer;
