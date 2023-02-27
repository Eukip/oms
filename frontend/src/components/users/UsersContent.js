import React, {useState, useCallback, useEffect, useContext} from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import UsersTable from "./UsersTable"
import UsersCreateModalForm from "./UsersCreateModalForm"
import UsersEditModalForm from "./UsersEditModalForm"
import UsersDeleteModal from "./UsersDeleteModal"
import OptimaServiceContext from "../../context/OptimaServiceContext"
import FullPageSpinner from "../spinners/FullPageSpinner"

function UsersContent() {

    const optimaService = useContext(OptimaServiceContext)

    const [isUsersLoading, setIsUsersLoading] = useState(false)
    const [users, setUsers] = useState([])

    const [selectedUser, setSelectedUser] = useState(null)
    const [isCreateFormModalOpen, setIsCreateFormModalOpen] = useState(false)
    const [isEditFormModalOpen, setIsEditFormModalOpen] = useState(false)
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)

    const fetchUsers = useCallback(async () => {
        setIsUsersLoading(true)
        const { hasError, data } = await optimaService.getUsers()

        if (hasError){

        } else {
            setUsers(data)
        }

        setIsUsersLoading(false)
        return null
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [])

    const reFetchUsers = useCallback(() => fetchUsers(), [])

    const openCreateFormModal = useCallback(() => setIsCreateFormModalOpen(true), [])
    const closeCreateFormModal = useCallback(() => {
        setIsCreateFormModalOpen(false)
        setSelectedUser(null)
    }, [])
    const openEditFormModal = useCallback(() => setIsEditFormModalOpen(true), [])
    const closeEditFormModal = useCallback(() => {
        setIsEditFormModalOpen(false)
        setSelectedUser(null)
    }, [])
    const openDeleteConfirmModal = useCallback(() => setIsDeleteConfirmModalOpen(true), [])
    const closeDeleteConfirmModal = useCallback(() => {
        setIsDeleteConfirmModalOpen(false)
        setSelectedUser(null)
    }, [])

    const onClickEdit = useCallback(user => {
        setSelectedUser(user)
        openEditFormModal()
    }, [])

    const onClickDelete = useCallback(user => {
        setSelectedUser(user)
        openDeleteConfirmModal()
    }, [])

    return (
        <>
            <CCard>
                <CCardHeader>
                    <CRow>
                        <CCol>
                            Управление сотрудниками
                        </CCol>
                        <CCol>
                            <CButton color="primary" className="float-right" onClick={openCreateFormModal}>
                                <span className="mr-3">Создать сотрудника</span>
                                <CIcon name="cil-user-follow"/>
                            </CButton>
                        </CCol>
                    </CRow>
                </CCardHeader>
                <CCardBody className="pl-2">
                    { isUsersLoading ? <FullPageSpinner/> : <UsersTable
                        onClickEdit={onClickEdit}
                        onClickDelete={onClickDelete}
                        users={users.map(u => ({ ...u, fullname: `${u.first_name} ${u.last_name}`}))}
                    /> }
                </CCardBody>
            </CCard>
            <UsersCreateModalForm
                isCreateFormModalOpen={isCreateFormModalOpen}
                closeCreateFormModal={closeCreateFormModal}
                reFetchUsers={reFetchUsers}
            />
            { selectedUser && <UsersEditModalForm
                isEditFormModalOpen={isEditFormModalOpen}
                closeEditFormModal={closeEditFormModal}
                selectedUser={selectedUser}
                reFetchUsers={reFetchUsers}
            /> }
            { selectedUser && <UsersDeleteModal
                isDeleteConfirmModalOpen={isDeleteConfirmModalOpen}
                closeDeleteConfirmModal={closeDeleteConfirmModal}
                selectedUser={selectedUser}
                reFetchUsers={reFetchUsers}
            /> }
        </>
    )
}

export default UsersContent