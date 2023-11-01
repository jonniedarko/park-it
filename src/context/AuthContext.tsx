import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

export const AuthContext = createContext({ user: null });

export const useAuthContext = () => useContext<{ user: any }>(AuthContext);

const PUBLIC_PAGES = ["/", "/login", "/logout", "/register"];
export const AuthContextProvider = ({ children }) => {
  const router = useRouter();
  const loginChecked = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkSession() {
      const res = await fetch("/api/auth/login");
      const { user } = await res.json();

      setUser(user);
      setLoading(false);
      console.log(user, "----", PUBLIC_PAGES.includes(pathname));
      debugger;
      if (!user && !PUBLIC_PAGES.includes(pathname)) {
        router.replace("/login");
      }
    }

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
