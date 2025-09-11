package model

type CadastroRequest struct {
	Name           string     `json:"name"`
	ActivationCode string     `json:"activationCode"`
	CPF            string     `json:"CPF"`
	CNPJ           string     `json:"cnpj"`
	Celular        string     `json:"celular"`
	Email          string     `json:"email"`
	Password       string     `json:"password"`
	PayloadDTO     PayloadDTO `json:"payloadDTO"` // Payload completo
}
