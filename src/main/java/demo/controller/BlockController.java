package demo.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import demo.domain.Block;
import demo.service.BlockService;


/**
 * @author kimhj
 *
 */
@Controller
@RequestMapping("/")
public class BlockController {
	@Autowired
	BlockService blockService;

	@GetMapping(value="/")
	public ModelAndView index(HttpServletRequest request, Model model) {
		model.addAttribute("data", "");
		return new ModelAndView("/index");
	}

	@GetMapping("block")
	public ResponseEntity<?> getBlockInfoList(Block block) {
		List<Block> list = blockService.getBlockList(block);
		return new ResponseEntity<>(list, HttpStatus.OK);
	}
}
