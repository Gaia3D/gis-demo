package hhi.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import hhi.domain.Block;

/**
 * @author kimhj
 *
 */
@Repository
public interface BlockMapper {

	/** 블록 목록 조회 - geometry **/
	List<Block> getBlockFromGeometry(Block block);

	/** 블록 목록 조회 - text **/
	List<Block> getBlockFromText(Block block);
}
