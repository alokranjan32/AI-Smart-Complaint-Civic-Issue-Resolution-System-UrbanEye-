import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const USER_STORAGE_KEY = "urbaneye-user";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

        if (storedUser && isMounted) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    hydrateUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persistUser = async () => {
      if (user) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        return;
      }

      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    };

    persistUser();
  }, [isHydrated, user]);

  const updateUser = (updates) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const nextUpdates =
        typeof updates === "function" ? updates(currentUser) : updates;

      return {
        ...currentUser,
        ...nextUpdates,
      };
    });
  };

  return (
    <AuthContext.Provider value={{ isHydrated, updateUser, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
