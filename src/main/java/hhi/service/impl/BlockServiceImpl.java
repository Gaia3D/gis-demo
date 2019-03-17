package hhi.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hhi.domain.Block;
import hhi.persistence.BlockMapper;
import hhi.service.BlockService;


/**
 * @author kimhj
 *
 */
@Service
public class BlockServiceImpl implements BlockService {

	@Autowired
	BlockMapper blockMapper;

	/** 블록 목록 조회  **/
	@Transactional(readOnly=true)
	public List<Block> getBlockList(Block block) {
		List<Block> list = null;
		list = blockMapper.getBlockList(block);
		return list;
	}
}
