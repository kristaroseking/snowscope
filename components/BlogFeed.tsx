"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "@/types";

interface BlogFeedProps {
  resortId: string;
  resortName: string;
}

export default function BlogFeed({ resortId, resortName }: BlogFeedProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blog/${resortId}`);
        const result = await response.json();

        if (result.success) {
          setPosts(result.posts || []);
        } else {
          setError(result.error || "Failed to load blog");
        }
      } catch (err) {
        setError("Failed to load blog posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [resortId]);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-card shadow-sm p-8 border border-slate-700">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-slate-700 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error or no blog
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 rounded-card shadow-sm p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">
        Latest from {resortName} Weather Blog
      </h3>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <article key={index} className="border-b border-slate-700 last:border-0 pb-6 last:pb-0">
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <h4 className="text-base font-semibold text-white group-hover:text-yellow-300 transition-colors mb-2 leading-snug">
                {post.title}
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                {new Date(post.pubDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {post.description && (
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {post.description.replace(/<[^>]*>/g, "").substring(0, 200)}
                  {post.description.length > 200 ? "..." : ""}
                </p>
              )}
              <div className="mt-3 text-sm font-medium text-yellow-400 group-hover:text-yellow-300 transition-colors">
                Read more →
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
