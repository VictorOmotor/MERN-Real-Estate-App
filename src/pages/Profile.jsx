import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux' 
import { useState } from 'react'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()


  const handleChange = async (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    dispatch(signInStart())
      const response = await axios.put(url, formData, {
    headers: {
    'Content-Type': 'application/json'
    },
    })
      
    
      dispatch(signInSuccess(response))
    } catch (error) {
      dispatch(signInFailure(error.response.data.message))
    }
    
  }

  return (
    <div className='p-3 max-w-lg mx-auto' >
      <h1 className='text-3xl font-semibold text-center
      my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={currentUser.data.rest.photo} alt='profile-photo' />
        <input type="text" placeholder='Username'
          className='border p-3 rounded-lg focus:outline-none' id='username'
          onChange={handleChange}
        />
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
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-green-700 cursor-pointer'>Sign out</span>
        
      </div>
      
    </div>
  )
}

export default Profile