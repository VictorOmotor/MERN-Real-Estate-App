import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux' 
import { useState, useRef, useEffect } from 'react'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase";
import { Link, useNavigate } from 'react-router-dom'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [formData, setFormData] = useState({})
  const [file, setFile] = useState(undefined)
  const [showListingsError, setShowListingsError] = useState(false)
  const { loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const url = `http://localhost:5000/api/v1/user/profile/${currentUser.data.userData._id}`
  const deleteUrl = `http://localhost:5000/api/v1/user/deleteuser/${currentUser.data.userData._id}`
  const getListingsUrl = `http://localhost:5000/api/v1/listing/listings/${currentUser.data.userData._id}`
  const signOutUrl = 'http://localhost:5000/api/v1/user/signout'
  const [updateSuccess, SetUpdateSuccess] = useState(false)
  const [showUserListings, setShowUserListings] = useState([])
  // const [signOut, setSignOut] = useState(false)
  const token = currentUser.data.userData.accessToken
  const userRef = currentUser.data.userData._id
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
    dispatch(updateUserStart())
      const response = await axios.put(url, formData, {
    headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
    },
    })
      
      dispatch(updateUserSuccess(response))
      SetUpdateSuccess(true)
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/sign-in')
      }
      dispatch(updateUserFailure(error.response.data.message))
    }
    
  }

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      // dispatch(deleteUserStart())
      const response = await axios.delete(deleteUrl, {
      headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
      },
      })
      
      // dispatch(deleteUserSuccess(response))
      navigate('/sign-in')
    } catch (error) {
      // navigate('/sign-in')
      dispatch(deleteUserFailure(error.response.data.message))
    }
  }

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      // dispatch(signOutStart())
      const response = await axios.get(signOutUrl, {
      headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
      },
      })
      navigate('/sign-in')
      // dispatch(signOutSuccess(response))
      
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/sign-in')
      }
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

  const handleShowListings = async () => {
    try {
      setShowListingsError(false)
       const response = await axios.get(getListingsUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
      })
      setShowListingsError(false)
      setShowUserListings(response)
    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handleDeleteListing = async (listingId) => {
  try {
    await axios.delete(`http://localhost:5000/api/v1/listing/delete/${listingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });
    // Update the showUserListings state correctly by filtering the listings
    setShowUserListings((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        listings: prev.data.listings.filter((listing) => listing._id !== listingId),
      },
    }));
  } catch (error) {
    
  }
};



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
          src={formData.photo || currentUser.data.userData.photo} alt='profile-photo' />
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
          defaultValue={currentUser.data.userData.username}
          className='border p-3 rounded-lg focus:outline-none' id='username'
          onChange={handleChange}
        />
        <input type="email" placeholder='Email'
          defaultValue={currentUser.data.userData.email}
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
        <Link className='bg-green-700 text-white p-3
        rounded-lg uppercase hover:opacity-80 text-center' to={'/create-listing'}>
          Create Listing
        </Link>
      </form>
      <p className='text-red-500 mt-4'>{error ? error : ''}</p>
      <p className='text-green-500 mt-4'>{updateSuccess ? 'Profile updated successfully!' : ''}</p>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-green-700 cursor-pointer'>Sign out</span>
        
      </div>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show listings</button>
      <p className='text-red-500 mt-4'>{showListingsError ? 'Error showing listings' : ''}</p>
      {
        showUserListings && showUserListings.data && showUserListings.data.listings &&
        showUserListings.data.listings.length > 0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-2 text-2xl font-semibold'>Your listings </h1>
        {showUserListings.data.listings.map((listing) => (
          <div key={listing._id} className='border rounded-lg p-3
          flex justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="image-cover"
              className='h-16 w-16 '/>
            </Link>
            <Link className='text-slate-700 font-semibold 
              flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>
            <div className='flex flex-col items-center'>
              <button onClick={() => handleDeleteListing(listing._id)} className='text-red-700 uppercase'>Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
              <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>
          </div>
          
            ))}
          </div>
      }
    </div>
  )
}

export default Profile