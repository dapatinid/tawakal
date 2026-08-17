import Api from './Api'
import OrderNowController from './OrderNowController'
import ProductController from './ProductController'
import QuestionerController from './QuestionerController'
import DashboardController from './DashboardController'
import TransaksiController from './TransaksiController'
import NotificationController from './NotificationController'
import KategoriController from './KategoriController'
import MerkController from './MerkController'
import ProdukController from './ProdukController'
import PenjualanController from './PenjualanController'
import PembelianController from './PembelianController'
import PenyesuaianStokController from './PenyesuaianStokController'
import POSController from './POSController'
import StokController from './StokController'
import ReturController from './ReturController'
import PembayaranController from './PembayaranController'
import JournalController from './JournalController'
import AsetTetapController from './AsetTetapController'
import ProfitLossController from './ProfitLossController'
import BalanceController from './BalanceController'
import CabangController from './CabangController'
import Admin from './Admin'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    Api: Object.assign(Api, Api),
    OrderNowController: Object.assign(OrderNowController, OrderNowController),
    ProductController: Object.assign(ProductController, ProductController),
    QuestionerController: Object.assign(QuestionerController, QuestionerController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    TransaksiController: Object.assign(TransaksiController, TransaksiController),
    NotificationController: Object.assign(NotificationController, NotificationController),
    KategoriController: Object.assign(KategoriController, KategoriController),
    MerkController: Object.assign(MerkController, MerkController),
    ProdukController: Object.assign(ProdukController, ProdukController),
    PenjualanController: Object.assign(PenjualanController, PenjualanController),
    PembelianController: Object.assign(PembelianController, PembelianController),
    PenyesuaianStokController: Object.assign(PenyesuaianStokController, PenyesuaianStokController),
    POSController: Object.assign(POSController, POSController),
    StokController: Object.assign(StokController, StokController),
    ReturController: Object.assign(ReturController, ReturController),
    PembayaranController: Object.assign(PembayaranController, PembayaranController),
    JournalController: Object.assign(JournalController, JournalController),
    AsetTetapController: Object.assign(AsetTetapController, AsetTetapController),
    ProfitLossController: Object.assign(ProfitLossController, ProfitLossController),
    BalanceController: Object.assign(BalanceController, BalanceController),
    CabangController: Object.assign(CabangController, CabangController),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers