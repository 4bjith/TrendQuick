import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import ProductCard from "../components/ProductCard";
import { LuSquareArrowUpRight } from "react-icons/lu";
import CategoryRibbon from "../components/CategoryRibbon";

export default function Products() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/product");
      return res.data; // array of products
    },
  });

  console.log("products:", data);

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Error loading products.</p>;

  return (
    <div className="max-w-screen  ">
      <Navbar />

      <div className="w-full h-auto min-h-screen flex justify-center pb-12 bg-gray-50">
        <div className="w-full md:w-[750px] lg:w-[1020px] xl:w-[1300px] h-full">
          {/* newest arrival */}
          <div className="w-full flex flex-col mt-7">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 ">
              <h2 className="text-xl font-semibold mb-2  font-stretch-50%">
                Newest Arrivals{" "}
              </h2>
              <LuSquareArrowUpRight className="text-[1.3rem]" />
            </div>
            <div className="w-full flex overflow-scroll no-scrollbar   gap-5">
              {data?.slice(0, 7).map((p) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  image={p.image}
                  title={p.title}
                  price={p.price}
                  catagory={p.catagory?.catagoryName}
                />
              ))}
            </div>
          </div>
          {/* popular mobiles */}
          <div className="w-full flex flex-col mt-10 mb-7">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 ">
              <h2 className="text-xl font-semibold mb-2  font-stretch-50%">
                Popular Mobiles{" "}
              </h2>
              <LuSquareArrowUpRight className="text-[1.3rem]" />
            </div>
            <div className="w-full flex overflow-scroll no-scrollbar   gap-5">
              {data
                ?.slice(0, 7)
                .filter((c) => c.catagory?.catagoryName === "Mobiles")
                .map((p) => (
                  <ProductCard
                    key={p._id}
                    id={p._id}
                    image={p.image}
                    title={p.title}
                    price={p.price}
                    catagory={p.catagory?.catagoryName}
                  />
                ))}
            </div>
          </div>
          <CategoryRibbon />
          <div className="w-full flex flex-col mt-10">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 ">
              <h2 className="text-xl font-semibold mb-2  font-stretch-50%">
                Newest Arrivals{" "}
              </h2>
              <LuSquareArrowUpRight className="text-[1.3rem]" />
            </div>
            <div className="w-full flex  flex-wrap gap-5">
              {data?.map((p) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  image={p.image}
                  title={p.title}
                  price={p.price}
                  catagory={p.catagory?.catagoryName}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
