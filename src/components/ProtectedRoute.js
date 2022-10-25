import React from 'react';
import { Navigate} from "react-router-dom";

const ProtectedRoute = ({
  component: Component,
  ...props
}) => { console.log(props.hasAccess)
  return (props.hasAccess ? <Component {...props}/> : <Navigate to="./signup" />)
}

export default ProtectedRoute;