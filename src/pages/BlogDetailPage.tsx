
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlog, deleteBlog, isLoading } = useBlog();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(id ? getBlog(id) : undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const blogData = getBlog(id);
      if (blogData) {
        setBlog(blogData);
      } else {
        navigate('/not-found');
      }
    }
  }, [id, getBlog, navigate]);

  const isAuthor = user && blog && user.id === blog.author.id;

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteBlog(id);
        navigate('/blogs');
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (isLoading || !blog) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const formattedDate = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-sm font-medium">
                  {blog.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p>{blog.author.name}</p>
                <p className="text-sm">{formattedDate}</p>
              </div>
            </div>

            {isAuthor && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/blog/${blog.id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
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
            )}
          </div>
        </div>

        <div className="prose-lg max-w-none blog-content">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
