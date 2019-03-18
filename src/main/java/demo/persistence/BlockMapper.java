package demo.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import demo.domain.Block;

/**
 * @author kimhj
 *
 */
@Repository
public interface BlockMapper {

	/** 블록 목록 조회 **/
	List<Block> getBlockList(Block block);
}
