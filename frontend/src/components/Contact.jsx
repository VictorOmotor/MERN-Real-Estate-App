import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null)
  const { currentUser } = useSelector((state) => state.user)
  const token = currentUser.data.userData.accessToken
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await axios.get(
          `https://mern-real-estate-9wp2.onrender.com/api/v1/user/${listing.userRef}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )
        setLandlord(response.data.user)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLandlord()
  }, [listing.userRef])
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{' '}
            for{' '}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
            placeholder="Enter your message here"
            className="w-full border p-3 rounded-lg outline-none"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding 
            ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-75"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  )
}

export default Contact
