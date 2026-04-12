import {create} from 'zustand'

const useAppStore = create<useAppStoreType>((set)=>({
    user: null,
    setUser: (user) => set({user}),
    selectedNoteId: null,
    setNoteId: (id) => set({selectedNoteId: id})
}))

export default useAppStore;