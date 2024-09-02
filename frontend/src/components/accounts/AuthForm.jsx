import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import api from '../../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'


const AuthForm = ({ type, role = 'jobseeker' }) => {

  const authType = type
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    console.log(firstName, ' ', lastName, ' ', email, ' ', username, ' ', password, ' ', role, ' ', authType)
    try {
      if (authType === 'register') {
        const response = await api.post('/accounts/users/', {
          first_name: firstName,
          last_name: lastName,
          email: email,
          username: username,
          password: password,
          role: role
        })
        console.log(response, ' ', response.data)
        if (response.status === 201) {
          console.log(response.data, 'response.data')
          // const accessToken = response.data.access
          // const refreshToken = response.data.refresh
          // localStorage.setItem(ACCESS_TOKEN, accessToken)
          // localStorage.setItem(REFRESH_TOKEN, refreshToken)
          navigate('/')
        }
      } else if (authType === 'login') {
        const response = await api.post('/accounts/jwt/create/', {
          username: email,
          password: password
        })
        if (response.status === 200) {
          const accessToken = response.data.access
          const refreshToken = response.data.refresh
          localStorage.setItem(ACCESS_TOKEN, accessToken)
          localStorage.setItem(REFRESH_TOKEN, refreshToken)
          console.log(accessToken, ' ', refreshToken)
          navigate('/')
        }
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <form className='flex flex-col' onSubmit={handleSubmit}>
      {authType === 'register' && (
        <>
          <input
            type="text"
            placeholder="First Name"
            className="input input-bordered input-primary w-full max-w-xs"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input input-bordered input-primary w-full max-w-xs"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered input-primary w-full max-w-xs"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </>
      )}
      <input
        type="email"
        placeholder="Email"
        className="input input-bordered input-primary w-full max-w-xs"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="input input-bordered input-primary w-full max-w-xs"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      {authType === 'register' && (
        <Link to="/login" className="text-xs text-gray-600 hover:underline">Already have an account?</Link>
      )}
      {authType === 'login' && (
        <Link to="/jobseeker/register" className="text-xs text-gray-600 hover:underline">Don't have an account?</Link>
      )}
      <button
        type="submit"
        className="btn btn-primary w-full max-w-xs"
        disabled={loading}
      >
        {authType === 'register' ? 'Register' : 'Login'}
      </button>
    </form>
  )
}

export default AuthForm