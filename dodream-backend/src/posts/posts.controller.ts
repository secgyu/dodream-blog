import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: '게시글 생성 (로그인 필요)' })
  @ApiResponse({ status: 201, description: '게시글 생성 성공' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 게시글 조회' })
  @ApiResponse({ status: 200, description: '게시글 목록 반환' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get('categories')
  @ApiOperation({ summary: '모든 카테고리 조회' })
  @ApiResponse({ status: 200, description: '카테고리 목록 반환' })
  findAllCategories() {
    return this.postsService.findAllCategories();
  }

  @Get('tags')
  @ApiOperation({ summary: '모든 태그 조회' })
  @ApiResponse({ status: 200, description: '태그 목록 반환' })
  findAllTags() {
    return this.postsService.findAllTags();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'slug로 게시글 조회' })
  @ApiResponse({ status: 200, description: '게시글 반환' })
  @ApiResponse({ status: 404, description: '게시글 없음' })
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 게시글 조회' })
  @ApiResponse({ status: 200, description: '게시글 반환' })
  @ApiResponse({ status: 404, description: '게시글 없음' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: '게시글 수정 (로그인 필요)' })
  @ApiResponse({ status: 200, description: '게시글 수정 성공' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 404, description: '게시글 없음' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '게시글 삭제 (로그인 필요)' })
  @ApiResponse({ status: 204, description: '게시글 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 404, description: '게시글 없음' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
