import React, {useContext, useCallback, useState} from 'react'
import {CButton, CModal, CModalBody, CModalFooter} from "@coreui/react"
import OptimaServiceContext from "../../context/OptimaServiceContext"
import MiniSpinner from "../spinners/MiniSpinner"

function UsersDeleteModal({ isDeleteConfirmModalOpen, closeDeleteConfirmModal, selectedUser, reFetchUsers }) {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const optimaService = useContext(OptimaServiceContext)

    const onDelete = useCallback(async id => {
        setIsLoading(true)
        const { hasError } = await optimaService.deleteUser(id)

        if (hasError){
            setError('Не удалось удалить этого пользователя')
        } else {
            reFetchUsers()
            closeDeleteConfirmModal()
        }
        setIsLoading(false)
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
                Вы уверены что хотите удалить этого сотрудника ?
            </CModalBody>
            <CModalFooter>
                <div>
                    { isLoading ? <span className="mr-4"><MiniSpinner/></span> :
                        <CButton className="mr-2" color="danger" type="submit" onClick={() => onDelete(selectedUser.id)}>
                            Удалить
                        </CButton> }
                    <CButton
                        color="secondary"
                        onClick={closeDeleteConfirmModal}
                    >Отмена</CButton>
                </div>
                { error && <div className="text-danger">{error}</div> }
            </CModalFooter>
        </CModal>
    )
}

export default UsersDeleteModal