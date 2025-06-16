
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';
import { useAuth } from '@/context/AuthContext';
import BlogForm from '@/components/blog/BlogForm';

const EditBlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlog, isLoading } = useBlog();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(id ? getBlog(id) : undefined);

  useEffect(() => {
    if (id) {
      const blogData = getBlog(id);
      if (blogData) {
        // Check if user is the author
        if (user?.id !== blogData.author.id) {
          navigate('/dashboard');
          return;
        }
        setBlog(blogData);
      } else {
        navigate('/not-found');
      }
    }
  }, [id, getBlog, navigate, user]);

  if (isLoading || !blog) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <BlogForm blog={blog} isEditing={true} />
    </div>
  );
};

export default EditBlogPage;
