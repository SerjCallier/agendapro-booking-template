import React, { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { fetchBlogPosts, type BlogPostData } from '../services/n8nService';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-slide-up max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-8 border-b border-gray-200 dark:border-dark-700">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Blog y Novedades</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Consejos de especialistas y actualizaciones sobre nuestros servicios.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg leading-5 bg-white dark:bg-dark-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200"
            placeholder="Buscar artículos..."
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden hover:shadow-md transition-shadow group">
               <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-dark-700">
                   <img src={post.imagenUrl} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                    <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full dark:bg-primary-900/30 dark:text-primary-400">
                      {post.categoria}
                    </span>
                  </p>
                  <a href="#" className="block mt-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {post.titulo}
                    </h3>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">
                      {post.extracto}
                    </p>
                  </a>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 shadow-sm flex items-center justify-center text-white font-bold text-lg">
                      {post.autor.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{post.autor}</p>
                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={post.fecha}>{new Date(post.fecha).toLocaleDateString()}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
