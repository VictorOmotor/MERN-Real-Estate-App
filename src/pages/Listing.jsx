import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle';

const Listing = () => {
    SwiperCore.use([Navigation])
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchListing = async () => {
            try {
            setLoading(true)
            const response = await axios.get(`http://localhost:5000/api/v1/listing/get/${params.listingId}`)
            
            setListing(response.data.listing)
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.listingId])
  return (
      <main>
          {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
          {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
          {listing && !loading && !error && (
            <div>
            <Swiper navigation>
                {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                    <div className='h-[500px]' 
                    style={{background:`url(${url}) center no-repeat`,
                    backgroundSize: 'cover' 
                    }}>
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>
            </div>  
          )
          }
      </main>
  )
}

export default Listing