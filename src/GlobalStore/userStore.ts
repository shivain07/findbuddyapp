import { IUserState } from '@/interfaces/user';
import {create} from 'zustand';

interface UserStore {
  user: IUserState | null;
  setUser: (user: IUserState) => void;
  clearUser: () => void;
  isLoggedin:boolean;
  setIsLoggedin: (val: boolean) => void;
  //In this case, Partial<IUserState> means the parameter can be an object containing any subset of the IUserState properties. For example:
  updateUser: (updates: Partial<IUserState>) => void; //Using Partial ensures that you don't need to pass the entire IUserState object, making it more convenient and flexible to use.
}

export const useUserStore = create<UserStore>((set) => ({
  user: null, // Initial state is null
  setUser: (user) => set({ user }),
  isLoggedin:false,
  setIsLoggedin: (val) => set({ isLoggedin: val }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })), 
  clearUser: () =>
    set(() => ({
      user: null,
    })),
}));

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

