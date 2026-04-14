type User = {
    id: number;
    email: string;
}
type Note = {
    id: number;
    title: string;
    createdAt: Date
}
type Task = {
    id: number;
    title: string;
    createdAt: Date;
    status: "DONE" | "PENDING";
    note: Note
}
type useAppStoreType = {
    user: User | null,
    setUser: (data: User | null) => void;
    selectedNoteId: number | null;
    setNoteId: (id: number | null) =>void;
}