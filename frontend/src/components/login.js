import { apiFetch } from './apiFetch';

export async function loginUsuario(dados) {
    try {
        const response = await apiFetch("login", {
            method: "POST",
            body: JSON.stringify(dados)
        });
        console.log("Login realizado:", response);
        // opcional: salvar token no localStorage
        if (response.token) {
            localStorage.setItem("token", response.token);
        }
        return response;
    } catch (error) {
        console.error("Erro no login:", error.message);
        throw error;
    }
}
