"use client";
import Image from "next/image";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

export default function BlockRendererClient({
  content,
}: {
  readonly content: BlocksContent | string;
}) {
  if (!content) return null;
  
  // If content is a string, it's not in Blocks format yet
  // This can happen if the content was created before switching to Blocks
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => {
          return (
            <Image
              src={image.url}
              width={image.width}
              height={image.height}
              alt={image.alternativeText || ""}
            />
          );
        },
      }}
    />
  );
}

