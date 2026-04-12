type User = {
    id: number;
    email: string;
}
type useAppStoreType = {
    user: User | null,
    setUser: (data: User | null) => void;
}