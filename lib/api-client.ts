import {API_URL} from "@/lib/constants.ts";


export async function spacebarFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("flock_token");

    const res = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
}