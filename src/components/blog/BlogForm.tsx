
import { useState, useEffect } from 'react';
import { useBlog } from '@/context/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Blog } from '@/context/BlogContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';

interface BlogFormProps {
  blog?: Blog;
  isEditing?: boolean;
}

const BlogForm = ({ blog, isEditing = false }: BlogFormProps) => {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [activeTab, setActiveTab] = useState<string>('write');
  const { createBlog, updateBlog, isLoading } = useBlog();
  const navigate = useNavigate();

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
    }
  }, [blog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && blog) {
        await updateBlog(blog.id, title, content);
        navigate(`/blog/${blog.id}`);
      } else {
        const newBlog = await createBlog(title, content);
        navigate(`/blog/${newBlog.id}`);
      }
    } catch (error) {
      console.error('Blog form error:', error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update your blog post with the form below' 
            : 'Share your thoughts with the world'
          }
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="write" className="mt-0">
                <Textarea
                  id="content"
                  placeholder="Write your blog content in Markdown..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="min-h-[300px] font-mono"
                />
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <div className="border rounded-md p-4 min-h-[300px] overflow-y-auto">
                  {content ? (
                    <div className="blog-content">
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Your preview will appear here...
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <p className="text-sm text-muted-foreground">
              You can use Markdown for formatting. Check out the{' '}
              <a 
                href="https://www.markdownguide.org/cheat-sheet/" 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Markdown Cheat Sheet
              </a>
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Post' : 'Publish Post')
            }
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BlogForm;
