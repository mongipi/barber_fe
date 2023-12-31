import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

// ** Fetch Users
export const fetchAllClienti = createAsyncThunk('appUsers/fetchData', async params => {
  const response = await axios.get(`${backendURL}/clienti`)

  return response
})

// ** Fetch Cliente id
export const fetchCliente = createAsyncThunk('appUsers/fetchData', async clienteId => {
  const response = await axios.get(`${backendURL}/clienti/${clienteId}`)

  return response
})

// ** EditCliente
export const editCliente = createAsyncThunk('appUsers/addUser', async data => {
  const response = await axios.put(`${backendURL}/clienti/${data.clienteId}`, data.data)

  return response.data
})

// ** Add User
export const addUser = createAsyncThunk('appUsers/addUser', async (data, { dispatch }) => {
  const response = await axios.post(`${backendURL}/clienti`, data)

  dispatch(fetchAllClienti())

  return response.data
})

// ** Delete Cliente
export const deleteCliente = createAsyncThunk('appUsers/deleteUser', async clienteId => {
  const response = await axios.delete(`${backendURL}/clienti/${clienteId}`)

  return response
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllClienti.fulfilled, (state, action) => {
      state.data = action.payload.data.data
      state.total = action.payload.data.totalItems
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
