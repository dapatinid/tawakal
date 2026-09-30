import AuthApiController from './AuthApiController'
import SyncApiController from './SyncApiController'

const Api = {
    AuthApiController: Object.assign(AuthApiController, AuthApiController),
    SyncApiController: Object.assign(SyncApiController, SyncApiController),
}

export default Api