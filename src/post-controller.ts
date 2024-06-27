import { CommentsManager, Post, PostsManager, Comment } from "./post-model";
import { PostsView } from "./posts-view";

export class Postcontroller {
  constructor(
    postView: PostsView,
    postsManager: PostsManager,
    commentsManager: CommentsManager
  ) {
    function handlePrevious(): void {
      commentsManager.unSubscribe(postView);
      postsManager.previousPost();
    }

    function handleNext(): void {
      commentsManager.unSubscribe(postView);
      postsManager.nextPost();
    }

    const handleViewComments = (): void => {
      commentsManager.subscribe(postView);
      const currentPost: Post | undefined = postsManager.currentPost();
      if (currentPost) {
        const currentPostId = currentPost.id;
        if (commentsManager.getCommentsForPost(currentPostId)) {
          commentsManager.updateSubscriber();
        } else {
          commentsManager.modelStatus.setModelStatus("pending");
          this.fetchComments(currentPost.id)
            .then((comments) => {
              console.log("Comments", comments);
              commentsManager.setCommentsForPost(comments, currentPost.id);
            })
            .catch((err: Error) => {
              commentsManager.modelStatus.setModelStatus("failure");
              console.error(err.message);
            });
        }
      }
    };

    postsManager.subscribe(postView);
    commentsManager.subscribe(postView);

    postView.nextButton?.addEventListener("click", handleNext);
    postView.prevButton?.addEventListener("click", handlePrevious);
    postView.viewCommentsButton?.addEventListener("click", handleViewComments);

    postsManager.modelStatus.setModelStatus("pending");
    postsManager.updateSubscriber();
    this.fetchPost()
      .then((posts) => {
        postsManager.setPosts(posts);
      })
      .catch((err: Error) => {
        postsManager.modelStatus.setModelStatus("failure");
        console.error(err.message);
      });
  }

  async fetchPost(): Promise<Post[]> {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const posts = (await response.json()) as Post[];
      const delay = (timeout: number) =>
        new Promise((resolve) => setTimeout(resolve, timeout));
      await delay(2000);
      return posts;
    } catch (err: unknown) {
      throw new Error("Failed to fetch posts.");
    }
  }

  async fetchComments(postId: number): Promise<Comment[]> {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      const comments = (await response.json()) as Comment[];
      const delay = (timeout: number) =>
        new Promise((resolve) => setTimeout(resolve, timeout));
      await delay(2000);
      return comments;
    } catch (err: unknown) {
      throw new Error("Failed to fetch comments.");
    }
  }
}
