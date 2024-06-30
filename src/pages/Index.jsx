import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const top100Ids = storyIds.slice(0, 100);

  const storyPromises = top100Ids.map(async (id) => {
    const storyResponse = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return storyResponse.json();
  });

  return Promise.all(storyPromises);
};

function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div>
        <h1 className="text-3xl text-center">Hacker News Top Stories</h1>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="my-4"
        />
        {isLoading ? (
          <Skeleton className="h-6 w-full" count={10} />
        ) : error ? (
          <p className="text-center text-red-500">Error fetching stories</p>
        ) : (
          <ul>
            {filteredStories.map((story) => (
              <li key={story.id} className="mb-4">
                <h2 className="text-xl font-bold">{story.title}</h2>
                <p>{story.score} upvotes</p>
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Read more
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default Index;