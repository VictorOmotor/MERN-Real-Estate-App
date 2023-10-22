import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState, useEffect } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
  const [files, SetFiles] = useState([])
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 10,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false
  });
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, SetUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const createUrl = 'http://localhost:5000/api/v1/listing/create'
    const { currentUser } = useSelector((state) => state.user)
    const token = currentUser.data.userData.accessToken
    const userRef = currentUser.data.userData._id
    const navigate = useNavigate()
    const params = useParams()



    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            SetUploading(true);
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                
                setImageUploadError(false)
                SetUploading(false)
            }).catch((err) => {
                setImageUploadError('Image upload failed (10mb max per image)')
                SetUploading(false)
            })   
        } else {
            setImageUploadError('You can only upload 6 images per listing')
            SetUploading(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress)
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            ); 
        }) 
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData, 
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData, type: e.target.id
            })
        }
        
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const response = await axios.get(`http://localhost:5000/api/v1/listing/get/${listingId}`)
            setFormData(response.data.listing)
        }
        fetchListing()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('You must upload at least one image')
            if (+formData.regularPrice < formData.discountPrice) return setError('Discount price must be lower than regular price')
            setLoading(true)
            setError(false)
            const response = await axios.put(`http://localhost:5000/api/v1/listing/update/${params.listingId}`, { ...formData, userRef }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            console.log(response)
            setLoading(false)
            navigate(`/listing/${response.data.updatedListing._id}`)
        } catch (error) {
            // if (error.response.status === 401) {
            //     setLoading(false) 
            //     setError(false)
            //     navigate('/sign-in')
            // }
            
            // setError(error.message)
            // setLoading(false)
            console.log(error)
        }
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" className='border p-3 rounded-lg outline-none' placeholder='Name or Title' id='name' maxLength={62} minLength={10} required onChange={handleChange} value={formData.name}/>
                <input type="textarea" className='border p-3 rounded-lg outline-none' placeholder='Description' id='description' required onChange={handleChange} value={formData.description}/>
                <input type="text" className='border p-3 rounded-lg outline-none' placeholder='Address' id='address'  required onChange={handleChange} value={formData.address}/>
                <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                    <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type ==='sale'} />
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type ==='rent'}/>
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                    <span>Parking spot</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished}/>
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id='offer' className='w-5'  onChange={handleChange} checked={formData.offer} />
                    <span>Offer</span>
                </div>
            </div>
            <div className='flex flex-wrap gap-5'>
                <div className='flex items-center gap-2'>
                    <input type="number" id='bedrooms' min={1} max={10} required className='p-1
                    border border-gray-300 rounded-lg'  onChange={handleChange} value={formData.bedrooms}/>
                    <p>Beds</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input type="number" id='bathrooms' min={1} max={10} required className='p-1
                    border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathrooms}/>
                    <p>Baths</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input type="number" id='regularPrice' min={10} max={1000000} required className='p-1
                    border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice}/>
                    <div className='flex flex-col items-center'>
                    <p>Regular Price</p>
                    <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
                {formData.offer && (
                    <div className='flex items-center gap-2'>
                    <input type="number" id='discountPrice' min={0} max={1000000} required className='p-1
                    border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice}/>
                    <div className='flex flex-col items-center'>
                    <p>Discounted Price</p>
                    <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
                )}
                
            </div>
            </div>
            <div className="flex flex-col flex-1 gap-4" >
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>
                    The first image will be the first cover (max 6)
                </span>
                </p>
                <div className="flex gap-4">
                   <input onChange={(e) => SetFiles(e.target.files)} type="file" id="images" accept='image/*' multiple 
                   className='p-3 border border-gray-700 rounded w-full'/>
                   <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-1 text-gray-400 border border-green-700
                   rounded uppercase hover:shadow-lg disabled:opacity-80'>
                    {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) =>  (
                       <div key={index} className='flex justify-between p-3 border items-center'>
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                            <button onClick={() => handleRemoveImage(index)} className='p-3 text-red-700
                            rounded-lg uppercase hover:opacity-60'>Delete</button>
                        </div> 
                    ))
                }
                <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white 
                rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{ loading ? 'Updating...' : 'Update Listing'}</button>
                <p className='text-red-500'>{error ? error : ''}</p>
                
            </div>
        </form>
    </main>
  )
}

export default UpdateListing