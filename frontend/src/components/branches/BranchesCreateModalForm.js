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
    CSelect,
    CForm
} from '@coreui/react'
import OptimaServiceContext from "../../context/OptimaServiceContext"
import { Formik } from "formik"
import MiniSpinner from "../spinners/MiniSpinner"

function BranchesCreateModalForm({ isFormModalOpen, closeFormModal, openFormModal, reFetchBranches }) {

    const optimaService = useContext(OptimaServiceContext)

    const [isLoading, setIsLoading] = useState(false)
    const [createError, setCreateError] = useState(null)

    const onSubmit = async values => {
        setCreateError(null)
        setIsLoading(true)

        const { hasError, data } = await optimaService.createBranch( values.city, values.address )

        if (hasError){
            setCreateError((data && data.detail) || 'Что-то пошло не так!')
        } else {
            reFetchBranches()
            closeFormModal()
        }

        setIsLoading(false)
    }

    return (
        <>
            <CModal
                show={isFormModalOpen}
                onClose={closeFormModal}
                size="sm"
                centered
            >
                <Formik initialValues={formValues} onSubmit={onSubmit} validate={values => {
                    const errors = {}
                    !values.city && (errors.city = 'Обязательное поле')
                    !values.address && (errors.address = 'Обязательное поле')

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
                      }) => (
                        <CForm onSubmit={handleSubmit}>
                            <CModalHeader closeButton>Добавление филиала</CModalHeader>
                            <CModalBody>
                                <CRow>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel htmlFor="city">Город</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                <CInput
                                                    id="city"
                                                    value={values.city}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={errors.city && touched.city ? 'border-error' : ''}
                                                />
                                                { <span className="text-danger">{errors.city && touched.city && errors.city}</span> }
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <CFormGroup row>
                                            <CCol xs="3">
                                                <CLabel htmlFor="address">Адрес</CLabel>
                                            </CCol>
                                            <CCol xs="9">
                                                <CInput
                                                    id="address"
                                                    value={values.address}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={errors.address && touched.address ? 'border-error' : ''}
                                                />
                                                { <span className="text-danger">{errors.address && touched.address && errors.address}</span> }
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                </CRow>
                                { createError && <CRow>
                                    <CCol>
                                        <span className="text-danger">{ createError }</span>
                                    </CCol>
                                </CRow> }
                            </CModalBody>
                            <CModalFooter>
                                { isLoading ?
                                    <div className="mr-5"><MiniSpinner/></div> :
                                    <CButton color="primary" type="submit">
                                        Добавить
                                    </CButton> }
                                <CButton
                                    color="secondary"
                                    onClick={closeFormModal}
                                >Cancel</CButton>
                            </CModalFooter>
                        </CForm>
                    )}
                </Formik>
            </CModal>
        </>
    )
}

const formValues = { city: '', address: '' }

export default BranchesCreateModalForm