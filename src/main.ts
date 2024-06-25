import { PostsManager } from "./post-model";
import { Post } from "./post-model";
import { Postcontroller } from "./post-controller";
import { PostsView } from "./posts-view";

const postView = new PostsView();
const postsManager = new PostsManager();
const postController = new Postcontroller(postView, postsManager);

// postsManager.subscribe(postView);
// postsManager.setPosts(testPosts);
