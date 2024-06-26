import { CommentsManager, PostsManager } from "./post-model";
import { Postcontroller } from "./post-controller";
import { PostsView } from "./posts-view";

const postView = new PostsView();
const postsManager = new PostsManager();
const commentsManager = new CommentsManager();
const postController = new Postcontroller(
  postView,
  postsManager,
  commentsManager
);
