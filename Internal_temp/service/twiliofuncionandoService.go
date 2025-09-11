package service

//
//type TwilioServiceInterface interface {
//	SendWhatsAppMessage(to string, variables map[string]string) error
//}
//
//type TwilioServicefuncionando struct {
//	client *twilio.RestClient
//	from   string
//}
//
//func NewTwilioServiceFuncionando(accountSid, authToken, from string) *TwilioService {
//	client := twilio.NewRestClientWithParams(twilio.ClientParams{
//		Username: accountSid,
//		Password: authToken,
//	})
//	return &TwilioService{client: client, from: from}
//}
//
//func (t *TwilioService) SendWhatsAppMessage(to string, variables map[string]string) error {
//	params := &openapi.CreateMessageParams{}
//	params.SetFrom(t.from)
//	params.SetTo(to)
//	params.SetContentSid("HXb5b62575e6e4ff6129ad7c8efe1f983e")
//
//	// Convertendo map[string]string para JSON string
//	contentVars := "{"
//	first := true
//	for k, v := range variables {
//		if !first {
//			contentVars += ","
//		}
//		contentVars += fmt.Sprintf(`"%s":"%s"`, k, v)
//		first = false
//	}
//	contentVars += "}"
//	params.SetContentVariables(contentVars)
//
//	resp, err := t.client.Api.CreateMessage(params)
//	if err != nil {
//		return fmt.Errorf("erro ao enviar mensagem: %v", err)
//	}
//
//	if resp.Sid != nil {
//		log.Println("Mensagem enviada com sucesso! SID:", *resp.Sid)
//	} else {
//		log.Println("Mensagem enviada, mas sem SID retornado")
//	}
//
//	return nil
//}
