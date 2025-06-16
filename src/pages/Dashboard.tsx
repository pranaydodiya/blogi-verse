
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';
import { useAuth } from '@/context/AuthContext';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const { blogs, deleteBlog, isLoading } = useBlog();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // Filter to only show user's blogs
  const userBlogs = blogs.filter(blog => blog.author.id === user?.id);

  const handleEdit = (blogId: string) => {
    navigate(`/blog/${blogId}/edit`);
  };

  const openDeleteDialog = (blogId: string) => {
    setBlogToDelete(blogId);
  };

  const handleDelete = async () => {
    if (blogToDelete) {
      try {
        await deleteBlog(blogToDelete);
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
      setBlogToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button onClick={() => navigate('/create')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading your posts...</p>
        </div>
      ) : userBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              isAuthor={true}
              onEdit={() => handleEdit(blog.id)}
              onDelete={() => openDeleteDialog(blog.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">You haven't created any blog posts yet</p>
          <Button onClick={() => navigate('/create')}>
            Create your first post
          </Button>
        </div>
      )}

      <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
