import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignIn = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] =useState(null)
  const [loading, setLoading] = useState(null)
  const navigate = useNavigate()

  const url = 'http://localhost:5000/api/v1/user/signin'

  const handleChange = async (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    setLoading(true)
      const res = await axios.post(url, formData, {
    headers: {
    'Content-Type': 'application/json'
    },
    })
      
    
      setLoading(false)
      setError(null)
      navigate('/')
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message)
    }
    
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <input type="email" placeholder='Email'
          className='border p-3 rounded-lg focus:outline-none' id='email'
          onChange={handleChange}
        />
        <input type="password" placeholder='Password'
          className='border p-3 rounded-lg focus:outline-none' id='password'
          onChange={handleChange}
        />
        
        <button disabled={loading} className='bg-slate-700 text-white p-3
        rounded-lg uppercase hover:opacity-80
        disabled:opacity-50'>
          {loading ? 'Loading' : 'Sign In'}
        </button>
        
      </form>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
      <div className='flex gap-2 mt-5'>
        <p>Yet to have an account? </p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
    </div>
  )
}

export default SignIn