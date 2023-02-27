import React, {useState, useContext} from 'react'
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
import { Formik } from "formik"
import MiniSpinner from "../spinners/MiniSpinner"

function BranchesEditModalForm({ isFormModalOpen, closeFormModal, openFormModal, reFetchBranches, selectedBranch }) {

    const formValues = { city: selectedBranch.city, address: selectedBranch.address }

    const optimaService = useContext(OptimaServiceContext)

    const [isLoading, setIsLoading] = useState(false)
    const [editError, setEditError] = useState(null)

    const onSubmit = async values => {
        setEditError(null)
        setIsLoading(true)

        const { hasError, data } = await optimaService.updateBranch( selectedBranch.id, values.city, values.address )

        if (hasError){
            setEditError((data && data.detail) || 'Что-то пошло не так!')
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
                            <CModalHeader closeButton>Изменение филиала</CModalHeader>
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
                                { editError && <CRow>
                                    <CCol>
                                        <span className="text-danger">{ editError }</span>
                                    </CCol>
                                </CRow> }
                            </CModalBody>
                            <CModalFooter>
                                { isLoading ?
                                    <div className="mr-5"><MiniSpinner/></div> :
                                    <CButton color="primary" type="submit">
                                        Изменить
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

export default BranchesEditModalForm