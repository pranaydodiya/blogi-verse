
import { Blog } from '@/context/BlogContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BlogCardProps {
  blog: Blog;
  isAuthor?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BlogCard = ({ blog, isAuthor, onEdit, onDelete }: BlogCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <Link to={`/blog/${blog.id}`}>
            <CardTitle className="text-xl font-bold hover:text-primary transition-colors">
              {blog.title}
            </CardTitle>
          </Link>
        </div>
        <CardDescription className="flex items-center gap-2 text-sm">
          <span>{blog.author.name}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{blog.excerpt}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <Link to={`/blog/${blog.id}`}>
          <Button variant="link" className="p-0 h-auto">
            Read more
          </Button>
        </Link>
        
        {isAuthor && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
