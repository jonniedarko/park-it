import {
  useEffect,
  useState,
  createContext,
  useContext,
  Dispatch,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export const AuthContext = createContext({ user: null, setUser: null });

export const useAuthContext = () =>
  useContext<{ user: any; setUser: Dispatch<any> }>(AuthContext);

const PUBLIC_PAGES = ["/", "/login", "/logout", "/register"];
export const AuthContextProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkSession() {
      const res = await fetch("/api/auth/login");
      const { user: verifiedUser } = await res.json();

      console.log(verifiedUser, "----", PUBLIC_PAGES.includes(pathname));
      setUser(verifiedUser);
      if (!verifiedUser && !PUBLIC_PAGES.includes(pathname)) {
        router.replace("/login");
      }

      setLoading(false);
    }

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
