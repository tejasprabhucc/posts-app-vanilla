import { CommentsManager } from "./post-model";
import { PostsView } from "./posts-view";

export class CommentController {
  constructor(postView: PostsView, commentsManager: CommentsManager) {
    const handleViewComments = (): void => {
      const currentPost: Post | undefined = postsManager.currentPost();
      if (currentPost) {
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
    };

    commentsManager.subscribe(postView);
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

  async fetchComments(postId: number): Promise<Comment[]> {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      const comments = (await response.json()) as Comment[];
      return comments;
    } catch (err: unknown) {
      throw new Error("Failed to fetch comments.");
    }
  }
}
