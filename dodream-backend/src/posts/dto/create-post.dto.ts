import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'my-first-post', description: 'URL용 슬러그' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  slug: string;

  @ApiProperty({ example: '첫 번째 글', description: '게시글 제목' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: '글 요약입니다...', description: '게시글 요약' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  excerpt: string;

  @ApiProperty({ example: '# 본문 내용', description: '마크다운 본문' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '홍길동', description: '작성자' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: '프론트엔드', description: '카테고리' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: '웹', description: '서브 카테고리', required: false })
  @IsString()
  @IsOptional()
  subCategory?: string;

  @ApiProperty({ example: ['React', 'TypeScript'], description: '태그 목록' })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
