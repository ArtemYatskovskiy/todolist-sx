import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

const Layout = lazy(() => import("./components/Layout/Layout"));
const Home = lazy(() => import("./pages/home/Home"));
const ToDoList = lazy(() => import("./pages/todo-list/ListComponent"));
const About = lazy(() => import("./pages/about/About"));
const EditTask = lazy(() => import("./pages/todo-list/EditTask"));
const ErrorPage = lazy(() => import("./pages/ErrorPage/ErrorPage"));
const NotFoundPage = lazy(() => import("./pages/not-found-page/NotFoundPage"));
const PrivateRoute = lazy(
  () => import("./components/PrivateRoute/PrivateRoute"),
);
const Login = lazy(() => import("./pages/login/Login"));

function App() {
  return (
    <>
      <main>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route element={<PrivateRoute />}>
                <Route path="todo-list" element={<ToDoList />} />
                <Route path="todo-list/:id" element={<EditTask />} />
                <Route path="about" element={<About />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="error" element={<ErrorPage />} />
              <Route path="not-found-page" element={<NotFoundPage />} />
              <Route
                path="*"
                element={<Navigate to="/not-found-page" replace />}
              />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
