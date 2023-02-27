import React from 'react'
import {
    CRow,
    CCol,
    CToaster,
    CToast,
    CToastHeader,
    CToastBody
} from '@coreui/react'

function Toaster({ toasts }) {

    let toasters = (()=>{
        return toasts.reduce((toasters, toast) => {
            toasters[toast.position] = toasters[toast.position] || []
            toasters[toast.position].push(toast)
            return toasters
        }, {})
    })();

    return (
        <>
            {Object.keys(toasters).map((toasterKey) => (
                <CToaster
                    position={toasterKey}
                    key={'toaster' + toasterKey}
                >
                    {
                        toasters[toasterKey].map((toast, key)=>{

                            console.log('toast: ', toast)
                            console.log('key: ', key)

                            return(
                                <CToast
                                    key={'toast' + key}
                                    show={true}
                                    autohide={toast.autohide}
                                    fade={toast.fade}
                                >
                                    <CToastHeader closeButton={toast.closeButton}>
                                        Toast title
                                    </CToastHeader>
                                    <CToastBody>
                                        { toast.content }
                                    </CToastBody>
                                </CToast>
                            )
                        })
                    }
                </CToaster>
            ))}
        </>
    )
}

export default Toaster;