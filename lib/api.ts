import { API_URL } from './constants';

export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({login: email, password: password, undelete: false}),
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem('flock_token', data.token);
        return data.token;
    } else {
        throw new Error(data.message || "Login failed");
    }
}