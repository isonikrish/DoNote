import {create} from 'zustand'

const useAppStore = create<useAppStoreType>((set)=>({
    user: null,
    setUser: (user) => set({user})
}))

export default useAppStore;