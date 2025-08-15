
"use client"
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// CategoryCarousel: displays categories in a row carousel (5 per row)
export const CategoryCarousel = ({ categories = [] }) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    return <div>No categories found.</div>;
  }
  return (
    <Carousel className={`w-full md:w-[95%] mx-auto my-4 ${categories.length > 0 ? "block" : "hidden"}`}>
      <CarouselContent className="w-full gap-2">
        {categories.map((category, index) => (
          <CarouselItem
            key={index}
            className="pl-5 md:basis-1/2 lg:basis-1/6 min-w-0 snap-start"
          >
            <CategoryCard category={category} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 p-5" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 p-5" />
    </Carousel>
  );
};


const CategoryCard = ({ category }) => {
  // console.log(category)
  return (
    
      <div className="group md:w-44 w-full md:h-66 h-full transition-transform my-2 flex flex-col">
        <div className="relative w-full h-48 overflow-hidden rounded-xl mb-2">
          <Image
            src={category.profileImage?.url || "/placeholder.jpeg"}
            alt={category.title}
            fill
            className="object-cover object-top h-full w-full rounded-xl group-hover:-translate-y-3 transition-transform duration-200"
            sizes="176px"
          />
        </div>
        <Link href={category.url || `/category/${category.url || category._id}` }>
        <span className=" text-sm md:text-md font-semibold text-start text-gray-800 text-base hover:underline truncate w-full mt-5 px-2">
          {category.title}
        </span>
        </Link>
      </div>
  );
};

export default CategoryCard;