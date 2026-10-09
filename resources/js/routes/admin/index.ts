import customer from './customer'
import supplier from './supplier'
import cabang from './cabang'
import pengguna from './pengguna'
import mitra from './mitra'

const admin = {
    customer: Object.assign(customer, customer),
    supplier: Object.assign(supplier, supplier),
    cabang: Object.assign(cabang, cabang),
    pengguna: Object.assign(pengguna, pengguna),
    mitra: Object.assign(mitra, mitra),
}

export default admin