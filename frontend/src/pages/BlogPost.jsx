import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { FiClock, FiEye, FiHeart, FiChevronLeft } from "react-icons/fi";
import { useState, useEffect } from "react";
import blogService from "../services/blogService";

export default function BlogPost() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const postFromState = location.state?.post;

  useEffect(() => {
    if (postFromState) {
      setPost(postFromState);
      setLiked(postFromState.likes?.includes(localStorage.getItem('userId')) || false);
      setLikesCount(postFromState.likes?.length || 0);
      setLoading(false);
    } else {
      fetchBlogById(id);
    }
  }, [id, postFromState]);

  const fetchBlogById = async (blogId) => {
    try {
      setLoading(true);
      const response = await blogService.getBlogById(blogId);
      if (response.success) {
        const blogData = response.data;
        setPost(blogData);
        setLiked(blogData.likes?.includes(localStorage.getItem('userId')) || false);
        setLikesCount(blogData.likes?.length || 0);
      } else {
        setError(response.msg || 'Failed to fetch blog');
      }
    } catch (err) {
      setError('Failed to fetch blog');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to like posts');
        return;
      }
      
      await blogService.toggleLike(post._id, token);
      const newLiked = !liked;
      setLiked(newLiked);
      setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "100px 24px",
          background: "#080705",
          color: "#f5f0e8",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        style={{
          padding: "100px 24px",
          background: "#080705",
          color: "#f5f0e8",
          minHeight: "70vh",
        }}
      >
        <p>{error || 'Article not found.'}</p>
        <button
          onClick={() => navigate("/blog")}
          style={{
            color: "#c8965a",
            background: "none",
            border: "1px solid #c8965a",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080705",
        color: "#f5f0e8",
        padding: "100px 24px 60px",
      }}
    >
      <article
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gap: "24px",
        }}
      >
        <button
          onClick={() => navigate("/blog")}
          style={{
            justifySelf: "start",
            color: "#c8965a",
            background: "none",
            border: "1px solid rgba(200, 150, 90, 0.3)",
            padding: "10px 20px",
            borderRadius: "999px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(200, 150, 90, 0.1)";
            e.currentTarget.style.borderColor = "#c8965a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.borderColor = "rgba(200, 150, 90, 0.3)";
          }}
        >
          <FiChevronLeft /> Back to Blog
        </button>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: post.tagColor || "#c49f5c",
              border: `1px solid ${post.tagColor || "#c49f5c"}`,
              padding: "5px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            {post.area || post.tag}
          </span>
          <span style={{ fontSize: "12px", color: "#b8b0a0" }}>
            <FiClock /> {post.readTime || "5 min read"}
          </span>
          <span style={{ fontSize: "12px", color: "#b8b0a0" }}>
            <FiEye /> {post.views || 0}
          </span>
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px,6vw,42px)",
            lineHeight: 1.2,
          }}
        >
          {post.title}
        </h1>
        <p style={{ color: "#b8b0a0", marginBottom: "0" }}>{post.short_des}</p>
        <img
          src={post.coverImg}
          alt={post.title}
          style={{ width: "100%", borderRadius: "18px", objectFit: "cover" }}
        />
        <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#dcd2c4" }}>
          {post.des || "No article body available."}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "6px 12px",
            color: "#b8b0a0",
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          <span>Author: {post.addedBy?.name || "DineVerse Team"}</span>
          <span>Date: {new Date(post.createdAt).toLocaleDateString()}</span>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: liked ? "rgba(200, 150, 90, 0.2)" : "none",
              border: "1px solid rgba(200, 150, 90, 0.3)",
              padding: "5px 10px",
              borderRadius: "8px",
              color: liked ? "#c8965a" : "#b8b0a0",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={handleLike}
          >
            <FiHeart /> {likesCount}
          </button>
        </div>
      </article>
    </main>
  );
}
