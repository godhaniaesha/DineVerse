import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiArrowRight, FiClock, FiUser, FiTag,
    FiSearch, FiX, FiBookOpen, FiTrendingUp,
    FiChevronRight, FiEye, FiHeart
} from "react-icons/fi";
import {
    GiWineGlass, GiKnifeFork, GiCoffeeCup, GiVineLeaf,
    GiQuillInk
} from "react-icons/gi";
import { TbSparkles, TbChefHat, TbFlame } from "react-icons/tb";

import blogService from "../services/blogService";
import { TAGS, NEWSLETTER_TOPICS } from "../data/blogData";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSubscription } from "../contexts/SubscriptionContext";
import { getRelativeTime, getFormattedDateTime } from "../utils/timeHelper";

/* ─────────────────── HOOKS ─────────────────── */
function useReveal(threshold = 0.12) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVis(true); },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

/* ─────────────────── SUBCOMPONENTS ─────────────────── */


/* Standard blog card */
function BlogCard({ post, delay = 0, onRead, onLikeToggle }) {
    const [ref, vis] = useReveal();
    const [liked, setLiked] = useState(post.likes?.includes(localStorage.getItem('userId')) || false);
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

    const handleLike = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                alert('Please login to like posts');
                return;
            }

            await blogService.toggleLike(post._id, authToken);
            const newLiked = !liked;
            setLiked(newLiked);
            setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

            if (onLikeToggle) {
                onLikeToggle(post._id, newLiked);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <article
            ref={ref}
            className={`x_blog_card${vis ? " x_anim_in" : ""}`}
            style={{
                "--tag-color": post.tagColor || "#c49f5c",
                "--tag-dim": post.tagDim || "#7d5a1d",
                animationDelay: `${delay}s`,
            }}
        >
            <div className="x_bc_img_wrap">
                <img src={post.coverImg} alt={post.title} className="x_bc_img" loading="lazy" />
                <span className="x_bc_tag">{post.area || post.tag}</span>
                <div className="x_bc_img_hover_overlay" />
            </div>
            <div className="x_bc_body">
                <div className="x_bc_meta">
                    <span className="x_meta_item"><FiClock />{getFormattedDateTime(post.createdAt)}</span>
                </div>
                <h3 className="x_bc_title">{post.title}</h3>
                <p className="x_bc_excerpt">{post.short_des}</p>
                <div className="x_bc_foot">
                    <div className="x_author_row x_author_row--sm">
                        <div className="x_avatar x_avatar--sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#c49f5c', color: '#fff', fontSize: '18px', fontWeight: '600' }}>
                            <FiUser />
                        </div>
                        <div className="x_author_info">
                            <span className="x_author_name">{post.addedBy?.full_name || "DineVerse Team"}</span>
                            <span className="x_author_role">{getFormattedDateTime(post.createdAt)}</span>
                        </div>
                    </div>
                    <div className="x_bc_actions">
                        <button
                            className={`x_like_btn x_like_btn--sm${liked ? " x_like_btn--active" : ""}`}
                            onClick={handleLike}
                        >
                            <FiHeart /> {likesCount}
                        </button>
                    </div>
                </div>
                <Link to={`/blog/${post._id}`} state={{ post }} className="x_bc_read_link">
                    Read Article <FiChevronRight />
                </Link>
            </div>
        </article>
    );
}

/* Side card (trending) */
function TrendingCard({ post, rank }) {
    return (
        <Link to={`/blog/${post._id}`} state={{ post }} className="x_trending_card" style={{ "--tag-color": post.tagColor || "#c49f5c" }}>
            <span className="x_trending_rank">{String(rank).padStart(2, "0")}</span>
            <div className="x_trending_body">
                <span className="x_trending_tag">{post.area || post.tag}</span>
                <p className="x_trending_title x_wid">{post.title}</p>
                <span className="x_trending_meta"><FiClock />{getFormattedDateTime(post.createdAt)}</span>
            </div>
            <img src={post.coverImg} alt="" className="x_trending_img" />
        </Link>
    );
}

