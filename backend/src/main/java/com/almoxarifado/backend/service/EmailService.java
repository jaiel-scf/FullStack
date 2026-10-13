package com.almoxarifado.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// Responsável pelo envio de e-mails do SIA
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String emailSistema;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Envia o link para redefinir a senha
    public void enviarEmailRedefinicao(
            String destinatario,
            String nome,
            String token) {

        String link = frontendUrl
                + "/redefinir-senha.html?token="
                + token
                + "&recuperacao=1";

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setFrom(emailSistema);
        mensagem.setTo(destinatario);
        mensagem.setSubject("SIA - Redefinição de senha");

        mensagem.setText(
                "Olá, " + nome + "!\n\n"
                        + "Recebemos uma solicitação para redefinir sua senha no SIA.\n\n"
                        + "Clique no link abaixo para criar uma nova senha:\n\n"
                        + link
                        + "\n\nEste link é válido por 30 minutos."
                        + "\n\nSe você não solicitou essa alteração, ignore este e-mail."
                        + "\n\nSIA - Sistema de Almoxarifado");

        mailSender.send(mensagem);
    }
}