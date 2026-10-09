import CustomerController from './CustomerController'
import SupplierController from './SupplierController'
import BranchAdminController from './BranchAdminController'
import UserAdminController from './UserAdminController'
import PartnerAdminController from './PartnerAdminController'

const Admin = {
    CustomerController: Object.assign(CustomerController, CustomerController),
    SupplierController: Object.assign(SupplierController, SupplierController),
    BranchAdminController: Object.assign(BranchAdminController, BranchAdminController),
    UserAdminController: Object.assign(UserAdminController, UserAdminController),
    PartnerAdminController: Object.assign(PartnerAdminController, PartnerAdminController),
}

export default Admin