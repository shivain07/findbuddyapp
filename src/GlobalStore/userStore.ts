import { IUserState } from '@/interfaces/user';
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  user: IUserState | null;
  setUser: (user: IUserState) => void;
  clearUser: () => void;
  isLoggedin:boolean;
  setIsLoggedin: (val: boolean) => void;
  //In this case, Partial<IUserState> means the parameter can be an object containing any subset of the IUserState properties. For example:
  updateUser: (updates: Partial<IUserState>) => void; //Using Partial ensures that you don't need to pass the entire IUserState object, making it more convenient and flexible to use.
}

// Create the store with persistence
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null, // Initial state
      isLoggedin: false,
      setUser: (user) => set({ user }),
      setIsLoggedin: (val) => set({ isLoggedin: val }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      clearUser: () => set({ user: null, isLoggedin: false }),
    }),
    {
      name: "user-store", // Name of the key in localStorage
      partialize: (state) => ({
        user: state.user, // Persist only the 'user' state
        isLoggedin: state.isLoggedin, // Persist 'isLoggedin'
      }),
    }
  )
);

export const userVerificationPopupStore = create<{
  showUserVerificationModal:boolean;
  setShowUserVerificationModal: (value: boolean) => void;
}>((set) => ({
  showUserVerificationModal:false,
  setShowUserVerificationModal:(value)=>set({showUserVerificationModal:value})
}));

export const userLoginPopupStore = create<{
  showLoginPopup:boolean;
  setShowLoginPopup: (value: boolean) => void;
}>((set) => ({
  showLoginPopup:false,
  setShowLoginPopup:(value)=>set({showLoginPopup:value})
}));

