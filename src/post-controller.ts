import { CommentsManager, Post, PostsManager } from "./post-model";
import { PostsView } from "./posts-view";

export class Postcontroller {
  constructor(postView: PostsView, postsManager: PostsManager, commentsManager: CommentsManager) {
    function handlePrevious(): void {
      postsManager.previousPost();
    }

    function handleNext(): void {
      postsManager.nextPost();
    }

    const handleViewComments = (): void =>{
      const currentPost: Post | undefined = postsManager.currentPost();
      if(currentPost){
        commentsManager.modelStatus = "pending";
        commentsManager.updateSubscriber();
        this.fetchComments(currentPost.id)
      .then((comments) => {
        commentsManager.setCommentsForPost(comments, currentPost.id);
      })
      .catch((err: unknown) => {
        commentsManager.modelStatus = "failure";
        commentsManager.updateSubscriber();
      });
      }
    }

    postsManager.subscribe(postView);
    commentsManager.subscribe(postView);

    postView.nextButton?.addEventListener("click", handleNext);
    postView.prevButton?.addEventListener("click", handlePrevious);
    postView.viewCommentsButton?.addEventListener("click", handleViewComments);

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
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const posts = (await response.json()) as Post[];
      const delay = (timeout: number) =>
        new Promise((resolve) => setTimeout(resolve, timeout));
      await delay(3000);
      return posts;
    } catch (err: unknown) {
      throw new Error("Failed to fetch posts.");
    }
  }

  async fetchComments(postId: number): Promise<Comment[]> {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
      const comments = (await response.json()) as Comment[];
      return comments;
    } catch (err: unknown) {
      throw new Error("Failed to fetch comments.");
    }
  }
}


