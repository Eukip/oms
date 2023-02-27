import React, { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './scss/style.scss'
import Routes from "./pages/Routes"
import useWebSocket, {ReadyState} from "react-use-websocket"
import {useDispatch, useSelector} from "react-redux"
import {addOrder, saveOrders, updateOrder} from "./redux/actions/orderActions"
import OptimaServiceContext from "./context/OptimaServiceContext"
import OptimaService from "./services/optimaService"
import WSSendMessageContext from "./context/WSSendMessageContext"
import useSound from "use-sound"
import sound1 from './assets/sounds/sound1.mp3'
import {loadUser} from "./redux/actions/authActions"
import FullPageSpinner from "./components/spinners/FullPageSpinner"
import Toaster from "./components/Toaster";

let disconnect = () => {}

const App = () => {

  const [socketUrl, setSocketUrl] = useState(null)
  const didUnmount = useRef(false);

  const [toasts, setToasts] = useState([])

  const [play] = useSound(sound1)

  const accessToken = useSelector(state => state.auth.accessToken)
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const isUserLoading = useSelector(state => state.auth.isUserLoading)
  const isSoundOn = useSelector(state => state.setting.isSoundOn)

  const dispatch = useDispatch()

  const {
    sendMessage,
    readyState,
    lastJsonMessage,
    getWebSocket
  } = useWebSocket(socketUrl, {
    shouldReconnect: () => (didUnmount.current === false),
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  })

  useEffect(() => {
    dispatch(loadUser())

    return () => {
      disconnect()
      didUnmount.current = true
    }
  }, [])

  useEffect(() => {
    console.log('ReadyState: ', readyState)
  }, [readyState])

  useEffect(() => isSoundOn && play(), [isSoundOn])

  useEffect(() => {
    if (accessToken && isAuthenticated){
      setSocketUrl(`ws://0.0.0.0:8000/updates/?token=${accessToken}`)
      // setSocketUrl(`ws://3bb224954eaf.ngrok.io/updates/?token=${accessToken}`)
      disconnect = () => { getWebSocket().close(1000, 'disconnecting')}
    }
  }, [isAuthenticated])

  const addToast = () => {
    const newToast = { position: 'top-right', autohide: 3000, content: 'Новая заявка.' }
    setToasts([...toasts, newToast])
  }

  useEffect(() => {
    console.log('lastJsonMessage: ', lastJsonMessage)
    if (lastJsonMessage && lastJsonMessage.type === 'orders_list'){
      dispatch(saveOrders(lastJsonMessage.data))
    } else if (lastJsonMessage && lastJsonMessage.type === 'create_success') {
      isSoundOn && play()
      dispatch(addOrder(lastJsonMessage.data))
      const newToast = { position: 'top-right', autohide: 3000, content: 'Новая заявка.' }
      setToasts([...toasts, newToast])
    } else if (lastJsonMessage && lastJsonMessage.type === 'update_success') {
      const { data } = lastJsonMessage
      dispatch(updateOrder(data.id, data))
    }
  }, [lastJsonMessage])

  return (
    <Router>
      {/*<div className="d-flex justify-content-center">*/}
      {/*  <button onClick={addToast}>add toast</button>*/}
      {/*</div>*/}
      <OptimaServiceContext.Provider value={new OptimaService()}>
        <WSSendMessageContext.Provider value={sendMessage}>
          { isUserLoading ? <FullPageSpinner/> : <Routes/> }
        </WSSendMessageContext.Provider>
      </OptimaServiceContext.Provider>
      <Toaster toasts={toasts}/>
    </Router>
  )
}

export default App

// const messageHistory = useRef([])

// messageHistory.current = useMemo(() =>
//     messageHistory.current.concat(lastMessage),[lastMessage])


// const connectionStatus = {
//   [ReadyState.CONNECTING]: 'Connecting',
//   [ReadyState.OPEN]: 'Open',
//   [ReadyState.CLOSING]: 'Closing',
//   [ReadyState.CLOSED]: 'Closed',
//   [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
// }[readyState]