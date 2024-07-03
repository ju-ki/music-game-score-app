import { Navigate, Outlet, RouteProps, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../components/store/userStore';
import { FC, useEffect } from 'react';

const PrivateRoute: FC<RouteProps> = () => {
  const { isLoggedIn, checkLoginStatus } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyLogin = async () => {
      localStorage.setItem('currentPage', location.pathname);
      const isValid = await checkLoginStatus();

      if (isValid) {
        const currentPage = localStorage.getItem('currentPage');
        if (currentPage) {
          navigate(currentPage);
        }
      }
      localStorage.removeItem('currentPage');
    };

    verifyLogin();
  }, []);

  if (isLoggedIn) {
    return <Outlet />;
  } else {
    return <Navigate replace to={'/'} />;
  }
};

export default PrivateRoute;
