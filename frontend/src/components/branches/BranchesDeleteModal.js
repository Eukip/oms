import React, { useCallback, useContext, useState } from 'react'
import {CButton, CModal, CModalBody, CModalFooter, CRow, CCol} from "@coreui/react"
import OptimaServiceContext from "../../context/OptimaServiceContext"

function BranchesDeleteModal({ isDeleteConfirmModalOpen, closeDeleteConfirmModal, selectedBranch, reFetchBranches }) {

    const optimaService = useContext(OptimaServiceContext)

    const [deleteError, setDeleteError] = useState(null)

    const onDelete = useCallback(async id => {
        const { hasError, data } = await optimaService.deleteBranch(id)

        if (hasError){
            setDeleteError(data.detail)
        } else {
            closeDeleteConfirmModal()
            reFetchBranches()
        }
    }, [])


    return (
        <CModal
            show={isDeleteConfirmModalOpen}
            onClose={closeDeleteConfirmModal}
            size="sm"
            centered
        >
            {/*<CModalHeader closeButton>Are you sure to fucking out?</CModalHeader>*/}
            <CModalBody>
                Вы уверены что хотите удалить этот филиал из списка ?
            </CModalBody>
            <CModalFooter>
                <CRow>
                    <CButton
                        color="danger"
                        onClick={() => onDelete(selectedBranch.id)}
                        className="mr-2"
                    >
                        Удалить
                    </CButton>
                    <CButton
                        color="secondary"
                        onClick={() => closeDeleteConfirmModal()}
                    >Отмена</CButton>
                </CRow>
                { deleteError && <CRow>
                    <CCol>
                        <span className="text-danger">{ deleteError }</span>
                    </CCol>
                </CRow> }
            </CModalFooter>
        </CModal>
    );
}

export default BranchesDeleteModal;