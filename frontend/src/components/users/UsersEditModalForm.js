import React, {useState, useEffect, useContext} from 'react'
import {
    CModal,
    CModalBody,
    CModalHeader,
    CModalFooter,
    CButton,
    CCol,
    CRow,
    CFormGroup,
    CInput,
    CLabel,
    CForm
} from '@coreui/react'
import OptimaServiceContext from "../../context/OptimaServiceContext"
import Select from 'react-select'
import { Formik } from "formik"
import MiniSpinner from "../spinners/MiniSpinner"

function UsersEditModalForm({ isEditFormModalOpen, closeEditFormModal, reFetchUsers, selectedUser }) {

    const formValues = {
        firstname: selectedUser.first_name,
        lastname: selectedUser.last_name,
        username: selectedUser.username,
        email: selectedUser.email,
        password: '',
        confirmPassword: ''
    }

    const optimaService = useContext(OptimaServiceContext)

    const [branches, setBranches] = useState([])
    const [fetchBranchError, setFetchBranchError] = useState(null)

    const [selectedBranch, setSelectedBranch] = useState({})
    const [selectedRole, setSelectedRole] = useState(roles[0])

    const [isLoading, setIsLoading] = useState(false)
    const [err, setErr] = useState({username: null, email: null, password: null})

    useEffect(() => {
        const fetchBranches = async () => {
            const res = await optimaService.getBranches()

            const { hasError, data } = res

            if (hasError){
                setFetchBranchError('Произошла ошибка при загрузке дынных')
            } else {
                const br = data.map(d => ({ value: d.id, label: `${d.city}, ${d.address}` }))
                setBranches(br)
            }

            return null
        }

        fetchBranches()
    }, [optimaService])

    useEffect(() => {
        const branch = branches.find(br => br.value === selectedUser.branch)

        if (typeof branch !== 'undefined'){
            setSelectedBranch(branch)
        }
    }, [branches, selectedUser.branch])

    const onSubmit = async values => {
        setIsLoading(true)

        const { hasError, data } = await optimaService.updateUser(
            selectedUser.id,
            values.firstname,
            values.lastname,
            values.username,
            values.email,
            values.password,
            selectedRole.value,
            selectedBranch.value)

        console.log('hasError: ', hasError)
        console.log('data: ', data)

        if (hasError){
            setErr({
                username: (data && data.username && data.username[0]) || null,
                email: (data && data.email && data.email[0]) || null,
                password: (data && data.password && data.password[0]) || null,
            })
        } else {
            reFetchUsers()
            closeEditFormModal()
        }

        setIsLoading(false)
    }

    return (
        <>
            <Formik initialValues={formValues} onSubmit={onSubmit} validate={values => {
                const errors = {}
                !values.firstname && (errors.firstname = 'Обязательное поле')
                !values.lastname && (errors.lastname = 'Обязательное поле')
                !values.username && (errors.username = 'Обязательное поле')

                if (!values.email) {
                    errors.email = 'Обязательное поле'
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email) ) {
                    errors.email = 'Некорректный электронный адрес'
                }

                if ( values.password && (values.password !== values.confirmPassword) ) {
                    errors.confirmPassword = 'Пароли не совпадают'
                }

                return errors
            }}>
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      handleReset,
                  }) => (
                    <CModal
                        show={isEditFormModalOpen}
                        onClose={closeEditFormModal}
                        size="xl"
                    >
                        <CForm onSubmit={handleSubmit}>
                            <CModalHeader closeButton>Создание сотрудника</CModalHeader>
                            <CModalBody>
                                <CRow>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel htmlFor="firstname">Имя</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                <CInput
                                                    id="firstname"
                                                    value={values.firstname}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={(errors.firstname && touched.firstname) ? 'border-error' : ''}
                                                />
                                                { <span className="text-danger">{errors.firstname && touched.firstname && errors.firstname}</span> }
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel htmlFor="lastname">Фамилия</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                <CInput
                                                    id="lastname"
                                                    value={values.lastname}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={errors.lastname && touched.lastname ? 'border-error' : ''}
                                                />
                                                { <span className="text-danger">{errors.lastname && touched.lastname && errors.lastname}</span> }
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel htmlFor="username">Username</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                <CInput
                                                    id="username"
                                                    value={values.username}
                                                    onChange={event => {setErr(e => ({ ...e, username: null })); handleChange(event)}}
                                                    onBlur={handleBlur}
                                                    className={(errors.username && touched.username) || err.username ? 'border-error' : ''}
                                                />
                                                { <span className="text-danger">{(errors.username && touched.username && errors.username) || err.username}</span> }
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel htmlFor="email">Электронная почта</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                <CInput
                                                    id="email"
                                                    value={values.email}
                                                    onChange={event => {setErr(e => ({ ...e, email: null })); handleChange(event)}}
                                                    onBlur={handleBlur}
                                                    className={(errors.email && touched.email) || err.email ? 'border-error' : ''}
                                                />
                                                { <span className="text-danger">{(errors.email && touched.email && errors.email) || err.email}</span> }
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel htmlFor="password">Пароль</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                <CInput
                                                    id="password"
                                                    value={values.password}
                                                    onChange={event => {setErr(e => ({ ...e, password: null })); handleChange(event)}}
                                                    onBlur={handleBlur}
                                                    className={(errors.password && touched.password) || err.password ? 'border-error' : ''}
                                                />
                                                <span>Необязательное поле</span>
                                                { <span className="text-danger">{(errors.password && touched.password && errors.password) || err.password}</span> }
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel htmlFor="confirmPassword">Подтверждение пароля</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                <CInput
                                                    id="confirmPassword"
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={errors.confirmPassword && touched.confirmPassword ? 'border-error' : ''}
                                                />
                                                { <span className="text-danger">{errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}</span> }
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel>Филиал</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                { fetchBranchError ? <span className="text-danger">{fetchBranchError}</span> :
                                                    <Select options={branches} value={selectedBranch} onChange={s => setSelectedBranch(s)}/>
                                                }
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel>Отдел</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                <Select options={roles} value={selectedRole} onChange={s => setSelectedRole(s)} />
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                </CRow>
                            </CModalBody>
                            <CModalFooter className="d-flex justify-content-between">
                                <div>
                                    <CButton color="info" onClick={() => {
                                        setErr({username: null, email: null, password: null})
                                        handleReset()
                                    }}>
                                        Вернуть в исходное положение
                                    </CButton>
                                </div>
                                <div>
                                    { isLoading ? <span className="mr-5"><MiniSpinner /></span> : <CButton color="primary" type="submit" className="mr-4">
                                        Изменить
                                    </CButton> }
                                    <CButton
                                        color="secondary"
                                        onClick={() => {
                                            handleReset()
                                            closeEditFormModal()
                                        }}
                                    >Отмена</CButton>
                                </div>
                            </CModalFooter>
                        </CForm>
                    </CModal>
                )}
            </Formik>
        </>
    )
}

const roles = [
    { value: 1, label: 'Администратор' },
    { value: 2, label: 'Специалист сектора платежных карт и эквайринга' },
    { value: 3, label: 'Оператор колл-центра' },
    { value: 4, label: 'Курьер' }
]

export default UsersEditModalForm