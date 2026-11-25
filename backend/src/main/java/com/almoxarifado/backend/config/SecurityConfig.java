
package com.almoxarifado.backend.config;

import java.util.Base64;
import java.util.List;
import com.almoxarifado.backend.repository.UsuarioRepository;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.JwtValidators;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import jakarta.servlet.DispatcherType;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// Configura a segurança da aplicação
@Configuration
public class SecurityConfig {

        @Value("${jwt.secret}")
        private String jwtSecret;

        // Protege e verifica as senhas
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        // Chave usada no JWT
        private SecretKey secretKey() {

                byte[] chave = Base64.getDecoder()
                                .decode(jwtSecret);

                return new SecretKeySpec(
                                chave,
                                "HmacSHA256");
        }

        // Gera tokens JWT
        @Bean
        public JwtEncoder jwtEncoder() {

                return NimbusJwtEncoder
                                .withSecretKey(secretKey())
                                .build();
        }

        // Valida tokens JWT
        @Bean
        public JwtDecoder jwtDecoder(UsuarioRepository usuarioRepository) {

                NimbusJwtDecoder decoder = NimbusJwtDecoder
                                .withSecretKey(secretKey())
                                .build();

                decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                                JwtValidators.createDefaultWithIssuer("sia-backend"),
                                jwt -> {
                                        Object id = jwt.getClaims().get("id");
                                        if (id instanceof Number numero
                                                        && usuarioRepository.findById(numero.longValue())
                                                                        .filter(usuario -> Boolean.TRUE.equals(usuario.getAtivo()))
                                                                        .filter(usuario -> usuario.getPerfil() != null
                                                                                        && usuario.getPerfil().equals(jwt.getClaimAsString("perfil")))
                                                                        .filter(usuario -> usuario.getEmail() != null
                                                                                        && usuario.getEmail().equals(jwt.getSubject()))
                                                                        .isPresent()) {
                                                return OAuth2TokenValidatorResult.success();
                                        }

                                        return OAuth2TokenValidatorResult.failure(new OAuth2Error(
                                                        "invalid_token", "Sessão inválida. Realize um novo login.", null));
                                }));

                return decoder;
        }

        // Define as regras de acesso
        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http)
                        throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .cors(Customizer.withDefaults())

                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(
                                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // Permite o tratamento interno dos erros
                                                .dispatcherTypeMatchers(DispatcherType.ERROR)
                                                .permitAll()

                                                // Rotas públicas
                                                .requestMatchers(
                                                                "/auth/login",
                                                                "/auth/esqueci-senha",
                                                                "/auth/redefinir-senha",
                                                                "/error")
                                                .permitAll()

                                                // Demais rotas exigem autenticação
                                                .anyRequest()
                                                .authenticated())

                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt(Customizer.withDefaults()));

                return http.build();
        }

        // Define os endereços autorizados a acessar a API
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                                List.of(
                                                "http://127.0.0.1:5500",
                                                "http://localhost:5500",
                                                "http://10.227.77.165:5500",
                                                "http://localhost:8081",
                                                "http://127.0.0.1:8081",
                                                "https://sia-web.up.railway.app",
                                                "https://zesty-growth-production-1db9.up.railway.app"));

                configuration.setAllowedMethods(
                                List.of(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "DELETE",
                                                "OPTIONS"));

                configuration.setAllowedHeaders(
                                List.of(
                                                "Authorization",
                                                "Content-Type"));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }
}
