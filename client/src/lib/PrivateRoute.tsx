import { Navigate, Outlet, RouteProps } from 'react-router-dom';
import { useUserStore } from '../components/store/userStore';
import { FC } from 'react';

const PrivateRoute: FC<RouteProps> = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  if (isLoggedIn) {
    return <Outlet />;
  } else {
    return <Navigate replace to={'/'} />;
  }
};

export default PrivateRoute;
