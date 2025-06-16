
import { useBlog } from '@/context/BlogContext';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const { blogs, isLoading } = useBlog();
  const { isAuthenticated } = useAuth();
  
  // Only show the most recent 3 blogs on the homepage
  const recentBlogs = blogs.slice(0, 3);

  return (
    <div className="container mx-auto py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-primary">BlogIverse</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          A place to share your thoughts, ideas, and stories with the world
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/blogs">Browse Blogs</Link>
          </Button>
          {isAuthenticated ? (
            <Button asChild variant="outline" size="lg">
              <Link to="/create">Create Post</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg">
              <Link to="/signup">Join Now</Link>
            </Button>
          )}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Posts</h2>
          <Button asChild variant="ghost">
            <Link to="/blogs">View All</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : recentBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">No blog posts yet</p>
            {isAuthenticated && (
              <Button asChild>
                <Link to="/create">Create your first post</Link>
              </Button>
            )}
          </div>
        )}
      </section>

      <section className="bg-accent rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to start blogging?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Join our community and share your knowledge with readers around the world.
        </p>
        {isAuthenticated ? (
          <Button asChild size="lg">
            <Link to="/create">Create a Blog Post</Link>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link to="/signup">Sign Up Now</Link>
          </Button>
        )}
      </section>
    </div>
  );
};

export default HomePage;
