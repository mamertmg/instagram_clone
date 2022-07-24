import { lazy, Suspense } from 'react';
import * as ROUTES from './constants/routes';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserContext from './context/user';
import useAuthListener from './hooks/use-auth-listener';

const Login = lazy(()=> import('./pages/login'));
const SignUp = lazy(() => import('./pages/sign-up'));
const Dashboard = lazy(() => import('./pages/dashboard'))
const NotFound = lazy(() => import('./pages/not-found'))

export default function App() {

  const { user } = useAuthListener();

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <Suspense fallback={<p>Loading</p>}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login/>} exact/>
            <Route path={ROUTES.SIGN_UP} element={<SignUp/>} exact/>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard/>} exact/>
            <Route element={<NotFound/>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
}