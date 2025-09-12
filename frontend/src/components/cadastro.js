import { apiFetch } from './apiFetch';

export async function criarCadastro(dados) {
    try {
        const response = await apiFetch("cadastros", {
            method: "POST",
            body: JSON.stringify(dados)
        });
        console.log("Cadastro criado:", response);
        return response;
    } catch (error) {
        console.error("Erro ao criar cadastro:", error.message);
        throw error;
    }
}
