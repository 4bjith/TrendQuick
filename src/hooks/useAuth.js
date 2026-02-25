import { useQuery } from "@tanstack/react-query";
import useUserStore from "../zustand/userStore";
import api from "../api/axiosClient";

export const useAuth = () => {
    const token = useUserStore((state) => state.token);
    const clearToken = useUserStore((state) => state.clearToken);

    const { data: user, isLoading, isError, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                const res = await api.get("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return res.data.user;
            } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    clearToken();
                }
                throw err;
            }
        },
        enabled: !!token,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        retry: false,
    });

    return {
        user,
        token,
        isLoading,
        isError,
        isAuthenticated: !!token && !!user,
        refetchUser: refetch,
    };
};
