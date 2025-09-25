import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {},
  reducers: {
    addItem: (state, action) => {
      const id = action.payload
      state[id] = (state[id] || 0) + 1
    },
    updateItem: (state, action) => {
      const { id, qty } = action.payload
      if (qty <= 0) delete state[id]
      else state[id] = qty
    },
    clearCart: () => {
      return {}
    }
  }
})

export const { addItem, updateItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
