
-- Table: public.block_geometry

-- DROP TABLE public.block_geometry;

CREATE TABLE public.block_geometry
(
  block_id character varying(10) NOT NULL, -- 블록ID
  jibun_id character varying(10), -- 지번ID
  geom geometry(Polygon,5187), -- 블록 공간정보
  location character varying(100), -- 블록 위치
  CONSTRAINT block_polygon_pkey PRIMARY KEY (block_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.block_geometry
  OWNER TO postgres;
COMMENT ON COLUMN public.block_geometry.block_id IS '블록ID';
COMMENT ON COLUMN public.block_geometry.jibun_id IS '지번ID';
COMMENT ON COLUMN public.block_geometry.geom IS '블록 공간정보';
COMMENT ON COLUMN public.block_geometry.location IS '블록 위치';


-- Table: public.block_text

-- DROP TABLE public.block_text;

CREATE TABLE public.block_text
(
  block_id character varying(10) NOT NULL, -- 블록ID
  jibun_id character varying(10), -- 지번ID
  geom character varying, -- 블록 좌표
  location character varying(100), -- 블록 위치
  CONSTRAINT block_text_pkey PRIMARY KEY (block_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.block_text
  OWNER TO postgres;
COMMENT ON COLUMN public.block_text.block_id IS '블록ID';
COMMENT ON COLUMN public.block_text.jibun_id IS '지번ID';
COMMENT ON COLUMN public.block_text.geom IS '블록 좌표';
COMMENT ON COLUMN public.block_text.location IS '블록 위치';

