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
  posts: Post[];
  currentPostIndex: number;
  currentPost: () => Post | undefined;
}

export interface CommentsModel {
  commentsMap: Map<number, Comment[]>;
  setCommentsForPost: (comment: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
}

export class PostsManager implements PostsModel {
  public currentPostIndex: number = 0;
  public posts: Post[] = [];

  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }
}

export class CommentsManager implements CommentsModel {
  commentsMap: Map<number, Comment[]> = new Map();

  setCommentsForPost(comments: Comment[], postId: number) {
    this.commentsMap.set(postId, comments);
  }

  getCommentsForPost(postId: number) {
    return this.commentsMap.get(postId);
  }
}
