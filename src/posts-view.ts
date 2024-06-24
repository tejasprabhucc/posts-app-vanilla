import "./style.css";
import "./posts.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <section>
      <nav>
        <button>Previous</button>
        <h2>Post Title</h2>
        <button>Next</button>
      </nav>
      <p class="post-desc">Post description</p>
    </section>
    <section>
      <button>View Comments</button>
      <p class="comments">Comments of current post.</p>
    </section>
  </div>
`;
