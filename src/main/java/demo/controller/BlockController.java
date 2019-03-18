package demo.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import demo.domain.Block;
import demo.service.BlockService;


/**
 * @author kimhj
 *
 */
@Controller
@RequestMapping("/")
public class BlockController {

	@Value("${server.url}")
	private String serverUrl;
	@Value("${map.url}")
	private String mapUrl;

	@Autowired
	BlockService blockService;

	@RequestMapping(value="main")
	public String index(HttpServletRequest request, Model model) {

		model.addAttribute("serverUrl", serverUrl);
		model.addAttribute("mapUrl", mapUrl);
		return "/main";
	}

	@ResponseBody
	@PostMapping("block")
	public List<Block> getBlockInfoList(Block block) {
		List<Block> list = blockService.getBlockList(block);
		return list;
	}
}
