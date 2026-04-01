import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { FiClock, FiEye, FiHeart, FiChevronLeft } from "react-icons/fi";
import { POSTS } from "../data/blogData";

export default function BlogPost() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const postFromState = location.state?.post;
  const post = postFromState || POSTS.find((p) => String(p.id) === String(id));

  if (!post) {
    return (
      <div style={{ padding: "100px 24px", background: "#080705", color: "#f5f0e8", minHeight: "70vh" }}>
        <p>Article not found.</p>
        <button onClick={() => navigate("/blog")} style={{ color: "#c8965a", background: "none", border: "1px solid #c8965a", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}>
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#080705", color: "#f5f0e8", padding: "80px 24px" }}>
      <button
        onClick={() => navigate("/blog")}
        style={{ marginBottom: "20px", color: "#c8965a", background: "none", border: "1px solid #c8965a", padding: "8px 12px", borderRadius: "999px", cursor: "pointer" }}
      >
        <FiChevronLeft /> Back to Blog
      </button>
      <article style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "18px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          <span style={{ color: post.tagColor, border: `1px solid ${post.tagColor}`, padding: "5px 10px", borderRadius: "999px", fontSize: "12px", textTransform: "uppercase" }}>{post.tag}</span>
          <span style={{ fontSize: "12px", color: "#b8b0a0" }}><FiClock /> {post.readTime}</span>
          <span style={{ fontSize: "12px", color: "#b8b0a0" }}><FiEye /> {post.views}</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(28px,6vw,42px)", lineHeight: 1.2 }}>{post.title}</h1>
        <p style={{ color: "#b8b0a0", marginBottom: "0" }}>{post.excerpt}</p>
        <img src={post.img} alt={post.title} style={{ width: "100%", borderRadius: "18px", objectFit: "cover" }} />
        <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#dcd2c4" }}>
          {post.content || "No article body available. Please update the post data with `.content`."}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#b8b0a0", marginTop: "10px" }}>
          <span>Author: {post.author}</span>
          <span>Date: {post.date}</span>
          <span><FiHeart /> {post.likes}</span>
        </div>
      </article>
    </main>
  );
}
