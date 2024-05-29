import React, { memo } from 'react';
import { Route, Routes } from 'react-router-dom';

import { styled } from 'styled-components';

// 회원 전용 컴포넌트
import Header from './components/Header';
import Footer from './components/Footer';
// 회원 전용
import MainPage from './Pages/MainPage';
import Sunglasses from './Pages/Sunglasses';
import Glasses from './Pages/Glasses';
import Login from './Pages/Login';
import ProductView from './Pages/ProductView';
import CreateAcc from './Pages/CreateAcc';
import AccountSetting from './Pages/AccountSetting';
import InfoEdit from './Pages/InfoEdit';
import CheckPassword from './Pages/CheckPassword';
import AddressSetting from './Pages/AddressSetting';
import AddressEdit from './Pages/AddressEdit';
import PasswordSetting from './Pages/PasswordSetting';
import Cart from './Pages/Cart';
import Shipping from './Pages/Shipping';
import Payment from './Pages/Payment';
import ConfirmPayment from './Pages/ConfirmPayment';
import TrackOrder from './Pages/TrackOrder';
import ViewAll from './Pages/ViewAll';
import ViewOrder from './Pages/ViewOrder';
import NonTrackOrder from './Pages/NonTrackOrder';
import TrackOrderDetail from './Pages/TrackOrderDetail';
import Contact from './Pages/Contact';
import FAQ from './Pages/FAQ';

// 관리자 전용
import AdminNavigation from './components/admin/adminNavigation'
import Admin from './Pages/admin/Admin';
import AdminMember from './Pages/admin/AdminMember';
import MemberView from './Pages/admin/MemberView';
import MemberStatistics from './Pages/admin/MemberStatistics';
import ProductManagement from './Pages/admin/ProductManagement';
import EditProduct from './Pages/admin/EditProduct';
import AddProduct from './Pages/admin/AddProduct';
import OrderManagemet from './Pages/admin/OrderManagemet';
import OrderView from './Pages/admin/OrderView';



const Box = styled.div `
    display: ${(props) => (props.isadminpage === 'true' ? 'flex' : 'block')};
    background-color: ${(props) => (props.isadminpage === 'true' ? 'white' : '#F4F3F2')};

`

const App = memo(() => {

    const isAdminPage = window.location.pathname.startsWith('/admin'); // 관리자 페이지 여부 확인
       
    return (
        <Box isadminpage = {isAdminPage.toString()}>
            {isAdminPage ? (<AdminNavigation />) :(<Header />)}
                <Routes>
                    {/* 일반 페이지 */}
                    <Route path="/" exact={true} element={<MainPage />} />
                    <Route path="/product/sunglasses" element={<Sunglasses />} />
                    <Route path="/product/glasses" element={<Glasses />} />
                    <Route path="/member" element={<Login />} />
                    <Route path="/member/account_register" element={<CreateAcc />}/>
                    <Route path='/product/:prodno' element={<ProductView />} />
                    <Route path='/member/account_setting' element={<AccountSetting />} />
                    <Route path='/member/editInfo' element={<InfoEdit />} />
                    <Route path='/member/check_password' element={<CheckPassword />} />
                    <Route path='/member/address_setting' element={<AddressSetting />} />
                    <Route path='/member/editAddress' element={<AddressEdit />} />
                    <Route path='/member/password_setting' element={<PasswordSetting />} />
                    <Route path='/member/cart' element={<Cart />} />
                    <Route path='/checkout_shipping' element={<Shipping />} />
                    <Route path='/checkout_payment' element={<Payment />} />
                    <Route path='/confirm_payment' element={<ConfirmPayment /> } />
                    <Route path='/customer_service/track_order' element={<TrackOrder />} />
                    <Route path='/member_view_all' element={<ViewAll />} />
                    <Route path='/member_view_all/:orderno' element={<ViewOrder />} />
                    <Route path='/customer_service/nonTrack_order' element={<NonTrackOrder />} />
                    <Route path='/customer_service/track_orderDetail/:orderno' element={<TrackOrderDetail />} />
                    <Route path='/customer_service/contact' element={<Contact />} />
                    <Route path='/customer_service/faq' element={<FAQ />} />
                    
                    {/* 관리자 페이지 */}
                    <Route path='/admin' element={<Admin/>} />
                    <Route path='/admin/member' element={<AdminMember />} />
                    <Route path='/admin/member/:userno' element={<MemberView />} />
                    <Route path='/admin/member_statistics' element={<MemberStatistics />} />
                    <Route path='/admin/product_management' element={<ProductManagement />} />
                    <Route path='/admin/product_management/:prodno' element={<EditProduct />} />
                    <Route path='/admin/product_register' element={<AddProduct />} />
                    <Route path='/admin/order_management' element={<OrderManagemet />} />
                    <Route path='/admin/order_management/:orderno' element={<OrderView />} />

                </Routes>
                {isAdminPage ? null :(<Footer />)}
        </Box>
    );
});

export default App;