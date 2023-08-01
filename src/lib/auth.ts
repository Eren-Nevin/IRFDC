// TODO: If token is expired, then logout

import { SERVER_ADDRESS } from "./utils";

export async function login(email: string, password: string) {
    const res = await fetch(`${SERVER_ADDRESS}/api/v1/authentication/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (res.status == 200) {
        const resBody = await res.json();
        if (resBody['data']) {
            // Success
            const token = resBody['data'];
            // NOTE: Maybe store token in cookie
            localStorage.setItem('token', token);
            return true;
        }
        else {
            return false;
        }
        // goto('../control');
    }
}

export async function signupAndLogin(email: string, password: string) {
    const signupRes = await signup(email, password);
    if (signupRes) {
        const loginRes = await login(email, password);
        // NOTE: loginRes is not used
        if (loginRes) {
            return true;
        }
    }

}

// Returns true if signup is successful and false if not
export async function signup(email: string, password: string) {
    const res = await fetch(`${SERVER_ADDRESS}/api/v1/authentication/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (res.status == 200) {
        const resBody = await res.json();
        if (resBody['data'] === true) {
            // Success
            return true;
        }
        else {
            return false;
        }
    }

}

// NOTE: call goto auth page after this
export function logout() {
    localStorage.removeItem('token');
}

// TODO: Test this
export async function isLoggedIn() {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
        return true;
    }
    else {
        return false;
    }
}

export function getAuthToken() {
    const token = localStorage.getItem('token');
    return token;
}


