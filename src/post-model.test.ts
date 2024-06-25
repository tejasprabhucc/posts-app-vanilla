import {
  type Post,
  type Comment,
  PostsManager,
  PostsModel,
  Subscriber,
  Publisher,
} from "./post-model";

const testPosts: Post[] = [
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  },
  {
    userId: 1,
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
  },
  {
    userId: 1,
    id: 4,
    title: "eum et est occaecati",
    body: "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit",
  },
  {
    userId: 1,
    id: 5,
    title: "nesciunt quas odio",
    body: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque",
  },
];

describe("Model layer tests", () => {
  test("posts data layer tests", () => {
    const postsManager = new PostsManager();
    expect(postsManager).toBeDefined();
    expect(postsManager.currentPostIndex).toBe(0);

    postsManager.posts = testPosts;
    expect(postsManager.posts).toBe(testPosts);
    postsManager.currentPostIndex = 2;
    expect(postsManager.currentPost()).toBe(testPosts[2]);
  });
});

class DummyView implements Subscriber {
  update(publisher: Publisher): void {
    console.log("Update called");
  }
}

describe("Pub sub testing", () => {
  test("Update subscriber", () => {
    const postsManager = new PostsManager();
    postsManager.posts = testPosts;
    expect(postsManager).toBeDefined();
    expect(postsManager.currentPostIndex).toBe(0);

    const dummyView = new DummyView();
    postsManager.subscribe(dummyView);
    postsManager.setPosts(testPosts);

    const dummyView2 = new DummyView();
    postsManager.subscribe(dummyView2);

    const spy = vi.spyOn(dummyView, "update");
    const spy2 = vi.spyOn(dummyView2, "update");
    expect(spy.getMockName()).toEqual("update");
    expect(spy2.getMockName()).toEqual("update");
  });
});
