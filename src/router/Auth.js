
import { Navigate } from 'react-router-dom';

export default function Auth(props) {
    // console.log(props);
    return localStorage.getItem('token') ? props.children : <Navigate to="/login"></Navigate>
    // return props.children 
}
