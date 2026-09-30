import cabang from './cabang'
import pengguna from './pengguna'
import mitra from './mitra'

const admin = {
    cabang: Object.assign(cabang, cabang),
    pengguna: Object.assign(pengguna, pengguna),
    mitra: Object.assign(mitra, mitra),
}

export default admin