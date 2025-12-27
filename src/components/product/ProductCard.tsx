
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Safe helper to calculate discount if we had an original price (mocking it for now)
  const originalPrice = product.price * 1.2;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <Link to={`/products/${product.id}`} className="daraz-card group cursor-pointer h-[320px] flex flex-col">
      {/* Image Container */}
      <div className="relative h-[180px] w-full bg-gray-100 overflow-hidden">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/200'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Discount Tag */}
        {discount > 0 && (
          <div className="absolute top-0 right-0 bg-[#f85606] text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 flex flex-col flex-grow justify-between">
        <div>
           <h3 className="text-sm text-[#212121] line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
             {product.name}
           </h3>
           
           <div className="flex flex-col">
             <span className="text-lg font-bold text-[#f85606]">
              ৳ {product.price.toLocaleString()}
             </span>
             {discount > 0 && (
               <div className="flex items-center gap-1 text-xs text-gray-500">
                 <span className="line-through">৳ {Math.round(originalPrice).toLocaleString()}</span>
                 <span>-{discount}%</span>
               </div>
             )}
           </div>
        </div>

        {/* Rating & Action */}
        <div className="mt-2 text-xs flex items-center justify-between">
            <div className="flex items-center text-yellow-400">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current text-gray-300" />
              <span className="text-gray-400 ml-1">(54)</span>
            </div>
            {/* Hover Action - Daraz doesn't always show buttons on card, but sometimes a small icon */}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
