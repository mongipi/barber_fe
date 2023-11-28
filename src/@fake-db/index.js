import mock from './mock'

import './clienti/userList'
import './apps/calendar'
import './auth/jwt'
import './app-bar-search'

mock.onAny().passThrough()
