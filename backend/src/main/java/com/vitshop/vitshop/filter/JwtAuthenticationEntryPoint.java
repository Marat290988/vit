package com.vitshop.vitshop.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vitshop.vitshop.domain.HttpResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Component
public class JwtAuthenticationEntryPoint extends Http403ForbiddenEntryPoint {
    public final String FORBIDDEN_MESSAGE = "You need to log in to access this page";

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception
    ) throws IOException {
        HttpResponse httpResponse = new HttpResponse(
                HttpStatus.FORBIDDEN.value(),
                HttpStatus.FORBIDDEN,
                HttpStatus.FORBIDDEN.getReasonPhrase(),
                FORBIDDEN_MESSAGE
        );
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.FORBIDDEN.value());
        OutputStream outputStream = response.getOutputStream();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(outputStream, httpResponse);
        outputStream.flush();
    }
}
