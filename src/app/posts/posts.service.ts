import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postsData) => {
          return postsData.posts.map((post: any) => ({
            id: post._id,
            title: post.title,
            content: post.content,
          }));
        })
      )

      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{
      _id: string | undefined;
      title: string | undefined;
      content: string | undefined;
    }>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(post: Omit<Post, 'id'>) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    // postData.append('image', post);
    this.httpClient
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((response) => {
        const id = response.postId;
        this.posts.push({ id: id, title: post.title, content: post.content });
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.httpClient
      .patch(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe((updatedPost) => {
        console.log('updatedResult', updatedPost);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.httpClient
      .delete(`http://localhost:3000/api/posts/${id}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
