import React from 'react'
import {
    CRow,
    CCol,
    CDataTable,
    CButton
} from '@coreui/react'

function UsersTable({ onClickEdit, onClickDelete, users }) {

    console.log('users: ', users)

    return (
        <>
            <CDataTable
                items={users}
                fields={fields}
                hover
                striped
                bordered
                size="sm"
                sorter
                columnFilter
                scopedSlots = {{
                    'fullname':
                        (item)=>(
                            <td>
                                { item.fullname }
                            </td>
                        ),
                    'username':
                        (item)=>(
                            <td>
                                { item.username }
                            </td>
                        ),
                    'role_text':
                        (item)=>(
                            <td>
                                { item.role_text }
                            </td>
                        ),
                    'email':
                        (item)=>(
                            <td>
                                { item.email }
                            </td>
                        ),
                    'branch_text':
                        (item)=>(
                            <td className="text-center">
                                { item.branch_text || '-' }
                            </td>
                        ),
                    'actions':
                        (item)=>(
                            <td>
                                <CRow>
                                    <CCol>
                                        <CButton size="sm" color="info" onClick={() => onClickEdit(item)}>Изменить</CButton>
                                    </CCol>
                                    <CCol>
                                        <CButton size="sm" color="danger" onClick={() => onClickDelete(item)}>Удалить</CButton>
                                    </CCol>
                                </CRow>
                            </td>
                        )
                }}
            />
        </>
    )
}

const fields = [
        {
            key: 'fullname',
            label: 'Фио',
        },
        {
            key: 'username',
            label: 'username'
        },
        {
            key: 'role_text',
            label: 'Роль'
        },
        {
            key: 'email',
            label: 'Email'
        },
        {
            key: 'branch_text',
            label: 'Филиал'
        },
        {
            key: 'actions',
            label: '',
            filter: false,
            sorter: false,
            _style: { width: '20%'},
        }
    ]

export default UsersTable