import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId!: string | null;
  post:
    | {
        title: string | undefined;
        content: string | undefined;
        id: string | undefined;
      }
    | undefined;
  form!: FormGroup;
  imagePreview: string = '';

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId as string).subscribe((post) => {
          console.log('post', post);
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
          };
          this.form.setValue({
            title: this?.post?.title,
            content: this?.post?.content,
          });
        });
        console.log('post', this.post);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePick(event: Event) {
    if (event && event.target && (event.target as HTMLInputElement).files) {
      const file = (event.target as HTMLFormElement)?.['files'][0]!;
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSavePost() {
    if (this.form.invalid) return;

    if (this.mode === 'create') {
      const post: Omit<Post, 'id'> = {
        title: this.form.value.title,
        content: this.form.value.content,
      };
      this.postService.addPost(post);
    } else {
      this.postService.updatePost(
        this.postId as string,
        this.form.value.title,
        this.form.value.content
      );
    }

    this.form.reset();
  }
}
