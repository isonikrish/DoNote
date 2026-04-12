type User = {
    id: number;
    email: string;
}
type Note = {
    id: number;
    title: string;
    createdAt: Date
}
type useAppStoreType = {
    user: User | null,
    setUser: (data: User | null) => void;
    selectedNoteId: number | null;
    setNoteId: (id: number) =>void;
}