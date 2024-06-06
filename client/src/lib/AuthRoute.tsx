import { useUserStore } from '../components/store/userStore';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = () => {
  const { user } = useUserStore();
  if (user?.authority === 'ADMIN') {
    return <Outlet />;
  } else {
    return <Navigate replace to={'/'} />;
  }
};

export default AuthRoute;
