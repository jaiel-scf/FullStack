
package com.almoxarifado.backend.service;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImagemService {

    private static final long TAMANHO_MAXIMO = 5 * 1024 * 1024;
    private static final int TAMANHO_MAXIMO_IMAGEM = 1200;

    @Value("${app.upload.dir:uploads/produtos}")
    private String diretorio;

    public String salvar(MultipartFile arquivo) throws IOException {

        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Selecione uma imagem.");
        }

        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new IllegalArgumentException("A imagem deve ter no máximo 5 MB.");
        }

        String formato = identificarFormato(arquivo);

        if (formato == null) {
            throw new IllegalArgumentException(
                    "Formato não permitido. Utilize JPG, PNG, GIF ou BMP.");
        }

        BufferedImage imagem;

        try (var entrada = arquivo.getInputStream()) {
            imagem = ImageIO.read(entrada);
        }

        if (imagem == null) {
            throw new IllegalArgumentException("Arquivo de imagem inválido.");
        }

        int largura = imagem.getWidth();
        int altura = imagem.getHeight();

        double escala = Math.min(
                1.0,
                (double) TAMANHO_MAXIMO_IMAGEM / Math.max(largura, altura));

        int novaLargura = Math.max(1, (int) (largura * escala));
        int novaAltura = Math.max(1, (int) (altura * escala));

        BufferedImage redimensionada = new BufferedImage(
                novaLargura,
                novaAltura,
                formato.equals("jpg")
                        ? BufferedImage.TYPE_INT_RGB
                        : BufferedImage.TYPE_INT_ARGB);

        Graphics2D graphics = redimensionada.createGraphics();

        graphics.setRenderingHint(
                RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BILINEAR);

        graphics.setRenderingHint(
                RenderingHints.KEY_RENDERING,
                RenderingHints.VALUE_RENDER_QUALITY);

        graphics.drawImage(imagem, 0, 0, novaLargura, novaAltura, null);
        graphics.dispose();

        ByteArrayOutputStream saida = new ByteArrayOutputStream();

        if (!ImageIO.write(redimensionada, formato, saida)) {
            throw new IOException("Não foi possível processar a imagem.");
        }

        Path pasta = obterPasta();
        Files.createDirectories(pasta);

        String nomeArquivo = UUID.randomUUID() + "." + formato;
        Path destino = pasta.resolve(nomeArquivo);

        Files.write(destino, saida.toByteArray());

        return diretorio.replace("\\", "/") + "/" + nomeArquivo;
    }

    public byte[] carregar(String caminho) throws IOException {

        Path arquivo = resolverCaminho(caminho);

        if (!Files.isRegularFile(arquivo)) {
            throw new IOException("Imagem não encontrada.");
        }

        return Files.readAllBytes(arquivo);
    }

    public String obterTipoConteudo(String caminho) {

        String nome = resolverCaminho(caminho)
                .getFileName()
                .toString()
                .toLowerCase();

        if (nome.endsWith(".jpg") || nome.endsWith(".jpeg")) {
            return "image/jpeg";
        }

        if (nome.endsWith(".png")) {
            return "image/png";
        }

        throw new IllegalArgumentException("Formato de imagem inválido.");
    }

    public void excluir(String caminho) throws IOException {

        if (caminho == null || caminho.isBlank()) {
            return;
        }

        Files.deleteIfExists(resolverCaminho(caminho));
    }

    private Path obterPasta() {
        return Paths.get(diretorio).toAbsolutePath().normalize();
    }

    private Path resolverCaminho(String caminho) {

        if (caminho == null || caminho.isBlank()) {
            throw new IllegalArgumentException("Caminho de imagem inválido.");
        }

        Path arquivoInformado = Paths.get(caminho);

        if (arquivoInformado.isAbsolute()) {
            throw new IllegalArgumentException("Caminho de imagem inválido.");
        }

        Path arquivo = Paths.get("").toAbsolutePath()
                .resolve(arquivoInformado)
                .normalize();

        if (!arquivo.startsWith(obterPasta())) {
            throw new IllegalArgumentException("Caminho de imagem inválido.");
        }

        return arquivo;
    }

    private String identificarFormato(MultipartFile arquivo) {

        String tipo = arquivo.getContentType();

        if (tipo == null) {
            return null;
        }

        if ("image/jpeg".equalsIgnoreCase(tipo)) {
            return "jpg";
        }

        if ("image/png".equalsIgnoreCase(tipo)
                || "image/gif".equalsIgnoreCase(tipo)
                || "image/bmp".equalsIgnoreCase(tipo)
                || "image/x-ms-bmp".equalsIgnoreCase(tipo)) {
            return "png";
        }

        return null;
    }
}
