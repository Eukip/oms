import React from 'react'
import {
    CRow,
    CCol,
    CDataTable,
    CButton
} from '@coreui/react'

function BranchesTable({ branches, onEditClick, onDeleteClick }) {

    return (
        <>
            <CDataTable
                items={branches}
                fields={fields}
                hover
                striped
                bordered
                size="sm"
                sorter
                columnFilter
                scopedSlots = {{
                    'city':
                        (item)=>(
                            <td>
                                { item.city }
                            </td>
                        ),
                    'address':
                        (item)=>(
                            <td>
                                { item.address }
                            </td>
                        ),
                    'actions':
                        (item)=>(
                            <td>
                                <CRow>
                                    <CCol>
                                        <CButton size="sm" color="info" onClick={() => onEditClick(item)}>Изменить</CButton>
                                    </CCol>
                                    <CCol>
                                        <CButton size="sm" color="danger" onClick={() => onDeleteClick(item)}>Удалить</CButton>
                                    </CCol>
                                </CRow>
                            </td>
                        )
                }}
            />
        </>
    )
}

const fields = ['city','address', {
    key: 'actions',
    label: '',
    _style: { width: '20%' },
}]

export default BranchesTable