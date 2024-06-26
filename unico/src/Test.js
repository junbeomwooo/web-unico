import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getList, getItem, checkDuplicated, postItem, putItem, deleteItem, loginAccount, logoutAccount, loginCheck } from './slices/MemberSlice';
import Cookies from 'js-cookie';

const Test = memo(() => {
    const dispatch = useDispatch();
    const { data, pagenation, loading, error  } = useSelector((state) => state.MemberSlice);

    useEffect(() => {

        // dispatch(logoutAccount()).then(() => {
        //     dispatch(loginCheck());
        // console.log(Cookies.get('session_id'));
        // });

        // dispatch(loginAccount({account: 'ilcnmilcn', userpw: 'wnsqjadl1309!'})).then(() => {
        //     dispatch(loginCheck());
        //     console.log(Cookies.get('session_id'));
        // });

        // dispatch(loginCheck()).then(() => {
        //     console.log(Cookies.get('session_id'));
        // });

        // dispatch(getList());

        // dispatch(getItem({userno: 132}));

        // dispatch(checkDuplicated({ query: 'hi'}))

        // dispatch(postItem({
        //     account: 'jundsk1123',
        //     userpw: 'asdjklgl2wqrl212312',
        //     name: 'junbeom',
        //     gender: 'M',
        //     birthdate: 19971218,
        //     phonenumber: '01090304868',
        //     address: 'nowhere',
        //     city: 'nowhere',
        //     province: 'nowhere',
        //     zipcode: 121412
        // }));

        // dispatch(putItem({
        //     userno: 132,
        //     account: 'changejunbeom123',
        //     userpw: 'asdjklgl2wqrl212312',
        //     name: 'junbeom',
        //     gender: 'M',
        //     birthdate: 19971218,
        //     phonenumber: '01090304868',
        //     address: 'nowhere',
        //     city: 'nowhere',
        //     province: 'nowhere',
        //     zipcode: 121412,
        //     reg_date: null,
        //     is_out: 'N',
        //     is_admin: 'N'
        // }));

        // dispatch(deleteItem({userno: 132}));

    }, [dispatch]);
    return (
        loading ? "loading..." : (
            error ? JSON.stringify(error) : (
                <>
                    <hr/>
                    {JSON.stringify(data)}
                </>
            )
        )
    );
});

export default Test;