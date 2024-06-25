import "./style.css";
import "./posts.css";

import { CommentsManager, PostsManager, Publisher, Subscriber } from "./post-model";

export class PostsView implements Subscriber {
  postTitleElement: HTMLHeadingElement | null = null;
  postDescription: HTMLParagraphElement | null = null;
  prevButton: HTMLButtonElement | null = null;
  nextButton: HTMLButtonElement | null = null;
  viewCommentsButton: HTMLButtonElement | null = null;
  comments: HTMLUListElement | null = null;

  constructor() {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
  <section>
  <nav>
    <button data-test="prevButton">Previous</button>
    <h2 data-test="postTitle">Post title</h2>
    <button data-test="nextButton">Next</button>
  </nav>
  <article data-test="postDesc" class="post-desc">Post Description</article>
    </section>
  <section class="comment-section">
  <button data-test="viewComments">View Comments </button>
  <ul class="comment" data-test="comments"> 
    <li>Comments of current post go here</li>
  </ul>
  </section>
  </div>
`;

this.postTitleElement = document.querySelector('[data-test="postTitle"]');
    this.postDescription = document.querySelector('[data-test="postDesc"]');
    this.prevButton = document.querySelector('[data-test="prevButton"]');
    this.nextButton = document.querySelector('[data-test="nextButton"]');
    this.viewCommentsButton = document.querySelector('[data-test="viewComments"]');
    this.comments = document.querySelector('[data-test="nextButton"]');

    console.assert(this.postDescription !== null);
    console.assert(this.postTitleElement !== null);
    console.assert(this.prevButton !== null);
    console.assert(this.nextButton !== null);
  }

  update(manager: Publisher): void {
    if (manager instanceof PostsManager) {
      switch (manager.getModelStatus()) {
        case "pending": {
          if (this.postTitleElement) {
            this.postTitleElement.textContent = "Loading...";
          }
          if (this.postDescription) {
            this.postDescription.textContent = "Loading...";
          }
          break;
        }
        case "available":
          const post = manager.currentPost();
          if (this.postTitleElement) {
            this.postTitleElement.textContent =
              post?.title ?? "title is missing";
          }
          if (this.postDescription) {
            this.postDescription.textContent = post?.body ?? "body is missing";
          }
          break;
        case "failure":
          if (this.postTitleElement) {
            this.postTitleElement.textContent = "Failed to fetch ";
          }
          if (this.postDescription) {
            this.postDescription.textContent = "Failed to fetch";
          }
          break;
      }
    }

    if(manager instanceof CommentsManager){
      const comments = manager.getCommentsForPost();
      console.log('comments');
    }
  }
}
