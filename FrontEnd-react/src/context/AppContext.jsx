import { createContext, useReducer, useContext } from 'react'
import { api } from '../services/api'

import { toast } from 'react-toastify'

import {
  TOGGLE_SIDEBAR,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  GET_TRANSACTIONS_BEGIN,
  GET_TRANSACTIONS_SUCCESS,
  CREATE_TRANSACTION_BEGIN,
  CREATE_TRANSACTION_SUCCESS,
  DELETE_TRANSACTION_BEGIN,
  DELETE_TRANSACTION_SUCCESS,
  GET_SAVINGS_BEGIN,
  GET_SAVINGS_SUCCESS,
  CREATE_SAVING_BEGIN,
  CREATE_SAVING_SUCCESS,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS
} from './actions'

import reducer from './reducer'

const AppContext = createContext()

const user = localStorage.getItem('user')
const token = localStorage.getItem('token')

const initialState = {
  isLoading: false,
  showSidebar: false,
  user: user ? JSON.parse(user) : null,
  token: token,
  transactions: [],
  savings: []
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  api.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error.response.status === 401) {
        logoutUser()
      }
      return Promise.reject(error)
    }
  )

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  const registerUser = async currentUser => {
    dispatch({ type: REGISTER_USER_BEGIN })
    try {
      const { data } = await api.post('/auth/register', currentUser, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }) 

      const { user, token } = data

      dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, token } })
    } catch (error) {
      console.log(error)
    }
  }

  const loginUser = async currentUser => {    
    console.log(currentUser)   

    dispatch({ type: LOGIN_USER_BEGIN })
    try {     

      const { data } = await api.post('/auth/login', currentUser, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }) 
      const { user, token } = data

      dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token } })
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

      toast.success('Login realizado com sucesso!')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const updateUser = async userModel => {
    dispatch({ type: UPDATE_USER_BEGIN })
    try {
      const { data } = await api.patch('/auth/updateUser', userModel, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }) 

      const { user, token } = data

      dispatch({ type: UPDATE_USER_SUCCESS, payload: { user, token } })
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      toast.success('Usuário atualizado com sucesso!')
    } catch (error) {
      logoutUser()
    }
  }

  const logoutUser = () => {
   dispatch({ type: LOGOUT_USER })
   localStorage.removeItem('user')
   localStorage.removeItem('token')
  }

  const getTransactions = async () => {
    dispatch({ type: GET_TRANSACTIONS_BEGIN })
    try {
      const { data } = await api.get('/transactions', {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      })    

      const { transactions } = data

      dispatch({ type: GET_TRANSACTIONS_SUCCESS, payload: { transactions } })

    } catch (error) {
      console.log(error)
      logoutUser()
    }
  }

  const createTransaction = async transactionModel => {
    dispatch({ type: CREATE_TRANSACTION_BEGIN })
    try {
      const { data } = await api.post('/transactions', transactionModel, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }) 

      const { transaction } = data

      dispatch({ type: CREATE_TRANSACTION_SUCCESS, payload: { transaction } })
    } catch (error) {
      logoutUser()
    }
  }

  const deleteTransaction = async transactionId => {
    dispatch({ type: DELETE_TRANSACTION_BEGIN })
    try {
      const { data } = await api.delete(`/transactions/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }) 

      const { transaction } = data

      dispatch({ type: DELETE_TRANSACTION_SUCCESS, payload: { transaction } })
    } catch (error) {
      logoutUser()
    }
  }

  const updateTransaction = async (transactionId, transactionModel) => {
    try {
      await api.patch(`/transactions/${transactionId}`, transactionModel, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }) 

      getTransactions()
    } catch (error) {
      logoutUser()
    }
  }

  const getSavings = async () => {
    dispatch({ type: GET_SAVINGS_BEGIN })
    try {
      const { data } = await api.get('/savings', {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }) 

      const { savings } = data

      dispatch({ type: GET_SAVINGS_SUCCESS, payload: { savings } })
    } catch (error) {
      logoutUser()
    }
  }

  const createSaving = async savingModel => {
    dispatch({ type: CREATE_SAVING_BEGIN })
    try {
      const { data } = await api.post('/savings', savingModel, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }) 

      const { saving } = data

      dispatch({ type: CREATE_SAVING_SUCCESS, payload: { saving } })
    } catch (error) {
      logoutUser()
    }
  }

  const updateSaving = async (id, savingModel) => {
    try {
      if (savingModel?.availableAmount >= savingModel?.totalAmount) {
        await api.delete(`/savings/${id}`, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        }) 

        getSavings()
        return
      }

      await api.patch(`/savings/${id}`, savingModel, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }) 

      getSavings()
    } catch (error) {
      logoutUser()
    }
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        toggleSidebar,
        registerUser,
        loginUser,
        logoutUser,
        getTransactions,
        createTransaction,
        deleteTransaction,
        updateTransaction,
        getSavings,
        createSaving,
        updateSaving,
        updateUser
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export { AppProvider, initialState, useAppContext }
