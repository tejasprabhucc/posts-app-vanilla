import { Post, PostsManager } from "./post-model";
import { PostsView } from "./posts-view";

export class Postcontroller {
  constructor(postView: PostsView, postsManager: PostsManager) {
    function handlePrevious(): void {
      postsManager.previousPost();
    }

    function handleNext(): void {
      postsManager.nextPost();
    }

    postsManager.subscribe(postView);

    postView.nextButton?.addEventListener("click", handleNext);
    postView.prevButton?.addEventListener("click", handlePrevious);

    postsManager.modelStatus = "pending";
    postsManager.updateSubscriber();
    this.fetchPost()
      .then((posts) => {
        postsManager.setPosts(posts);
      })
      .catch((err: unknown) => {
        postsManager.modelStatus = "failure";
        postsManager.updateSubscriber();
      });
  }

  async fetchPost(): Promise<Post[]> {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com");
      const posts = (await response.json()) as Post[];
      const delay = (timeout: number) =>
        new Promise((resolve) => setTimeout(resolve, timeout));
      await delay(3000);
      return posts;
    } catch (err: unknown) {
      throw new Error("Failed to fetch posts.");
    }
  }
}
