import { useEffect, useState } from "react";
import type { Post } from "../Types/post";
import PostsDetail from "../components/PostsDetail";

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchPost = async () => {
            setIsLoading(true);
            setError("");
            setPosts([]);

            try {
                const res = await fetch(
                    "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts",
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    throw new Error("記事を取得できませんでした");
                }

                const data: { posts: Post[] } = await res.json();

                if (controller.signal.aborted) return;
                setPosts(data.posts);

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

        void fetchPost();

        return () => controller.abort();
    }, []);

    return (
        <main>
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-6">
                    記事一覧
                </h1>

                {isLoading && <p>読み込み中...</p>}

                {error && <p role="alert">{error}</p>}

                {!isLoading && !error && (
                    <div className="flex flex-col gap-6">
                        {posts.map((post) => (
                            <PostsDetail key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}