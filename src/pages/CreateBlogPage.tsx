
import BlogForm from '@/components/blog/BlogForm';

const CreateBlogPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Blog Post</h1>
      <BlogForm />
    </div>
  );
};

export default CreateBlogPage;
