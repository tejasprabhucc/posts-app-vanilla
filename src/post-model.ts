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

export type ModelStatus = "pending" | "available" | "failure";

export interface PostsModel {
  setPosts: (posts: Post[]) => void;
  getPosts: () => Post[];
  posts: Post[];
  currentPostIndex: number;
  currentPost: () => Post | undefined;
  setModelStatus: (status: ModelStatus) => void;
  getModelStatus: () => ModelStatus;
}

export interface CommentsModel {
  commentsMap: Map<number, Comment[]>;
  setCommentsForPost: (comment: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
}

export interface Subscriber {
  update: (publisher: Publisher) => void;
}

export interface Publisher {
  subscribers: Subscriber[];
  subscribe: (subscriber: Subscriber) => void;
  unSubscribe: (subscriber: Subscriber) => void;
  updateSubscriber: () => void;
}

export class PostsManager implements PostsModel, Publisher {
  public currentPostIndex: number = 0;
  public posts: Post[] = [];
  public subscribers: Subscriber[] = [];
  modelStatus: ModelStatus = "pending";

  previousPost(): void {
    if (this.currentPostIndex === 0) {
      this.currentPostIndex = this.posts.length - 1;
    } else {
      this.currentPostIndex--;
    }
    this.updateSubscriber();
  }

  nextPost(): void {
    if (this.currentPostIndex === this.posts.length) {
      this.currentPostIndex = 0;
    } else {
      this.currentPostIndex++;
    }
    this.updateSubscriber();
  }

  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }

  subscribe(subscriber: Subscriber) {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }

  unSubscribe(subscriber: Subscriber) {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  updateSubscriber() {
    this.subscribers.forEach((sub) => sub.update(this));
  }

  setPosts(posts: Post[]) {
    this.posts = posts;
    this.modelStatus = "available";
    this.updateSubscriber();
  }

  getPosts() {
    return this.posts;
  }

  setModelStatus(status: ModelStatus) {
    this.modelStatus = status;
  }

  getModelStatus() {
    return this.modelStatus;
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
