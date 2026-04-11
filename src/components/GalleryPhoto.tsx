import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery";

type Props = {
  item: GalleryItem;
  priority?: boolean;
  sizes?: string;
};

export function GalleryPhoto({ item, priority = false, sizes }: Props) {
  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      priority={priority}
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      className="object-cover transition-transform duration-[800ms] ease-in-out"
    />
  );
}
