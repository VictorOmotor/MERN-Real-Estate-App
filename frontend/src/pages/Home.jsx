import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import ListingItem from '../components/ListingItem'

const Home = () => {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])

  SwiperCore.use([Navigation])
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await axios.get(
          `https://mern-real-estate-9wp2.onrender.com/api/v1/listing/get?offer=true&limit=4`,
        )

        setOfferListings(response.data.listings)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/listing/get?type=rent&limit=4`,
        )

        setRentListings(response.data.listings)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/listing/get?type=sale&limit=4`,
        )

        setSaleListings(response.data.listings)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListings()
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-6 py-28 px-3">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          apartment with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Platinum Estate offers the best and most affordable homes anywhere in
          Nigeria.
          <br />
          We have a wide array of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className="text-xs sm:text-sm
        text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]})
              center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div
        className="max-w-6xl mx-auto p-3 flex flex-col
      gap-8 my-10"
      >
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2
                className="text-2xl font-semibold
                text-slate-600"
              >
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800
                hover:underline"
                to={'/search?offer=true'}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2
                className="text-2xl font-semibold
                text-slate-600"
              >
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800
                hover:underline"
                to={'/search?type=rent'}
              >
                Show more rent options
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2
                className="text-2xl font-semibold
                text-slate-600"
              >
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800
                hover:underline"
                to={'/search?type=sale'}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
