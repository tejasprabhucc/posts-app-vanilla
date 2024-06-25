import "./style.css";
import "./posts.css";

import { PostsManager, Publisher, Subscriber } from "./post-model";

export class PostsView implements Subscriber {
  postTitleElement: HTMLHeadingElement | null = null;
  postDescription: HTMLParagraphElement | null = null;
  prevButton: HTMLButtonElement | null = null;
  nextButton: HTMLButtonElement | null = null;
  constructor() {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
  <section>
  <nav>
    <button data-testId="prevButton">Previous</button>
    <h2 data-testId="postTitle">Post title</h2>
    <button data-testId="nextButton">Next</button>
  </nav>
  <article data-testId="postDesc" class="post-desc">Post Description</article>
    </section>
  <section class="comment-section">
  <button>View Comments </button>
  <p class="comment"> Comments of current post go here </p>
  </section>
  </div>
`;

    this.postDescription = document.querySelector('[data-testId="postDesc"]');
    this.postTitleElement = document.querySelector('[data-testId="postTitle"]');
    this.prevButton = document.querySelector('[data-testId="prevButton"]');
    this.nextButton = document.querySelector('[data-testId="nextButton"]');

    console.assert(!!this.postDescription);
    console.assert(!!this.postTitleElement);
    console.assert(!!this.prevButton);
    console.assert(!!this.nextButton);
  }

  update(manager: Publisher): void {
    if (manager instanceof PostsManager) {
      switch (manager.getModelStatus()) {
        case "pending": {
          console.log("Pending");
          if (this.postTitleElement) {
            this.postTitleElement.textContent = "Loading...";
          }
          if (this.postDescription) {
            this.postDescription.textContent = "Loading...";
          }
          break;
        }
        case "available":
          console.log("available");
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
  }
}
