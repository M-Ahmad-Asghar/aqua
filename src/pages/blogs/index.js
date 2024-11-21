import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Blog = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blogContent, setBlogContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the blog content dynamically based on the blog ID
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/blogs/${id}.md`); // Assumes Markdown files are in the /blogs folder
        if (!response.ok) throw new Error("Blog not found");
        const text = await response.text();
        setBlogContent(text);
      } catch (error) {
        setBlogContent(`# Blog Not Found\n\nWe couldn't find the blog with ID: ${id}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return (
    <div className="blogContainer">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReactMarkdown children={blogContent} remarkPlugins={[remarkGfm]} />
      )}
    </div>
  );
};

export default Blog;
