import axios from "axios"
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        try {
            const url = 'http://localhost:5000/api/v1/auth/google'
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const response = await axios.post(url, {
                username: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
            }, {
                headers: {
                'Content-Type': 'application/json'
                }
                
            })
            
        dispatch(signInSuccess(response))
        navigate('/')
        
        } catch (error) {
            dispatch(signInFailure(error.response.data.message))
        }
        
    }

  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-80'>
        Continue with Google
    </button>
  )
}

export default OAuth