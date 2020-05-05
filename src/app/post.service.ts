import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Post } from "./post.model";
import { catchError, map } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PostService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(postData: Post) {
    console.log("creating post", postData.title, postData.content);
    this.http
      .post<{ name: string }>(
        "https://ng-complete-guide-6706f.firebaseio.com/posts.json",
        postData
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message)
        }
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        "https://ng-complete-guide-6706f.firebaseio.com/posts.json",
        {
          headers: new HttpHeaders({
            "Custom-Header": 'Hello'
          })
        }
      )
      .pipe(
        map((responseData) => {
          console.log("responseData:", responseData);
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError(errorRes => {
          // send to analytics server
          // handle in code
          return throwError(errorRes);
        })
      );
  }

  deleteAllPosts() {
    return this.http.delete(
      "https://ng-complete-guide-6706f.firebaseio.com/posts.json"
    );
  }

  deleteSinglePost(post: Post) {
    return this.http.delete(
      `https://ng-complete-guide-6706f.firebaseio.com/posts/${post.id}.json`
    );
  }
}
