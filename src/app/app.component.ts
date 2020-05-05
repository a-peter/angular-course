import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subscription } from 'rxjs';

import { Post } from "./post.model";
import { PostService } from "./post.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe(message => {
      this.error = message;
    })
    this.fetchPosts();
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  onCreatePost(postData: Post) {
    this.postService.createAndStorePost(postData);
    // this.fetchPosts();
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    // this.loadedPosts.forEach((post) => {
    //   console.log(post.id);
    //   this.postService.deleteSinglePost(post).subscribe((responseData) => {
    //     console.log('deleted', post.id);
    //     console.log(responseData);
    //   });
    // });
    // this.fetchPosts();

    // if (this.loadedPosts.length > 0) {
    //   this.postService.deleteSinglePost(this.loadedPosts[0]);
    //   this.fetchPosts();
    // }

    this.postService.deleteAllPosts().subscribe((responseData) => {
      console.log("deleted all posts", responseData);
      this.fetchPosts();
    });
  }

  onCreateDummyData() {
    const r = Math.floor(Math.random() * 100);
    let post1: Post = {
      title: `test ${r}`,
      content: `This is a test with number ${r}`,
    };
    this.postService.createAndStorePost(post1);
    this.fetchPosts();
  }

  private fetchPosts() {
    this.isFetching = true;
    this.error = null;
    setTimeout(() => {
      this.postService.fetchPosts().subscribe(
        (posts) => {
          this.isFetching = false;
          this.loadedPosts = posts;
          console.log("loadedPosts", this.loadedPosts);
        },
        (error) => {
          this.error = error.message;
          this.isFetching = false;
          console.log(error);
        }
      );
    }, 500);
  }

  onHandleError() {
    this.error = null;
  }
}
