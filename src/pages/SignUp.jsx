import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] =useState(null)
  const [loading, setLoading] = useState(null)
  const navigate = useNavigate()

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
    const res = await axios.post('http://localhost:5000/api/v1/user/signup', formData, {
    headers: {
    'Content-Type': 'application/json'
    },
    })
      console.log(res)
    if (res.data.status === "Failed") {
      setLoading(false)
      setError(data.message);
      return
    }
      setLoading(false)
      setError(null)
      navigate('/sign-in')
    } catch (error) {
      setLoading(false);
      setError(error.message)
    }
    
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <input type="text" placeholder='username'
          className='border p-3 rounded-lg focus:outline-none' id='username'
          onChange={handleChange}
        />
        <input type="email" placeholder='email'
          className='border p-3 rounded-lg focus:outline-none' id='email'
          onChange={handleChange}
        />
        <input type="password" placeholder='password'
          className='border p-3 rounded-lg focus:outline-none' id='password'
          onChange={handleChange}
        />
        <input type="password" placeholder='confirm password'
          className='border p-3 rounded-lg focus:outline-none' id='confirmPassword'
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-white p-3
        rounded-lg uppercase hover:opacity-80
        disabled:opacity-50'>
          {loading ? 'Loading' : 'Sign Up'}
        </button>
        
      </form>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
      <div className='flex gap-2 mt-5'>
        <p>Have an account? </p>
        <Link to='/sign-in'>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}

export default SignUp