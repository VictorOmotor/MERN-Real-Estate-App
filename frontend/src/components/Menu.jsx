import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { signOutSuccess } from '../redux/user/userSlice';
import { FaTimes } from 'react-icons/fa';

const Menu = ({ onClick }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
    const signOutUrl = '/api/v1/user/signout'
  const date = new Date();
  const year = date.getFullYear();
  const token = currentUser?.data?.userData?.accessToken;
  
     const handleSignOut = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get(signOutUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      
      dispatch(signOutSuccess(response))
      
    } catch (error) {
     console.log(error)
    }
  }

    


  return (
    <div
      className="fixed inset-0 bg-slate-700 bg-opacity-95 z-50 sm:hidden "
      onClick={onClick}
    >
      <div className="flex flex-col gap-4 font-[Inter] text-white">
        <div className="flex items-center justify-between pb-6  pt-3 px-4">
          <Link to={'/'}>
            <div className="flex items-center">
            <span className="text-slate-800 font-bold">Platinum</span>
            <span className="text-slate-900 font-bold">Estate</span>   
            </div>
          </Link>
          <FaTimes
            size={28}
            className="text-white md:hidden"
            onClick={onClick}
          />
        </div>

        <nav>
          <ul className="flex flex-col gap-7 justify-center items-center ">
            {currentUser ? (
              <>
              <Link to={'/profile'}>
                <li className="">Profile</li>
              </Link>
              <Link to={'/create-listing'}>
              <li className="flex gap-3 items-center hover:bg-[#5F6D7E]">
                Create Listing
              </li>
            </Link>
           
              </>  
              
            ) : (
              ''
            )}
            {currentUser ? (
              ''
            ) : (
              <>
                <Link to={'/login'}>
                  <li className="flex gap-3 items-center hover:bg-[#5F6D7E]">
                    Sign in
                  </li>
                </Link>
                <Link to={'/signup'}>
                  <li className="flex gap-3 items-center hover:bg-[#5F6D7E]">
                    Sign up
                  </li>
                </Link>
              </>
            )}

            <Link to={'/about'}>
              <li className="flex gap-3 items-center hover:bg-[#5F6D7E]">
                About Us
              </li>
            </Link>
            
            {currentUser ? (
              <li
                onClick={handleSignOut}
                className="flex gap-3 cursor-pointer items-center hover:bg-[#5F6D7E]"
              >
                Sign out
              </li>
            ) : (
              ''
            )}

            <div className="flex flex-col items-center gap-2">
              <p>Copyright &copy; {year} Platinum Estate</p>
              <p>All rights reserved</p>
            </div>
            
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Menu;
