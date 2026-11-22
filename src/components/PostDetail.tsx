
import { Link } from "react-router-dom";
import type { Post } from "../Types/post";

type PostsDetailProps = {
  post: Post;
};

export default function PostsDetail({ post }: PostsDetailProps) {
  const { title, thumbnailUrl, createdAt, categories, content } = post;

  return (
    <Link
      to={`/posts/${post.id}`}
      className="flex gap-4 border-b border-gray-200 py-4"
    >
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-52 h-auto object-contain shrink-0 self-start"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleDateString("ja-JP")}
          </span>

          {categories.map((category) => (
            <span
              key={category}
              className="bg-gray-200 text-gray-800 rounded-full px-3"
            >
              {category}
            </span>
          ))}
        </div>

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <div
          className="text-gray-700 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </Link>
  );
}
