import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Tipos
type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulação de banco de dados
const MOCK_USERS = [
  { id: '1', email: 'admin@bia.com', password: 'admin123', name: 'Administrador BIA' },
  { id: '2', email: 'trader@bia.com', password: 'trader123', name: 'Trader BIA' }
];

// Gerar "token" fake no frontend (⚠️ apenas para ambiente de testes)
const generateMockToken = (user: User): string => {
  const payload = { user, exp: Date.now() + 24 * 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload)); // base64 encode
};

const parseMockToken = (token: string): { user: User } | null => {
  try {
    const decoded = atob(token);
    const parsed = JSON.parse(decoded);
    return parsed;
  } catch (err) {
    console.error('Erro ao decodificar token:', err);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get('auth-token');
    if (storedToken) {
      const parsed = parseMockToken(storedToken);
      if (parsed && parsed.user) {
        setUser(parsed.user);
        setToken(storedToken);
      } else {
        Cookies.remove('auth-token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // simula delay

      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (!mockUser) return false;

      const userData = { id: mockUser.id, email: mockUser.email, name: mockUser.name };
      const newToken = generateMockToken(userData);

      setUser(userData);
      setToken(newToken);
      Cookies.set('auth-token', newToken, { expires: 1 });

      return true;
    } catch (err) {
      console.error('Erro no login:', err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // simula delay

      const exists = MOCK_USERS.find(u => u.email === email);
      if (exists) return false;

      const newUser = { id: Date.now().toString(), email, name };
      const newToken = generateMockToken(newUser);

      setUser(newUser);
      setToken(newToken);
      Cookies.set('auth-token', newToken, { expires: 1 });

      return true;
    } catch (err) {
      console.error('Erro no registro:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('auth-token');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
