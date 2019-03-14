package hhi.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/")
public class HhiController {

	@RequestMapping(value="main")
	public String index(HttpServletRequest request, Model model) {
		return "/main";
	}
}
