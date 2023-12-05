import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

// ** Fetch Servizi
export const fetchAllServizi = createAsyncThunk('appsServizi/fetchData', async params => {
  const response = await axios.get(`${backendURL}/servizi`)

  return response.data
})

// ** Fetch servizi id
export const fetchServizio = createAsyncThunk('Servizi/fetchData', async servzioId => {
  const response = await axios.get(`${backendURL}/servizi/${servzioId}`)

  return response
})

export const appsServizisSlice = createSlice({
  name: 'appsServizi',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllServizi.fulfilled, (state, action) => {
      state.data = action.payload.data.data
      state.total = action.payload.data.totalItems
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appsServizisSlice.reducer
