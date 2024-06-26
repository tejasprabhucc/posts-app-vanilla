import "./style.css";
import "./posts.css";

import { CommentsManager, PostsManager } from "./post-model";
import { Publisher, Subscriber } from "./pub-sub";

export class PostsView implements Subscriber {
  constainer: HTMLDivElement | null = null;
  postNumber: HTMLParagraphElement | null = null;
  postTitleElement: HTMLHeadingElement | null = null;
  postDescription: HTMLParagraphElement | null = null;
  prevButton: HTMLButtonElement | null = null;
  nextButton: HTMLButtonElement | null = null;
  viewCommentsButton: HTMLButtonElement | null = null;
  commentsList: HTMLUListElement | null = null;

  constructor() {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <p class="postNumber" data-test="postNumber"></p>
    <section>
      <nav>
        <button data-test="prevButton">Previous</button>
        <h2 data-test="postTitle">Post title</h2>
        <button data-test="nextButton">Next</button>
      </nav>
      <p data-test="postDesc" class="post-desc">Post Description</p>
    </section>
    <section class="comment-section">
      <button data-test="viewComments">View Comments </button>
      <ul class="comments" data-test="comments"></ul>
    </section>
  </div>
`;
    this.constainer = document.querySelector(".container");
    this.postNumber = document.querySelector('[data-test="postNumber"]');
    this.postTitleElement = document.querySelector('[data-test="postTitle"]');
    this.postDescription = document.querySelector('[data-test="postDesc"]');
    this.prevButton = document.querySelector('[data-test="prevButton"]');
    this.nextButton = document.querySelector('[data-test="nextButton"]');
    this.viewCommentsButton = document.querySelector(
      '[data-test="viewComments"]'
    );
    this.commentsList = document.querySelector('[data-test="comments"]');

    console.assert(this.postDescription !== null);
    console.assert(this.postTitleElement !== null);
    console.assert(this.prevButton !== null);
    console.assert(this.nextButton !== null);
  }

  postId: number = 0;
  update(manager: Publisher): void {
    if (manager instanceof PostsManager) {
      if (this.prevButton) {
        this.prevButton.disabled = manager.currentPostIndex === 0;
      }
      if (this.nextButton) {
        this.nextButton.disabled =
          manager.currentPostIndex === manager.posts.length - 1;
      }
      if (this.commentsList) {
        this.commentsList.innerHTML = "";
      }
      const status = manager.modelStatus.getModelStatus();
      switch (status) {
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
          this.postId = manager.currentPostIndex + 1;
          if (this.postNumber) {
            this.postNumber.textContent = `Post ${
              manager.currentPostIndex + 1
            } of ${manager.posts.length}`;
          }
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

    if (manager instanceof CommentsManager) {
      const comments = manager.getCommentsForPost(this.postId);
      const status = manager.modelStatus.getModelStatus();
      switch (status) {
        case "pending": {
          if (this.commentsList) {
            this.commentsList.innerHTML = `<li><p>Loading...</p></li>`;
          }
          break;
        }
        case "available": {
          if (this.commentsList) {
            this.commentsList.innerHTML =
              comments
                ?.map((comment) => {
                  return `<li>
                  <p><b>${comment.name}</b></p>
                  <p>${comment.body}</p>
                </li>`;
                })
                .join("") ?? "";
          }
          break;
        }
        case "failure": {
          if (this.commentsList) {
            this.commentsList.innerHTML = `<li><p>Failed to fetch.</p></li>`;
          }
          break;
        }
      }
    }
  }
}
