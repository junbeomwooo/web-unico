import React, { memo, useState, useCallback, useEffect, useRef} from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkDuplicated } from '../slices/MemberSlice';
import { postItem } from '../slices/MemberSlice';
import regexHelper from '../helper/RegexHelper';

const Container = styled.form`
padding-top: 100px;
display: flex;
flex-direction: column;
align-items: center;
position: relative;

.Box {
    margin-top: 150px;
    width: 450px;
    height: auto;
    
    h1 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 30px;
    }

    h2 {
        margin-top: 30px;
        font-size: 15px;
        font-weight: 500;
    }

    h3 {
        color: red;
        font-size: 12px;
        position: absolute;
        margin-top: 5px;
        font-weight: 500;
    }

    .availabilty {
        position: absolute;
        margin-top: 5px;
        font-size: 12px;
        border: 1px solid black;
        color: black;
        padding: 4px 6px;
        background-color: none;
        transition: background-color 0.4s ease;
        margin-left: 355px;

        &:hover {
            background-color: black;
            color: white;
            cursor: pointer;
        }
    }

    input {
        width: 100%;
        background: none;
        border: 1px solid black;
        height: 40px;
        padding: 0 0 0 10px;
    }

   .name {
        display: flex;
        justify-content: space-between;
        width: 462px;
        margin-top: 0px;
        input {
            width: 46%;
        }
   }

   .birthday {
        display: flex;
        justify-content: space-between;
        width: 462px;
        
        div {
            width: 31%;
            height: 42px;
            border: 1px solid black;
            box-sizing: border-box;
            position: relative;

            span {
                font-size: 15px;
                padding: 10px 0 0 10px;
                display: block;
            }

            .dropDownBtn {
                position: absolute;
                top: 0px;
                right: 13px;
            }
            
            &:hover {
                cursor: pointer;
            }

            div {
                position: relative;
                width: 143.22px;
                height: 250px;
                z-index: 100;
                padding: 0;
                margin-top: 10px;
                border: 1px solid black;
                box-sizing: border-box;
                background-color: #F4F3F2;
                overflow: auto;
                margin-left: -1px;

                ul {
                    margin: 0;
                    padding: 0;
                    li {
                        padding: 8px 0px;
                        padding-left: 10px;
                        font-size: 15px;
                    }
                }
            }
        } 
   }

   .gender {
        width: 462px;
        height: 42px;
        border: 1px solid black;
        background: none;
        box-sizing: border-box;
        position: relative;

        span {
            font-size: 15px;
            padding: 10px 0 0 10px;
            display: block;
        }

        .dropDownBtn {
            position: absolute;
            top: 0px;
            right: 13px;
        }

        &:hover {
            cursor: pointer;
        }

        div {
            position: relative;
            width: 462px;
            height: 106px;
            z-index: 100;
            padding: 0;
            margin-top: 10px;
            border: 1px solid black;
            box-sizing: border-box;
            background-color: #F4F3F2;
            margin-left: -1px;

            ul {
                margin: 0;
                padding: 0;

                li {
                    padding: 8px 0px;
                    padding-left: 10px;
                    font-size: 15px;
                }
            }
        }
   }

   .address {
        margin-top: 0px;
        
        input {
            margin-bottom: 13px ;
        }

        .country {
        width: 462px;
        height: 42px;
        border: 1px solid black;
        background: none;
        box-sizing: border-box;
        position: relative;

        span {
            font-size: 15px;
            padding: 10px 0 0 10px;
            display: block;
        }

        .dropDownBtn {
            position: absolute;
            top: 0px;
            right: 13px;
        }

        &:hover {
            cursor: pointer;
        }

        div {
            position: relative;
            width: 462px;
            height: 250px;
            z-index: 100;
            padding: 0;
            margin-top: 10px;
            border: 1px solid black;
            box-sizing: border-box;
            background-color: #F4F3F2;
            margin-left: -1px;
            overflow: auto;

            ul {
                margin: 0;
                padding: 0;

                li {
                    padding: 8px 0px;
                    padding-left: 10px;
                    font-size: 15px;
                }
            }
        }
   }
   }

   .submit {
        display: flex;
        justify-content: space-between;
        width: 462px;
        margin-top: 20px;
        margin-bottom: 100px;

        button {
            width: 46%;
            box-sizing: border-box;
            height: 40px;
            background-color: black;
            color: white;
            border: none;

            &:hover {
                cursor: pointer;
            }

            &:first-child {
                background-color: white;
                border: 1px solid black;
                color: black;
            }
        }
   }


}

`
const CreateAcc = memo(() => {

    // 리덕스 초기값
    const dispatch = useDispatch();
    const { data, loading, error} = useSelector((state) => state.MemberSlice);

    // 강제이동 함수 선언
    const navigate = useNavigate();
    // 참조값 관리
    const account = useRef()

    // 계정 상태값 관리
    const [accountInputText, setAccoutInputText] = useState('');

    // 비밀번호 상태값 관리
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [matchPassword, setMatchPassword] = useState(false);

    // 드롭다운 생년월일 상태값 관리
    const [monthDropdown, setMonthDropdown] = useState(false);
    const [dayDropdown, setDayDropdown] = useState(false);
    const [yearDropdown, setYearDropdown] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('Month');
    const [selectedDay, setSelectedDay] = useState('Day');
    const [selectedYear, setSelectedYear] = useState('Year');

    //드롭다운 성별 상태값관리
    const [genderDropDown, setGenderDropDown] = useState(false);
    const [selectedGender, setSelectedGender] = useState("Gender");

    // 드롭다운 국가 상태값 관리
    const [countryDropdown, setCountryDropdown] = useState(false);
    const [selectCountry, setSelectedCountry] = useState("Country");

    // 드롭다운 생년월일 이벤트 관리
    const toggleMonthDropdown = useCallback((e) => {
        setMonthDropdown(!monthDropdown)
        setGenderDropDown(false);
        setCountryDropdown(false);
        setDayDropdown(false);
        setYearDropdown(false);
    });
    const toggleDayDropdown = useCallback((e) => {
        setDayDropdown(!dayDropdown)
        setGenderDropDown(false);
        setCountryDropdown(false);
        setMonthDropdown(false);
        setYearDropdown(false);
    });
    const toggleYearDropdown = useCallback((e) => {
        setYearDropdown(!yearDropdown)
        setGenderDropDown(false);
        setCountryDropdown(false);
        setMonthDropdown(false);
        setDayDropdown(false);
    });

    const onClickMonth = useCallback((value) => {
        setSelectedMonth(value);
        setMonthDropdown(false);
    });

    const onClickDay = useCallback((value) => {
        setSelectedDay(value);
        setDayDropdown(false);
    });

    const onClickYear = useCallback((value) => {
        setSelectedYear(value);
        setDayDropdown(false);
    })

    // 드롭다운 성별 이벤트 관리
    const toggleGenderDropdown = useCallback((e) => {
        setGenderDropDown(!genderDropDown);
        setMonthDropdown(false);
        setDayDropdown(false);
        setYearDropdown(false);
        setCountryDropdown(false);
    })
    
    const onClickGender = useCallback((value) => {
        setSelectedGender(value);
        setGenderDropDown(false);
    })

    // 드롭다운 국가 이벤트 관리
    const toggleCountryDropdown = useCallback((e) => {
        setCountryDropdown(!countryDropdown);
        setGenderDropDown(false);
        setMonthDropdown(false);
        setDayDropdown(false);
        setYearDropdown(false);
    })

    const onClickCountry = useCallback((value) => {
        setSelectedCountry(value);
        setCountryDropdown(false);
    })

    // 이벤트 관리
    const onChangePassword = useCallback((e) => {
        setPassword(e.currentTarget.value);
         // 현재 입력값과 confirm값이 같으며 confirm값이 빈 문자열이 아닌 경우 true 반환.
        if(e.currentTarget.value ===  confirmPassword && confirmPassword !== ''){
            setMatchPassword(true);
        } else {
            setMatchPassword(false);
        }
    })

    const onChangeCofirmPassword = useCallback((e) => {
        setConfirmPassword(e.currentTarget.value);
        // 현재 입력값과 패스워드값이 같으며 패스워드값이 빈 문자열이 아닌 경우 true 반환.
        if(e.currentTarget.value === password && password !== ''){
            setMatchPassword(true);
        } else {
            setMatchPassword(false);
        }
    })

    const onClickAccount = useCallback(async (e) => {
        e.preventDefault();
        
        const processedAccount = account.current.value.trim().toLowerCase();
        
        // 인풋 값이 있는지 검사
        if (!processedAccount) {
            setAccoutInputText("Please enter account name.");
            return; 
        }

        // 영문 또는 영문과 숫자로 이루어져 있는지 검사
        const alphanumericRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
        if (!alphanumericRegex.test(processedAccount)) {
            setAccoutInputText("Account name should only contain letters and numbers.");
            return;
        }

        // 글자 수 검사
        if (processedAccount.length < 6 || processedAccount.length > 20) {
            setAccoutInputText("Account name should be between 6 and 20 characters.");
            return;
        }

        // 데이터 통신
        const result = await dispatch(checkDuplicated({
            account: processedAccount
        }));

        // 데이터 통신 완료된 후 처리
        if (checkDuplicated.fulfilled.match(result)) {
            if(result.payload.item > 0) {
                setAccoutInputText('Account is duplicated.');
            } else {
                setAccoutInputText('Account is available.');
            }
        }
    })

    const onClickCancle = useCallback((e) => {
        e.preventDefault();
        navigate("/member");
    })

    const onSubmitMember = useCallback((e) => {
        e.preventDefault();

        const current = e.currentTarget;

        // 비밀번호 값이 일치하게 작성되었는지 검사
        if( current.userpw.value !== current.confirmuserpw.value) {
            alert("Passwords do not match. Please make sure both passwords are the same.");
            return;
        }

        // 이름 칸에 입력이 되어있는지 안되어있는지 확인 후 결합
        if( !current.firstname.value || !current.lastname.value) {
            alert("Please enter First name and Last name.");
            return;
        }
        const name = `${current.firstname.value.trim()} ${current.lastname.value.trim()}`;

        // 성별 값 변수에 할당 후 성별 선택이 안되어 있을 경우 알림 창 구현
        let gender = '';

        if (selectedGender !== 'Gender' && selectedGender === 'Male') {
            gender = 'M'
        } else if (selectedGender !== 'Gender' && selectedGender === 'Female'){
            gender = 'F'
        } else if (selectedGender !== 'Gender' && selectedGender === 'Other'){
            gender = 'O'
        }

        // 생일 값 할당 , 10보다 작을 경우 앞쪽에 0을 붙임
        let monthValue = null;
        let dayValue = null;
        let yearValue = null;
        let birthdate = null;

        if (selectedMonth && parseInt(selectedMonth) < 10) {
            monthValue = `0${selectedMonth}`;
        } else if(selectedMonth !== 'Month'){
            monthValue = selectedMonth;
        }
        if (selectedDay && parseInt(selectedDay) < 10) {
            dayValue = `0${selectedDay}`;
        } else if(selectedDay !== 'Day'){
            dayValue = selectedDay;
        }
        if (selectedYear !== 'Year') {
            yearValue = selectedYear;
        }

        if (monthValue && dayValue && yearValue) {
            birthdate = `${yearValue}${monthValue}${dayValue}`;
        }

        // 국가 값 할당, 선택이 안되었을 경우 country 값은 null
        let country = null;
        if (selectCountry !== 'Country'){
            country = selectCountry;
        }
        // 공백지우기, 소문자 변환 등 처리과정
        
        const processedAccount = current.account.value.trim().toLowerCase();
        const processedUserpw = current.userpw.value.toString().trim();
        const processedName = name.trim().toUpperCase();
        const processedGender = gender;
        const processedBirthday = birthdate;
        const processedPhone = current.phonenumber.value.toString().trim();
        const processedAddress = current.address.value.toLowerCase().trim();
        const processedCity = current.city.value.trim().toLowerCase();
        const processedZipcode = current.zipcode.value.trim();
        const processedProvince = current.province.value.trim().toLowerCase();
        const processedCountry = country;

        // // 유효성 검사
        try {
            regexHelper.value(processedAccount, "Please enter account name.");
            regexHelper.engNum(processedAccount, "Please enter account name in English and Number.");
            regexHelper.minLength(processedAccount, 6, "Please enter an English account name of at least 6 characters.");
            regexHelper.maxLength(processedAccount, 20, "Please enter an English account name of up to 20 characters.");
            regexHelper.value(processedUserpw, "Please enter password.");
            regexHelper.minLength(processedUserpw, 12 , "Please enter password of at least 12 characters.");
            regexHelper.engNumSpe(processedUserpw, "Passwords must include letters, numbers, and special characters.");
            regexHelper.value(processedName, "Please enter name.");
            regexHelper.eng(processedName, "Please enter name in English.");
            regexHelper.value(processedGender, "Please select gender.");
            regexHelper.value(processedBirthday, "Please enter your birthdate.");
            regexHelper.value(processedPhone, "Please enter your phone number.");
            regexHelper.value(processedAddress, "Please enter your address.");
            regexHelper.value(processedCity, "Please enter your city.");
            regexHelper.value(processedZipcode, "Please enter your zipcode.");
            regexHelper.value(processedProvince, "Please enter your province.");
            regexHelper.value(processedCountry, "Please select your country.")
        } catch (error) {
            console.error(error);
            return;
        }
    
        // 리덕스를 통한 데이터 요청
        dispatch(postItem({
            account : processedAccount,
            userpw: processedUserpw,
            name: processedName,
            gender: processedGender,
            birthdate: processedBirthday,
            phonenumber: processedPhone,
            address: processedAddress,
            city: processedCity,
            zipcode: processedZipcode,
            province: processedProvince,
            country: processedCountry
        })).then(({ payload, error}) => {
            if(error) {
                window.alert(payload.data.rtmsg);
                console.log(payload);
                return;
            }

            alert('Account successfully created.');
            navigate("/member");
        })
    })

    // 연 기준 범위 설정
    const now = new Date();
    const years = [];
    for(let i = now.getFullYear() - 15; i >= now.getFullYear() - 100; i-- ){
        years.push(i.toString());
    }

    // 달 기준 범위 설정
    const month = [];
    for(let i = 1; i <= 12; i++){
        month.push(i.toString());
    }

    // 일 기준 범위 설정
    const date= [];
    for(let i= 1; i <= 31; i++){
        date.push(i.toString());
    }

    // 국가 목록 배열
    const countries = [
        'Afghanistan',
        'Albania',
        'Algeria',
        'American Samoa',
        'Andorra',
        'Angola',
        'Argentina',
        'Armenia',
        'Australia',
        'Austria',
        'Azerbaijan',
        'Bahamas',
        'Bahrain',
        'Bangladesh',
        'Barbados',
        'Belarus',
        'Belgium',
        'Benin',
        'Bermuda',
        'Bhutan',
        'Bolivia',
        'Bosnia and Herzegovina',
        'Botswana',
        'Brazil',
        'Brunei',
        'Bulgaria',
        'Burkina Faso',
        'Burundi',
        'Cambodia',
        'Cameroon',
        'Canada',
        'Cape Verde',
        'Cayman Islands',
        'Central African Republic',
        'Chad',
        'Chile',
        'Chinese Mainland',
        'Colombia',
        'Comoros',
        'Congo The Democratic Republic Of The',
        'Cook Islands',
        'Costa Rica',
        'Croatia',
        'Cuba',
        'Cyprus',
        'Czech Republic',
        'Denmark',
        'Djibouti',
        'Dominican Republic',
        'Ecuador',
        'Egypt',
        'El Salvador',
        'Equatorial Guinea',
        'Eritrea',
        'Estonia',
        'Ethiopia',
        'Falkland Islands',
        'Faroe Islands',
        'Fiji Islands',
        'Finland',
        'France',
        'French Guiana',
        'French Polynesia',
        'Gabon',
        'Gambia',
        'Georgia',
        'Germany',
        'Ghana',
        'Gibraltar',
        'Greece',
        'Greenland',
        'Guadeloupe',
        'Guam',
        'Guatemala',
        'Guinea',
        'Guinea-Bissau',
        'Haiti',
        'Honduras',
        'Hong Kong SAR',
        'Hungary',
        'Iceland',
        'India',
        'Indonesia',
        'Iran',
        'Iraq',
        'Ireland',
        'Isle of Man',
        'Israel',
        'Italy',
        'Jamaica',
        'Japan',
        'Jordan',
        'Kazakhstan',
        'Kenya',
        'Kiribati',
        'Kuwait',
        'Kyrgyzstan',
        'Laos',
        'Latvia',
        'Lebanon',
        'Lesotho',
        'Liberia',
        'Libya',
        'Liechtenstein',
        'Lithuania',
        'Luxembourg',
        'Macau SAR of China',
        'Macedonia',
        'Madagascar',
        'Malawi',
        'Malaysia',
        'Maldives',
        'Mali',
        'Malta',
        'Marshall Islands',
        'Martinique',
        'Mauritania',
        'Mauritius',
        'Mayotte',
        'Mexico',
        'Micronesia',
        'Moldova',
        'Monaco',
        'Mongolia',
        'Morocco',
        'Mozambique',
        'Myanmar',
        'Namibia',
        'Nauru',
        'Nepal',
        'Netherlands',
        'New Caledonia',
        'New Zealand',
        'Nicaragua',
        'Niger',
        'Nigeria',
        'Niue',
        'Northern Mariana Islands',
        'Norway',
        'Oman',
        'Pakistan',
        'Palau',
        'Panama',
        'Papua new Guinea',
        'Paraguay',
        'Peru',
        'Philippines',
        'Poland',
        'Portugal',
        'Puerto Rico',
        'Qatar',
        'Reunion',
        'Romania',
        'Russia',
        'Rwanda',
        'Samoa',
        'Sao Tome and Principe',
        'Saudi Arabia',
        'Senegal',
        'Serbia',
        'Seychelles',
        'Sierra Leone',
        'Singapore',
        'Slovakia',
        'Slovenia',
        'Solomon Islands',
        'Somalia',
        'South Africa',
        'South Korea',
        'Spain',
        'Sri Lanka',
        'Sudan',
        'Suriname',
        'Swaziland',
        'Sweden',
        'Switzerland',
        'Syria',
        'Taiwan area, China',
        'Tajikistan',
        'Tanzania',
        'Thailand',
        'Togo',
        'Tonga',
        'Trinidad And Tobago',
        'Tunisia',
        'Turkey',
        'Tuvalu',
        'Uganda',
        'Ukraine',
        'United Arab Emirates',
        'United Kingdom',
        'United States',
        'Uruguay',
        'Uzbekistan',
        'Vanuatu',
        'Venezuela',
        'Vietnam',
        'Virgin Islands (British)',
        'Virgin Islands (US)',
        'Yemen',
        'Zambia',
        'Zimbabwe'
      ];

    // 페이지 렌더링시 페이지 맨 위 부분으로 설정
    useEffect(() => {
        window.scrollTo(0,0)
    },[])

    return (
        <Container onSubmit={onSubmitMember}>
            <div className='Box'>
                <h1>Create Account</h1>
                <h2>Account</h2>
                <input type='text' ref={account} name='account'></input>

                {/* 사용가능한 계정이름일 경우에만 초록색으로 표기 */}
                <h3 style={{ color: accountInputText === 'Account is available.' ? 'green' : 'red'}}>{accountInputText}</h3>

                <button className='availabilty' onClick={onClickAccount}>Check Availability</button>
                <h2>Password</h2>
                <input type='password' name='userpw' onChange={onChangePassword}/>
                <h2>Confirm Password</h2>
                <input type='password' name='confirmuserpw' onChange={onChangeCofirmPassword}/>
                {password !== '' && confirmPassword !== '' && matchPassword === false && (
                    <h3>Passwords are not matching.</h3>
                )}
                <h2>Name</h2>
                <div className="name">
                    <input type='text' className="firstName" name='firstname' placeholder="First Name"/>
                    <input type='text' className="lastName" name='lastname' placeholder="Last Name"/>
                </div>
                <h2>Date of Birth</h2>
                <div className='birthday'>
                    <div onClick={toggleMonthDropdown}>
                        <span>{selectedMonth}</span>
                        <span className='dropDownBtn'>&darr;</span>
                            {monthDropdown && (
                                <div>
                                    <ul>
                                    {month.map((v,i) => {
                                        return(
                                            <li key={i} name='month' value={v} onClick={() => onClickMonth(v)}>{v}</li>
                                        )
                                    })}
                                    </ul>
                                </div>
                            )}
                    </div>
                    <div onClick={toggleDayDropdown}>
                        <span>{selectedDay}</span>
                        <span className='dropDownBtn'>&darr;</span>
                            {dayDropdown && (
                                <div>
                                    <ul>
                                    {date.map((v,i) => {
                                        return(
                                            <li key={i} value={v} onClick={() => onClickDay(v)}>{v}</li>
                                        )
                                    })}
                                    </ul>
                                </div>
                            )}
                    </div>
                    <div onClick={toggleYearDropdown}>
                        <span>{selectedYear}</span>
                        <span className='dropDownBtn'>&darr;</span>
                            {yearDropdown && (
                                <div>
                                    <ul>
                                    {years.map((v,i) => {
                                        return(
                                            <li key={i} value={v} onClick={() => onClickYear(v)}>{v}</li>
                                        )
                                    })}
                                    </ul>
                                </div>
                            )}
                    </div>
                </div>
                <h2>Gender</h2>
                <div className='gender' onClick={toggleGenderDropdown}>
                    <span>{selectedGender}</span>
                    <span className='dropDownBtn'>&darr;</span>
                    {genderDropDown && (
                        <div>
                            <ul>
                                <li value="M" onClick={() => onClickGender("Male")}>Male</li>
                                <li value="F" onClick={() => onClickGender("Female")}>Female</li>
                                <li value="O" onClick={() => onClickGender("Other")}>Other</li>
                            </ul>
                        </div>
                    )}
                </div>
                <h2>Phone Number</h2>
                <input type='tel' name='phonenumber'/>
                <h2>Address</h2>
                <div className='address'>
                    <input type='text' name='address' placeholder="Address"/>
                    <input type='text' name='city' placeholder="City"/>
                    <input type='number' name='zipcode' placeholder="ZIP CODE"/> 
                    <input type='text' name='province' placeholder="State/Province/Region"/>
                    <div className='country' onClick={toggleCountryDropdown}>
                    <span>{selectCountry}</span>
                    <span className='dropDownBtn'>&darr;</span>
                    {countryDropdown && (
                        <div>
                            <ul>
                                {countries.map((v,i) => {
                                    return(
                                        <li key={i} value={v} onClick={() => onClickCountry(v)}>{v}</li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
                </div>
                <div className='submit'>
                    <button onClick={onClickCancle}>Cancel</button>
                    <button type='submit'>Submit</button>
                </div>
            </div>
        </Container>
    );
});

export default CreateAcc;