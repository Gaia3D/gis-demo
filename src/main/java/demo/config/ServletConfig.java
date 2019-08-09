package demo.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ComponentScan(basePackages={"demo.config, demo.controller"},
				includeFilters={
					@Filter(type=FilterType.ANNOTATION, value=Component.class),
					@Filter(type=FilterType.ANNOTATION, value=Controller.class),
					@Filter(type=FilterType.ANNOTATION, value=RestController.class)})
public class ServletConfig implements WebMvcConfigurer {

	/**
	 * Cross-Origin Resouces Sharing
	 * @return
	 */
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedMethods("GET", "POST", "PUT", "DELETE").allowedOrigins("*")
			.allowedHeaders("*");
	}
}
