import React, {useState, useContext, useCallback, useEffect} from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol, CModal, CModalBody, CModalFooter,
    CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import BranchesTable from "./BranchesTable"
import BranchesCreateModalForm from "./BranchesCreateModalForm"
import OptimaServiceContext from "../../context/OptimaServiceContext"
import FullPageSpinner from "../spinners/FullPageSpinner"
import BranchesEditModalForm from "./BranchesEditModalForm"
import BranchesDeleteModal from "./BranchesDeleteModal";

function BranchesContent(props) {

    const optimaService = useContext(OptimaServiceContext)

    const [isCreateFormModalOpen, setIsCreateFormModalOpen] = useState(false)
    const [isEditFormModalOpen, setIsEditFormModalOpen] = useState(false)
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [branches, setBranches] = useState([])
    const [selectedBranch, setSelectedBranch] = useState(null)

    const fetchBranches = useCallback(async () => {
        setIsLoading(true)
        const { hasError, data } = await optimaService.getBranches()

        console.log('branches result', data)
        if (hasError){

        } else {
            setBranches(data)
        }
        setIsLoading(false)
    }, [])

    useEffect(() => { fetchBranches() }, [])

    const reFetchBranches = useCallback(() => fetchBranches(), [])

    const openCreateFormModal = useCallback(() => setIsCreateFormModalOpen(true), [])

    const closeCreateFormModal = useCallback(() => setIsCreateFormModalOpen(false), [])

    const openEditFormModal = useCallback(() => setIsEditFormModalOpen(true), [])

    const closeEditFormModal = useCallback(() => setIsEditFormModalOpen(false), [])

    const openDeleteConfirmModal = useCallback(() => setIsDeleteConfirmModalOpen(true), [])

    const closeDeleteConfirmModal = useCallback(() => setIsDeleteConfirmModalOpen(false), [])

    const onEditClick = useCallback(branch => {
        setSelectedBranch(branch)
        openEditFormModal()
    }, [])

    const onDeleteClick = useCallback(branch => {
        setSelectedBranch(branch)
        openDeleteConfirmModal()
    }, [])

    return (
        <>
            <CCard>
                <CCardHeader>
                    <CRow>
                        <CCol>
                            Управление филиалами
                        </CCol>
                        <CCol>
                            <CButton color="primary" className="float-right" onClick={openCreateFormModal}>
                                <span className="mr-3">Добавить филиал</span>
                                <CIcon name="cil-location-pin"/>
                            </CButton>
                        </CCol>
                    </CRow>
                </CCardHeader>
                <CCardBody className="pl-5">
                    { isLoading ? <FullPageSpinner/> : <BranchesTable
                        branches={branches}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                    /> }
                </CCardBody>
            </CCard>
            <BranchesCreateModalForm
                isFormModalOpen={isCreateFormModalOpen}
                openFormModal={openCreateFormModal}
                closeFormModal={closeCreateFormModal}
                reFetchBranches={reFetchBranches}
            />
            { selectedBranch && <BranchesEditModalForm
                isFormModalOpen={isEditFormModalOpen}
                openFormModal={openEditFormModal}
                closeFormModal={closeEditFormModal}
                reFetchBranches={reFetchBranches}
                selectedBranch={selectedBranch}
            /> }
            { selectedBranch && <BranchesDeleteModal
                isDeleteConfirmModalOpen={isDeleteConfirmModalOpen}
                closeDeleteConfirmModal={closeDeleteConfirmModal}
                selectedBranch={selectedBranch}
                reFetchBranches={reFetchBranches}
            /> }
        </>
    )
}

export default BranchesContent