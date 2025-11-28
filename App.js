import React, { useState, createContext, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function LoginPage() {
  const [name, setName] = useState("");
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setUser({ name });
    navigate("/dashboard");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Dashboard() {
  const { user, setUser } = useAuth();
  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <button onClick={() => setUser(null)}>Logout</button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
