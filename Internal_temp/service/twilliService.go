package service

import (
	"fmt"
	"log"

	"github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
)

func NewTwilioService(accountSid, authToken, fromNumber, contentSid string) *TwilioService {
	return &TwilioService{

		accountSid: accountSid,
		authToken:  authToken,
		fromNumber: fromNumber,
		contentSid: contentSid,
	}
}

// Envia mensagem simples (sandbox)
func (t *TwilioService) SendActivationCodeText(to string, code string) error {
	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: t.accountSid,
		Password: t.authToken,
	})

	params := &openapi.CreateMessageParams{}
	params.SetFrom(t.fromNumber)
	params.SetTo(to)
	params.SetBody(fmt.Sprintf("Seu código de ativação é: %s", code))

	resp, err := client.Api.CreateMessage(params)
	if err != nil {
		log.Printf("Erro ao enviar mensagem de teste: %v", err)
		return err
	}

	if resp.Sid != nil {
		log.Printf("Mensagem enviada com sucesso! SID: %s", *resp.Sid)
	}

	return nil
}

// Envia mensagem usando template aprovado
func (t *TwilioService) SendActivationCodeTemplate(to string, code string) error {
	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: t.accountSid,
		Password: t.authToken,
	})

	params := &openapi.CreateMessageParams{}
	params.SetFrom(t.fromNumber)
	params.SetTo(to)
	params.SetContentSid(t.contentSid)
	params.SetContentVariables(fmt.Sprintf(`{"1":"%s"}`, code))

	resp, err := client.Api.CreateMessage(params)
	if err != nil {
		log.Printf("Erro ao enviar mensagem template: %v", err)
		return err
	}

	if resp.Sid != nil {
		log.Printf("Mensagem enviada com sucesso! SID: %s", *resp.Sid)
	}

	return nil
}
