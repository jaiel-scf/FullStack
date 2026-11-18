package com.almoxarifado.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
public class EmailService {

    private final HttpClient httpClient;

    @Value("${sia.email.api-url}")
    private String apiUrl;

    @Value("${sia.email.api-key}")
    private String apiKey;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService() {
        this.httpClient = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NEVER)
                .connectTimeout(Duration.ofSeconds(15))
                .build();
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

        String assunto = "SIA - Redefinição de senha";

        String mensagem = "Olá, " + nome + "!\n\n"
                + "Recebemos uma solicitação para redefinir sua senha no SIA.\n\n"
                + "Clique no link abaixo para criar uma nova senha:\n\n"
                + link
                + "\n\nEste link é válido por 30 minutos."
                + "\n\nSe você não solicitou essa alteração, ignore este e-mail."
                + "\n\nSIA - Sistema de Almoxarifado";

        String corpoJson = "{"
                + "\"apiKey\":" + jsonString(apiKey) + ","
                + "\"destinatario\":" + jsonString(destinatario) + ","
                + "\"assunto\":" + jsonString(assunto) + ","
                + "\"mensagem\":" + jsonString(mensagem)
                + "}";

        try {
            HttpRequest requisicao = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(
                            corpoJson, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> resposta = httpClient.send(
                    requisicao,
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            // O Google Apps Script pode redirecionar a resposta.
            if (resposta.statusCode() >= 300
                    && resposta.statusCode() < 400) {

                String localizacao = resposta.headers()
                        .firstValue("Location")
                        .orElseThrow(() -> new IllegalStateException(
                                "O Google não informou o endereço de redirecionamento."));

                HttpRequest requisicaoFinal = HttpRequest.newBuilder()
                        .uri(URI.create(localizacao))
                        .timeout(Duration.ofSeconds(30))
                        .GET()
                        .build();

                resposta = httpClient.send(
                        requisicaoFinal,
                        HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            }

            if (resposta.statusCode() < 200
                    || resposta.statusCode() >= 300
                    || !resposta.body().contains("\"sucesso\":true")) {

                throw new IllegalStateException(
                        "O serviço de e-mail não confirmou o envio. HTTP "
                                + resposta.statusCode());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "O envio do e-mail foi interrompido.", e);

        } catch (IOException | IllegalArgumentException e) {
            throw new IllegalStateException(
                    "Não foi possível comunicar com o serviço de e-mail.", e);
        }
    }

    // Converte textos para o formato seguro de uma string JSON
    private String jsonString(String valor) {
        if (valor == null) {
            return "null";
        }

        StringBuilder resultado = new StringBuilder("\"");

        for (char caractere : valor.toCharArray()) {
            switch (caractere) {
                case '"':
                    resultado.append("\\\"");
                    break;
                case '\\':
                    resultado.append("\\\\");
                    break;
                case '\n':
                    resultado.append("\\n");
                    break;
                case '\r':
                    resultado.append("\\r");
                    break;
                case '\t':
                    resultado.append("\\t");
                    break;
                default:
                    if (caractere < 0x20) {
                        resultado.append(String.format("\\u%04x", (int) caractere));
                    } else {
                        resultado.append(caractere);
                    }
            }
        }

        return resultado.append('"').toString();
    }
}
