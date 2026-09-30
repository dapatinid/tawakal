import BranchAdminController from './BranchAdminController'
import UserAdminController from './UserAdminController'
import PartnerAdminController from './PartnerAdminController'

const Admin = {
    BranchAdminController: Object.assign(BranchAdminController, BranchAdminController),
    UserAdminController: Object.assign(UserAdminController, UserAdminController),
    PartnerAdminController: Object.assign(PartnerAdminController, PartnerAdminController),
}

export default Admin