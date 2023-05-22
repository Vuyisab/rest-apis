import React, { Suspense } from "react";
import { assertIsPosts } from "./getPosts";
import { PostData } from "./types";
import { PostsList } from "./PostsList";
import { savePost } from "./savePost";
import { NewPostForm } from "./NewPostForm";
import { useLoaderData, Await, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function PostsPage() {
  const navigate = useNavigate();
  const data = useLoaderData();
  assertIsData(data);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(savePost, {
    onSuccess: (savedPost) => {
      queryClient.setQueryData<PostData[]>(["postsData"], (oldPosts) => {
        if (oldPosts === undefined) {
          return [savedPost];
        } else {
          return [savedPost, ...oldPosts];
        }
      });
      navigate("/");
    },
  });
  // const data = useLoaderData();
  // assertIsData(data);

  return (
    <Suspense fallback={<div>Fetching...</div>}>
      <Await resolve={data.posts} errorElement={<p>Error!</p>}>
        {(posts) => {
          assertIsPosts(posts);
          return (
            <div className="w-96 mx-auto mt-6">
              <h2 className="text-xl text-slate-900 font-bold">Posts</h2>
              <NewPostForm onSave={mutate} />
              <PostsList posts={posts} />
              {/* {isFetching ? <div>Fetching ...</div> : <PostsList posts={posts} />} */}
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

type Data = {
  posts: PostData[];
};
export function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== "object") {
    throw new Error("Data isn't an object");
  }
  if (data === null) {
    throw new Error("Data is null");
  }
  if (!("posts" in data)) {
    throw new Error("data doesn't contain posts");
  }
}
