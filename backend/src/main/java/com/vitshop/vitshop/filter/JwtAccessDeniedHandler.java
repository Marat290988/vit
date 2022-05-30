package com.vitshop.vitshop.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vitshop.vitshop.domain.HttpResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
    private final String ACCESS_DENIED_MESSAGE = "You do not have permission to access this page";

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException, ServletException {
        HttpResponse httpResponse = new HttpResponse(
                HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED,
                HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                ACCESS_DENIED_MESSAGE
        );
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.FORBIDDEN.value());
        OutputStream outputStream = response.getOutputStream();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(outputStream, httpResponse);
        outputStream.flush();
    }
}
