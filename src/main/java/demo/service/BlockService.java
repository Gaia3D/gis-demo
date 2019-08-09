package demo.service;

import java.util.List;

import demo.domain.Block;


/**
 * @author kimhj
 *
 */
public interface BlockService {
	
	/** 블록 목록 조회  **/
	List<Block> getBlockList(Block block);
}
