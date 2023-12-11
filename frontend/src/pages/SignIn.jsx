import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  signInSuccess
} from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const SignIn = () => {
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)

  const url = '/api/v1/user/signin'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      setLoading(true)
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      dispatch(signInSuccess(response))
      setLoading(false)
      navigate('/')
    } catch (error) {
      setLoading(false)
      setError(error.response.data.message)
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4 w-3/4 sm:w-full mx-auto" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none"
          id="password"
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3
        rounded-lg uppercase hover:opacity-80
        disabled:opacity-50"
        >
          {loading ? 'Loading' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <p className="text-red-500 w-3/4 sm:w-full mx-auto sm:mt-4">{error ? error : ''}</p>
      
      <div className="flex gap-2 w-3/4 sm:w-full mx-auto sm:mt-5 text-sm sm:text-base">
        <p>Yet to have an account? </p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
    </div>
  )
}

export default SignIn
