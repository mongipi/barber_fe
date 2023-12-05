// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from 'src/store/clienti'
import calendar from 'src/store/apps/calendar'
import servizi from 'src/store/servizi'

export const store = configureStore({
  reducer: {
    user,
    calendar,
    servizi
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