/* Newsletter */
function Newsletter() {
    const [ref, vis] = useReveal();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const { subscribeUser, loading } = useSubscription();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await subscribeUser(email, []); // you can pass interests here
            setSent(true);
            setEmail("");
        } catch (err) {
            alert(err.message); // you can replace with toast later
        }
    };

    return (
        <div ref={ref} className={`x_newsletter${vis ? " x_anim_in" : ""}`}>
            <div className="x_nl_glow" />
            <div className="x_nl_inner">
                <TbSparkles className="x_nl_icon" />

                <h3 className="x_nl_title">
                    The DineVerse <em>Digest</em>
                </h3>

                <p className="x_nl_sub">
                    Stories from our kitchen, bar and café. Delivered fortnightly, never spammy.
                </p>

                <div className="x_nl_topics">
                    {NEWSLETTER_TOPICS.map((t) => (
                        <span key={t} className="x_nl_topic">{t}</span>
                    ))}
                </div>

                {sent ? (
                    <div className="x_nl_success">
                        ✓ You're on the list. See you in your inbox.
                    </div>
                ) : (
                    <form className="x_nl_form" onSubmit={handleSubmit}>
                        <input
                            className="x_nl_input"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <button className="x_nl_btn" type="submit" disabled={loading}>
                            {loading ? "Subscribing..." : "Subscribe"} <FiArrowRight />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function Blog() {
    const navigate = useNavigate();
    const [activeTag, setActiveTag] = useState("All");
    const [search, setSearch] = useState("");
    const [heroVis, setHeroVis] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const postsPerPage = 6;

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await blogService.getAllBlogs();
            console.log('API Response:', response);
            if (response.success) {
                const blogData = response.data || [];
                console.log('Blog Data:', blogData);
                console.log('Available areas:', [...new Set(blogData.map(p => p.area))]);
                setPosts(blogData);
            } else {
                setError(response.msg || 'Failed to fetch blogs');
            }
        } catch (err) {
            setError('Failed to fetch blogs');
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const onReadArticle = (post) => {
        if (!post) return;
        navigate(`/blog/${post._id}`, { state: { post } });
    };

    const onLikeToggle = (postId, isLiked) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === postId
                    ? { ...post, likes: isLiked ? [...(post.likes || []), localStorage.getItem('userId')] : (post.likes || []).filter(id => id !== localStorage.getItem('userId')) }
                    : post
            )
        );
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTag, search]);

    useEffect(() => { setTimeout(() => setHeroVis(true), 100); }, []);

    const featured = posts.find((p) => p.featured);
    const normalizeText = (text) => {
        return text?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
    };

    const regular = posts.filter((p) => {
        const normalizedActiveTag = normalizeText(activeTag);
        const normalizedArea = normalizeText(p.area);
        const normalizedTag = normalizeText(p.tag);
        const matchTag = activeTag === "All" || normalizedArea === normalizedActiveTag || normalizedTag === normalizedActiveTag;

        const q = normalizeText(search);
        const normalizedTitle = normalizeText(p.title);
        const normalizedAuthorName = normalizeText(p.addedBy?.name || "DineVerse Team");
        const matchSearch = !q || normalizedTitle.includes(q) || normalizedAuthorName.includes(q) || normalizedArea.includes(q) || normalizedTag.includes(q);
        const shouldInclude = !p.featured && matchTag && matchSearch;

        // Debug logging for first few posts
        if (posts.indexOf(p) < 3) {
            console.log(`Post: ${p.title}, Area: ${p.area} -> ${normalizedArea}, ActiveTag: ${activeTag} -> ${normalizedActiveTag}, MatchTag: ${matchTag}, ShouldInclude: ${shouldInclude}`);
        }

        return shouldInclude;
    });
    const totalPages = Math.max(1, Math.ceil(regular.length / postsPerPage));
    const pageStart = (currentPage - 1) * postsPerPage;
    const pageEnd = pageStart + postsPerPage;
    const paginatedPosts = regular.slice(pageStart, pageEnd);
    const trending = [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 4);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
                .x_blog_grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
                .x_pagination { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1.4rem; justify-content: center; align-items: center; }
                .x_page_btn {
                    padding: 0.50rem 1rem;
                    border: 1px solid rgba(212, 168, 99, 0.5);
                    border-radius: 999px;
                    background: #fffdf7e0;
                    color: #3d2f10;
                    font-weight: 700;
                    min-width: 44px;
                    min-height: 38px;
                    box-shadow: inset 0 0 0 1px rgba(255,220,170,0.45), 0 4px 10px rgba(58,40,15,0.12);
                    transition: transform 180ms ease, box-shadow 180ms ease, background 220ms ease, color 220ms ease;
                    cursor: pointer;
                }
                .x_page_btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    border-color: #b58e40;
                    color: #2a1e0f;
                    background: linear-gradient(to right, #fff6e1, #fff4d4);
                    box-shadow: inset 0 0 0 1px rgba(255,202,130,0.55), 0 6px 14px rgba(61,38,9,0.20);
                }
                .x_page_btn:focus-visible {
                    outline: 2px solid #f8c859;
                    outline-offset: 3px;
                }
                .x_page_btn--active {
                    background: linear-gradient(135deg, #c49f5c, #7d5a1d);
                    color: #fff;
                    border-color: rgba(175, 108, 31, 0.95);
                    box-shadow: 0 0 0 2px rgba(208, 153, 75, 0.45), 0 6px 16px rgba(85, 56, 20, 0.40);
                    transform: translateY(-1px);
                }
             
                .x_page_btn:disabled {
                    background: #fffdf7e0;
                    color: #888;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .x_trending_slider { display: grid; gap: 0.75rem; }
                .x_trending_slider .x_trending_card { text-decoration: none; }

                @media (max-width: 1024px) {
                    .x_blog_sidebar .x_sidebar_block, .x_blog_sidebar .x_sidebar_quote { display: none !important; }
                    .x_blog_layout { grid-template-columns: 1fr !important; }
                    .x_trending_slider { display: flex; gap: 0.8rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 0.5rem; }
                    .x_trending_slider .x_trending_card { flex: 0 0 250px; scroll-snap-align: start; }
                }
            `}</style>
            <div className="x_blog_wrapper">

                {/* ── HERO ── */}
                <header className="x_blog_hero">
                    <div className="x_bh_grain" />
                    <div className="x_bh_top_glow" />

                    {/* animated diagonal lines */}
                    <div className="x_bh_lines">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="x_bh_line" style={{ animationDelay: `${i * 0.4}s` }} />
                        ))}
                    </div>

                    <div className={`x_bh_inner${heroVis ? " x_anim_hero" : ""}`}>
                        <div className="x_bh_eyebrow">
                            <span className="x_bh_eyebrow_line" />
                            <GiQuillInk className="x_eyebrow_icon" />
                            <span>DineVerse Journal</span>
                            <GiQuillInk className="x_eyebrow_icon" />
                            <span className="x_bh_eyebrow_line" />
                        </div>
                        <h1 className="x_bh_title">
                            Stories of <em>Taste</em>
                            <br />& <em>Craft</em>
                        </h1>
                        <p className="x_bh_sub">
                            From kitchen secrets to cocktail science — dispatches from everyone who makes DineVerse what it is.
                        </p>

                    </div>
                </header>

                {/* ── TAG STRIP ── */}
                <nav className="x_tag_strip">
                    <div className="x_tag_strip_inner">
                        {TAGS.map((t) => (
                            <button
                                key={t}
                                className={`x_tag_btn${activeTag === t ? " x_tag_btn--active" : ""}`}
                                onClick={() => setActiveTag(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* ── MAIN LAYOUT ── */}
                <main className="x_blog_main">
                    <div className="x_blog_layout">

                        {/* LEFT — posts */}
                        <div className="x_posts_col">

                            {/* Trending slider on smaller screens */}
                            {trending.length > 0 && (
                                <section className="x_section_block x_trending_slider_block">
                                    <div className="x_section_label mb-2">
                                        <FiTrendingUp className="x_section_label_icon" />
                                        Trending
                                        <span className="x_section_count">{trending.length}</span>
                                    </div>
                                    <div className="x_trending_list x_trending_slider">
                                        {trending.map((post, i) => (
                                            <TrendingCard key={post._id} post={post} rank={i + 1} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Grid */}
                            {regular.length > 0 && (
                                <section className="x_section_block">
                                    <div className="x_section_label">
                                        <FiBookOpen className="x_section_label_icon" />
                                        {search ? `Results for "${search}"` : "Latest Articles"}
                                        <span className="x_section_count">{regular.length}</span>
                                    </div>
                                    <div className="x_blog_grid">
                                        {paginatedPosts.map((post, i) => (
                                            <BlogCard key={post._id} post={post} delay={i * 0.08} onRead={onReadArticle} onLikeToggle={onLikeToggle} />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="x_pagination">
                                            <button
                                                className="x_page_btn"
                                                disabled={currentPage <= 1}
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            >
                                                <FaChevronLeft />
                                            </button>
                                            {[...Array(totalPages)].map((_, idx) => {
                                                const page = idx + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        className={`x_page_btn${currentPage === page ? " x_page_btn--active" : ""}`}
                                                        onClick={() => setCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                className="x_page_btn"
                                                disabled={currentPage >= totalPages}
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            >
                                                <FaChevronRight />
                                            </button>
                                        </div>
                                    )}
                                </section>
                            )}

                            {loading && (
                                <div className="x_empty_state">
                                    <span className="x_empty_icon">⏳</span>
                                    <p>Loading articles...</p>
                                </div>
                            )}

                            {error && (
                                <div className="x_empty_state">
                                    <span className="x_empty_icon">⚠️</span>
                                    <p>{error}</p>
                                    <button
                                        className="x_reset_btn"
                                        onClick={fetchBlogs}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {!loading && !error && regular.length === 0 && (search || activeTag !== "All") && (
                                <div className="x_empty_state">
                                    <span className="x_empty_icon">📖</span>
                                    <p>No articles match your filters.</p>
                                    <button
                                        className="x_reset_btn"
                                        onClick={() => { setSearch(""); setActiveTag("All"); }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}

                            {/* Newsletter */}
                            <Newsletter />
                        </div>

                        {/* RIGHT — sidebar */}
                        <aside className="x_blog_sidebar">
                            {/* Trending */}
                            <div className="x_sidebar_block">
                                <div className="x_sidebar_title">
                                    <FiTrendingUp /> Trending
                                </div>
                                <div className="x_trending_list">
                                    {trending.map((post, i) => (
                                        <TrendingCard key={post._id} post={post} rank={i + 1} />
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="x_sidebar_block">
                                <div className="x_sidebar_title">
                                    <FiTag /> Topics
                                </div>
                                <div className="x_topics_list">
                                    {TAGS.filter((t) => t !== "All").map((t) => {
                                        const normalizedTag = normalizeText(t);
                                        const count = posts.filter((p) => normalizeText(p.area) === normalizedTag || normalizeText(p.tag) === normalizedTag).length;
                                        console.log(`Category ${t} -> ${normalizedTag}: Count = ${count}, Posts with this area:`, posts.filter(p => normalizeText(p.area) === normalizedTag || normalizeText(p.tag) === normalizedTag).map(p => p.title));
                                        return (
                                            <button
                                                key={t}
                                                className={`x_topic_row${activeTag === t ? " x_topic_row--active" : ""}`}
                                                onClick={() => setActiveTag(t)}
                                            >
                                                <span>{t}</span>
                                                <span className="x_topic_count">{count}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quote */}
                            <div className="x_sidebar_quote">
                                <span className="x_sq_mark">"</span>
                                <p className="x_sq_text">Cooking is an act of love. Writing about it is how we make that love last.</p>
                                <cite className="x_sq_cite">— Arjun Mehta</cite>
                            </div>
                        </aside>
                    </div>
                </main>

            </div>
        </>
    );
}

