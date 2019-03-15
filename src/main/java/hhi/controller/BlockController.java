package hhi.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import hhi.domain.Block;
import hhi.service.BlockService;


/**
 * @author kimhj
 *
 */
@Controller
@RequestMapping("/")
public class BlockController {

	@Autowired
	BlockService blockService;

	@RequestMapping(value="main")
	public String index(HttpServletRequest request, Model model) {
		return "/main";
	}

	@ResponseBody
	@PostMapping("block")
	public List<Block> getBlockInfoList(Block block) {
		System.out.println("aa");
		List<Block> list = blockService.getBlockList(block);
		System.out.println("bb");
		return list;
	}
}
