import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Define Blog type
export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Define context type
interface BlogContextType {
  blogs: Blog[];
  isLoading: boolean;
  createBlog: (title: string, content: string) => Promise<Blog>;
  updateBlog: (id: string, title: string, content: string) => Promise<Blog>;
  deleteBlog: (id: string) => Promise<void>;
  getBlog: (id: string) => Blog | undefined;
}

// Mock database for blogs storage (replace with real backend later)
let BLOGS_DB: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: `
# Getting Started with React

React is a popular JavaScript library for building user interfaces, particularly single-page applications where you need a fast, interactive user experience.

## Why React?

React offers several benefits:

1. **Component-Based Architecture**: Build encapsulated components that manage their own state, then compose them to make complex UIs.
2. **Declarative Syntax**: Design simple views for each state in your application. React will efficiently update and render just the right components when your data changes.
3. **Learn Once, Write Anywhere**: You can develop new features in React without rewriting existing code.

## Creating Your First Component

Let's create a simple React component:

\`\`\`jsx
import React from 'react';

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

export default Welcome;
\`\`\`

## Setting Up a React Project

The easiest way to start with React is to use Create React App:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

This sets up a comfortable development environment with features like hot module replacement and error reporting.

## What's Next?

Once you've got your first component working, you can learn about:

- State and Lifecycle
- Handling Events
- Conditional Rendering
- Lists and Keys
- Forms
- Composition vs Inheritance

Happy coding!
    `,
    excerpt: 'Learn the fundamentals of React, from components to state management. This guide will help you get started with building modern web applications.',
    author: {
      id: '1',
      name: 'Demo User',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'CSS Flexbox and Grid: A Comprehensive Guide',
    content: `
# CSS Flexbox and Grid: A Comprehensive Guide

Modern CSS layout techniques have revolutionized the way we design web pages. Two of the most powerful tools in your CSS arsenal are Flexbox and Grid.

## Flexbox: One-dimensional Layouts

Flexbox is designed for one-dimensional layouts - either a row or a column. It's perfect for:

- Navigation bars
- Form controls
- Card layouts
- Centering elements

### Basic Flexbox Usage

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## CSS Grid: Two-dimensional Layouts

CSS Grid is designed for two-dimensional layouts with rows and columns. It's ideal for:

- Page layouts
- Image galleries
- Complex forms
- Dashboard layouts

### Basic Grid Usage

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

## When to Use What?

- **Use Flexbox** when you need to arrange elements in a single dimension (row OR column)
- **Use Grid** when you need control over both dimensions simultaneously (rows AND columns)

## Browser Support

Both Flexbox and Grid have excellent browser support in modern browsers. For older browsers, consider using feature detection or polyfills.

## Conclusion

By understanding when and how to use Flexbox and Grid, you can create sophisticated layouts with clean, maintainable CSS. These powerful layout tools have transformed CSS from a limiting styling language to a robust layout system.
    `,
    excerpt: 'Master the art of modern layouts with CSS Flexbox and Grid. This comprehensive guide covers everything you need to know for responsive designs.',
    author: {
      id: '1',
      name: 'Demo User',
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Load blogs on initial render
  useEffect(() => {
    // Simulate API request delay
    const loadBlogs = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBlogs(BLOGS_DB);
      setIsLoading(false);
    };

    loadBlogs();
  }, []);

  const createBlog = async (title: string, content: string): Promise<Blog> => {
    if (!user) {
      throw new Error('You must be logged in to create a blog');
    }

    setIsLoading(true);
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const excerpt = content.length > 150 
      ? content.substring(0, 150).replace(/#/g, '').trim() + '...'
      : content.replace(/#/g, '').trim();

    const newBlog: Blog = {
      id: String(BLOGS_DB.length + 1),
      title,
      content,
      excerpt,
      author: {
        id: user.id,
        name: user.name,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    BLOGS_DB = [newBlog, ...BLOGS_DB];
    setBlogs(BLOGS_DB);
    setIsLoading(false);
    toast.success('Blog created successfully!');
    return newBlog;
  };

  const updateBlog = async (id: string, title: string, content: string): Promise<Blog> => {
    if (!user) {
      throw new Error('You must be logged in to update a blog');
    }

    setIsLoading(true);
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const blogIndex = BLOGS_DB.findIndex(b => b.id === id);
    if (blogIndex === -1) {
      setIsLoading(false);
      throw new Error('Blog not found');
    }

    const blog = BLOGS_DB[blogIndex];
    if (blog.author.id !== user.id) {
      setIsLoading(false);
      throw new Error('You can only edit your own blogs');
    }

    const excerpt = content.length > 150 
      ? content.substring(0, 150).replace(/#/g, '').trim() + '...'
      : content.replace(/#/g, '').trim();

    const updatedBlog: Blog = {
      ...blog,
      title,
      content,
      excerpt,
      updatedAt: new Date().toISOString(),
    };

    BLOGS_DB[blogIndex] = updatedBlog;
    setBlogs([...BLOGS_DB]);
    setIsLoading(false);
    toast.success('Blog updated successfully!');
    return updatedBlog;
  };

  const deleteBlog = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to delete a blog');
    }

    setIsLoading(true);
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const blog = BLOGS_DB.find(b => b.id === id);
    if (!blog) {
      setIsLoading(false);
      throw new Error('Blog not found');
    }

    if (blog.author.id !== user.id) {
      setIsLoading(false);
      throw new Error('You can only delete your own blogs');
    }

    BLOGS_DB = BLOGS_DB.filter(b => b.id !== id);
    setBlogs(BLOGS_DB);
    setIsLoading(false);
    toast.success('Blog deleted successfully!');
  };

  const getBlog = (id: string): Blog | undefined => {
    return blogs.find(b => b.id === id);
  };

  const value = {
    blogs,
    isLoading,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlog,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
