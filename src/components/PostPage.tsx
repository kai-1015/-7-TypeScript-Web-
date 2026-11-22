
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Post } from "../Types/post";

export default function PostPage() {
  // useParamsを実行してidを取り出す
  const { id } = useParams<"id">();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // IDに対応する記事をAPIから取得
  useEffect(() => {
    // 中止用のコントローラーをつくる
    const controller = new AbortController();

    // 非同期関数を定義する
    const fetcher = async () => {
      try {
        if (!id) {
          throw new Error("記事IDがありません");
        }

        const res = await fetch(
          `https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("記事を取得できませんでした");
        }

        const data = await res.json();
        setPost(data.post ?? data);

      } catch (e) {
        if (controller.signal.aborted) return;

        setError(
          e instanceof Error ? e.message : "通信に失敗しました"
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    // 非同期関数の実行
    fetcher();

    // クリーンアップ関数
    return () => controller.abort();
  }, [id]);

  // 通信中
  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  // エラー発生時
  if (error) {
    return <p role="alert">エラー：{error}</p>;
  }

  // 記事が見つからない場合
  if (!post) {
    return <p>記事が見つかりません。</p>;
  }

  // 記事データを取り出す
  const {
    title,
    thumbnailUrl,
    createdAt,
    categories,
    content,
  } = post;

  // 記事詳細を表示
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full mt-6"
      />

      <p className="mt-6 text-sm text-gray-500">
        {new Date(createdAt).toLocaleDateString("ja-JP")}
      </p>

      <div className="flex gap-2 mt-2">
        {categories?.map((category) => (
          <span
            key={category}
            className="bg-gray-200 text-gray-800 rounded-full px-3"
          >
            {category}
          </span>
        ))}
      </div>

      <h1 className="text-2xl font-bold my-4">
        {title}
      </h1>

      <div
        className="text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Link to="/" className="text-blue-600">
        記事一覧へ戻る
      </Link>
    </div >
  );
}
