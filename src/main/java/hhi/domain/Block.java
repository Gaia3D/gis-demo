package hhi.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


/**
 * @author kimhj
 *
 */
@Getter
@Setter
@ToString
public class Block {
	private String blockId;
	private String jibunId;
	private String geom;
	private String blockType;
}
