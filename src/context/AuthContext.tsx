import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

const PUBLIC_PAGES = ["/", "/login", "/logout", "/register"];
export const AuthContextProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkSession() {
      const res = await fetch("/api/auth/login");
      const { user } = await res.json();

      setUser(user);
      setLoading(false);

      if (!user && !PUBLIC_PAGES.includes(pathname)) {
        router.replace("/login");
      }
    }

    checkSession();
  }, []);
  /*useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      if (!user && PUBLIC_PAGES.includes(pathname)) {
        router.replace("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);*/

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
