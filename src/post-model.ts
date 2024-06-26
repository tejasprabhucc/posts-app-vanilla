import { ModelStatus } from "./model-status";
import { Publisher } from "./pub-sub";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface PostsModel {
  setPosts: (posts: Post[]) => void;
  getPosts: () => Post[];
  posts: Post[];
  currentPostIndex: number;
  currentPost: () => Post | undefined;
}

export interface CommentsModel {
  commentsMap: Map<number, Comment[]>;
  setCommentsForPost: (comment: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
}

export class PostsManager extends Publisher implements PostsModel {
  public currentPostIndex: number = 0;
  public posts: Post[] = [];
  modelStatus: ModelStatus = new ModelStatus();

  previousPost(): void {
    if (this.currentPostIndex === 0) {
      this.currentPostIndex = this.posts.length - 1;
    } else {
      this.currentPostIndex--;
    }
    this.updateSubscriber();
  }

  nextPost(): void {
    if (this.currentPostIndex === this.posts.length - 1) {
      this.currentPostIndex = 0;
    } else {
      this.currentPostIndex++;
    }
    this.updateSubscriber();
  }

  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }

  setPosts(posts: Post[]) {
    this.posts = posts;
    this.modelStatus.setModelStatus("available");
    this.updateSubscriber();
  }

  getPosts() {
    return this.posts;
  }
}

export class CommentsManager extends Publisher implements CommentsModel {
  public commentsMap: Map<number, Comment[]> = new Map();
  modelStatus: ModelStatus = new ModelStatus();

  setCommentsForPost(comments: Comment[], postId: number) {
    this.commentsMap.set(postId, comments);
    this.modelStatus.setModelStatus("available");
    this.updateSubscriber();
  }

  getCommentsForPost(postId: number) {
    return this.commentsMap.get(postId);
  }
}
