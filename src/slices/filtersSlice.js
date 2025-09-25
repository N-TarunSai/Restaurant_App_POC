import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    query: '',
    veg: 'all'
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload
    },
    setVeg: (state, action) => {
      state.veg = action.payload
    }
  }
})

export const { setQuery, setVeg } = filterSlice.actions
export default filterSlice.reducer
