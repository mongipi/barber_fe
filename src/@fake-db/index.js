import mock from './mock'

import './auth/jwt'
import './apps/userList'

mock.onAny().passThrough()
