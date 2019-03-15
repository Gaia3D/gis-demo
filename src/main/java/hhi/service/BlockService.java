package hhi.service;

import java.util.List;

import hhi.domain.Block;


/**
 * @author kimhj
 *
 */
public interface BlockService {
	/** 블록 목록 조회  **/
	List<Block> getBlockList(Block block);
}
