import React, {useState, useEffect} from 'react'
import {
    CButton,
    CCard,
    CCol,
    CFormGroup,
    CInput,
    CLabel, CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CRow
} from "@coreui/react"
import 'react-medium-image-zoom/dist/styles.css'
import BirthDaySelect from "../BirthDaySelect";

const Zoom = React.lazy(() => import('react-medium-image-zoom'))

const _baseApi = process.env.REACT_APP_BASE_API.replace('/api', '')

function OrderForm({ isOrderModalOpen, order, closeOrderModal, onConfirm, onReject, isFormDisabled }) {

    const [firstname, setFirstname] = useState(order.firstname)
    const [lastname, setLastname] = useState(order.lastname)
    const [middlename, setMiddlename] = useState(order.middlename)
    const [fullname, setFullname] = useState(order.fullname)
    const [phone, setPhone] = useState(order.phone)
    const [phone2, setPhone2] = useState(order.phone2)
    const [phone3, setPhone3] = useState(order.phone3)
    const [email, setEmail] = useState(order.email)
    const [citizenship, setCitizenship] = useState(order.citizenship)
    const [serialNumber, setSerialNumber] = useState(order.serial_number)
    const [inn, setInn] = useState(order.inn)
    const [workplace, setWorkplace] = useState(order.workplace)
    const [address, setAddress] = useState(order.address)
    const [formalAddress, setFormalAddress] = useState(order.formal_address)
    const [city, setCity] = useState(order.city)
    const [source, setSource] = useState(order.source)
    const [birthdate, setBirthdate] = useState(order.birthdate)

    const confirmHandler = () => onConfirm(order.id, {
            ...order,
            firstname,
            lastname,
            middlename,
            fullname,
            phone,
            phone2,
            phone3,
            email,
            citizenship,
            serial_number: serialNumber,
            inn,
            workplace,
            address,
            formal_address: formalAddress,
            city,
            source,
            birthdate
        })

    const rejectHandler = () => onReject(order.id)

    const [year, month, day] = birthdate.split('-')

    console.log('order: ', order)

    return (
        <CModal
            show={isOrderModalOpen}
            onClose={closeOrderModal}
            size="xl"
        >
            <CModalHeader closeButton>Modal title</CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol sm="8">
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="lastname">??????????????</CLabel>
                                    <CInput
                                        id="lastname"
                                        placeholder="?????????????? ??????????????"
                                        value={lastname}
                                        onChange={event => setLastname(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="firstname">??????</CLabel>
                                    <CInput
                                        id="firstname"
                                        placeholder="?????????????? ??????"
                                        value={firstname}
                                        onChange={event => setFirstname(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="middlename">????????????????</CLabel>
                                    <CInput
                                        id="middlename"
                                        placeholder="?????????????? ????????????????"
                                        value={middlename}
                                        onChange={event => setMiddlename(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="fullname">?????????????? ?? ?????? ??????????????????</CLabel>
                                    <CInput
                                        id="fullname"
                                        placeholder="?????????????? ?????????????? ?? ?????? ??????????????????"
                                        value={fullname}
                                        onChange={event => setFullname(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="citizenship">??????????????????????</CLabel>
                                    <CInput
                                        id="citizenship"
                                        placeholder="?????????????? ??????????????????????"
                                        value={citizenship}
                                        onChange={event => setCitizenship(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="inn">??????</CLabel>
                                    <CInput
                                        id="inn"
                                        placeholder="?????????????? ??????"
                                        value={inn}
                                        onChange={event => setInn(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="serial_number">???????????????? ??????????</CLabel>
                                    <CInput
                                        id="serial_number"
                                        placeholder="?????????????? ???????????????? ??????????"
                                        value={serialNumber}
                                        onChange={event => setSerialNumber(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <BirthDaySelect
                                        day={parseInt(day)}
                                        month={parseInt(month)}
                                        year={parseInt(year)} disabled={isFormDisabled}
                                        setBirthDate={setBirthdate}
                                    />
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="address">?????????? ???? ????????????????</CLabel>
                                    <CInput
                                        id="address"
                                        placeholder="?????????????? ?????????? ???? ????????????????"
                                        value={address}
                                        onChange={event => setAddress(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="formal_address">?????????? ???????????????????????? ????????????????????</CLabel>
                                    <CInput
                                        id="formal_address"
                                        placeholder="?????????????? ?????????? ???????????????????????? ????????????????????"
                                        value={formalAddress}
                                        onChange={event => setFormalAddress(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="phone">??????????????</CLabel>
                                    <CInput
                                        id="phone"
                                        placeholder="?????????????? ?????????? ????????????????"
                                        value={phone}
                                        onChange={event => setPhone(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="phone1">?????????????? 2</CLabel>
                                    <CInput
                                        id="phone1"
                                        placeholder="?????????????? ?????????? ????????????????"
                                        value={phone2}
                                        onChange={event => setPhone2(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="phone2">?????????????? 3</CLabel>
                                    <CInput
                                        id="phone2"
                                        placeholder="?????????????? ?????????? ????????????????"
                                        value={phone3}
                                        onChange={event => setPhone3(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="email">Email</CLabel>
                                    <CInput
                                        id="email"
                                        placeholder="?????????????? email"
                                        value={email}
                                        onChange={event => setEmail(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="workplace">?????????? ????????????</CLabel>
                                    <CInput
                                        id="workplace"
                                        placeholder="?????????????? ?????????? ????????????"
                                        value={workplace}
                                        onChange={event => setWorkplace(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="source">????????????????</CLabel>
                                    <CInput
                                        id="source"
                                        placeholder="?????????????? source"
                                        value={source}
                                        onChange={event => setSource(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel htmlFor="city">?????????? ????????????????</CLabel>
                                    <CInput
                                        id="city"
                                        placeholder="?????????????? ?????????? ????????????????"
                                        value={city}
                                        onChange={event => setCity(event.target.value)}
                                        disabled={isFormDisabled}
                                    />
                                </CFormGroup>
                            </CCol>
                        </CRow>
                    </CCol>
                    <CCol sm="4">
                        <React.Suspense fallback={'...loading'}>
                            <CCard>
                                <Zoom>
                                    <img src={_baseApi + order.image_front}
                                         alt={'front of passport'}
                                         loading={"lazy"}
                                         style={{ width: '100%', maxHeight: '200px' , objectFit: 'contain' }}
                                    />
                                </Zoom>
                            </CCard>
                            <CCard>
                                <Zoom>
                                    <img src={_baseApi + order.image_back}
                                         alt={'front of passport'}
                                         loading={"lazy"}
                                         style={{ width: '100%', maxHeight: '200px' , objectFit: 'contain' }}
                                    />
                                </Zoom>
                            </CCard>
                        </React.Suspense>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                { !isFormDisabled &&
                <>
                    <CButton color="success" onClick={confirmHandler}>
                        ?????????????????????? ????????????
                    </CButton>
                    <CButton color="danger" onClick={rejectHandler}>
                        ???????????????? ??????????
                    </CButton>
                    <CButton color="secondary" onClick={closeOrderModal}>
                        ??????????????
                    </CButton>
                </> }
            </CModalFooter>
        </CModal>
    )
}

const areEqual = (prevProps, nextProps) => prevProps.isOrderModalOpen === nextProps.isOrderModalOpen

export default React.memo(OrderForm, areEqual)