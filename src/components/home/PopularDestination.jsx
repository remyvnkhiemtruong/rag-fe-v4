import React from 'react';
import { useTranslation } from 'react-i18next';

const PopularDestinations = () => {
  const { t } = useTranslation();
  
  const destinationsData = [
    { id: 1, name: 'Mũi Cà Mau', places: '05', imageUrl: 'https://i1-dulich.vnecdn.net/2019/10/14/Dat-Mui-Ca-Mau-Vnexpress8-1571050207.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=K8J7AdLWVcwKS9v0uof-9w' },
    { id: 2, name: 'Vườn QG U Minh Hạ', places: '03', imageUrl: 'https://res.cloudinary.com/dybmh6wnf/image/upload/v1770215239/vuonquocgia_rgz2mx.jpg' },
    { id: 3, name: 'Hòn Khoai', places: '02', imageUrl: 'https://res.cloudinary.com/dybmh6wnf/image/upload/v1770215043/dao-hon-khoai_mv6mal.jpg' },
    { id: 4, name: 'Mẹ Quan âm Nam Hải', places: '04', imageUrl: 'https://thamhiemmekong.com/wp-content/uploads/2020/04/phatbanamhaibaclieu.jpg' },
    { id: 5, name: 'Nhà Công Tử Bạc Liêu', places: '06', imageUrl: 'https://res.cloudinary.com/dybmh6wnf/image/upload/v1770215041/congtubaclieu_eaqpd7.jpg' },
    { id: 6, name: 'Cánh Đồng Điện Gió', places: '08', imageUrl: 'https://res.cloudinary.com/dybmh6wnf/image/upload/v1770215042/canhdongdiengio_djnmfh.jpg' },
    { id: 7, name: 'Khu lưu niệm nhạc sĩ Cao Văn Lầu', places: '04', imageUrl: 'https://thamhiemmekong.com/wp-content/uploads/2020/06/khuluuniemnhacsicaovanlau01.jpg' },
    { id: 8, name: 'Đầm Thị Tường', places: '04', imageUrl: 'https://thamhiemmekong.com/wp-content/uploads/2020/05/damthituongcamau.jpg' },
    { id: 9, name: 'Quãng trường Phan Ngọc Hiển', places: '04', imageUrl: 'https://images2.thanhnien.vn/528068263637045248/2025/10/14/anh-1-1760416257166897519129.jpg' },
  ];

  return (
    <section className="section-spacing-main px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 theme-transition">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('home.popularDestinations.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('home.popularDestinations.description')}
          </p>
        </div>

        {/* Grid Layout - Giữ nguyên cấu trúc của bạn */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationsData.map((item) => (
            <div 
              key={item.id} 
              className="group relative h-[250px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover brightness-[1.08] contrast-[1.02] transition-transform duration-500 group-hover:scale-110 group-hover:brightness-125"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80"></div>

              {/* Card Content */}
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-white text-xl font-bold drop-shadow-md">
                  {item.name}
                </h3>
                
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularDestinations;