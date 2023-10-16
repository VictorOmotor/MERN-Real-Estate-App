import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux' 
import { useState, useRef, useEffect } from 'react'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [formData, setFormData] = useState({})
  const [file, setFile] = useState(undefined)
  const { loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)


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
      // Firebase storage
      // allow read;
      // allow write: if 
      // request.resource.size < 10 * 1024 * 1024 &&
      // request.resource.contentType.matches('image/.*');
      
    useEffect(() => {
      if (file) {
        handlefileUpload(file)
      }
    }, [file]);
  
  const handlefileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100)
        setFilePerc(Math.round(progress))
      },
    (error) => {
      setFileUploadError(true)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL) => {
        setFormData({...formData, photo: downloadURL })
      })
      }
    )
  } 

  return (
    <div className='p-3 max-w-lg mx-auto' >
      <h1 className='text-3xl font-semibold text-center
      my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
        onChange={(e) => setFile(e.target.files[0])}
        type='file' 
        ref={fileRef} 
        hidden 
        accept='image/*'
        />
        <img onClick={() => fileRef.current.click()}
          className='rounded-full h-28 w-28 object-cover cursor-pointer self-center mt-2'
          src={formData.photo || currentUser.data.rest.photo} alt='profile-photo' />
        <p className='text-sm self-center'>
        {fileUploadError ? (
        <span className='text-red7-700'>Error image upload (File must be less than 10MB)</span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className='text-slate-700'>{`Uploading ${filePerc}%`}
          </span>
        ) : filePerc === 100 ? (
            <span className='text-green-700'>Image uploaded successfully!
          </span>
        ) : (
            ''
        )}
        </p>
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