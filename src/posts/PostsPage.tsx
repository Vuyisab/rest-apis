import React, { Suspense } from "react";
import { assertIsPosts, getPosts } from "./getPosts";
import { PostData } from "./types";
import { PostsList } from "./PostsList";
import { savePost } from "./savePost";
import { NewPostForm } from "./NewPostForm";
import { useLoaderData, Await } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function PostsPage() {
  const {
    isLoading,
    data: posts,
    isFetching,
  } = useQuery(["postsData"], getPosts);

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
    },
  });
  // const data = useLoaderData();
  // assertIsData(data);
  if (isLoading || posts === undefined) {
    return <div className="w-96 mx-auto mt-6">Loading ...</div>;
  }

  return (
    // <Suspense fallback={<div>Fetching...</div>}>
    <Await resolve={posts} errorElement={<p>Error!</p>}>
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
    // </Suspense>
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
