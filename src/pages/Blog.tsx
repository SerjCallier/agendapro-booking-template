import React, { useEffect, useState } from 'react';
import { Search, Loader2, Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchBlogPosts, type BlogPostData } from '../services/n8nService';

export const Blog: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPostData | null>(null);

  useEffect(() => {
    fetchBlogPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('blog.back', 'Volver al Blog')}
        </button>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium dark:bg-primary-900/30 dark:text-primary-400">
                {selectedPost.categoria}
              </span>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(selectedPost.fecha).toLocaleDateString()}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {t('blog.readingTime', '5 min de lectura')}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {selectedPost.titulo}
            </h1>
            <div className="flex items-center pt-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                {selectedPost.autor.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{selectedPost.autor}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Especialista en Bienestar</p>
              </div>
            </div>
          </header>

          <div className="aspect-video w-full overflow-hidden rounded-3xl shadow-lg">
            <img src={selectedPost.imagenUrl} alt={selectedPost.titulo} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {selectedPost.extracto}
            </p>
            <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">El camino hacia el bienestar</h3>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <blockquote className="border-l-4 border-primary-500 pl-6 my-8 italic text-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-800 p-6 rounded-r-xl">
                "La calidad de nuestra atención define la experiencia del cliente. Cada detalle cuenta en el proceso de transformación personal."
              </blockquote>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
              </p>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-8 border-b border-gray-200 dark:border-dark-700">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t('blog.title', 'Blog y Novedades')}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {t('blog.subtitle', 'Consejos de especialistas y actualizaciones sobre nuestros servicios.')}
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg leading-5 bg-white dark:bg-dark-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200"
            placeholder={t('blog.searchPlaceholder', 'Buscar artículos...')}
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
            <article 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className="flex flex-col bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden hover:shadow-md transition-all group cursor-pointer hover:-translate-y-1"
            >
               <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-dark-700 relative">
                   <img src={post.imagenUrl} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute top-4 left-4">
                     <span className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                       {post.categoria}
                     </span>
                   </div>
                </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.titulo}
                  </h3>
                  <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {post.extracto}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                      {post.autor.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{post.autor}</p>
                      <time className="text-xs text-gray-500 dark:text-gray-400" dateTime={post.fecha}>{new Date(post.fecha).toLocaleDateString()}</time>
                    </div>
                  </div>
                  <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                    {t('blog.readMore', 'Leer más')} →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
