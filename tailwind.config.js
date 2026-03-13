/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Travel Base Colors
        brand: {
          'dark': '#0F172A',     // Slate tối sâu (thay cho đen thuần)
          'charcoal': '#1E293B', // Nền card tối cao cấp
          'cream': '#F8FAFC',    // Off-white hiện đại, sạch sẽ
          'accent': '#0284C7',   // Sky blue điểm nhấn hiện đại
          'white': '#ffffff',
        },
        heritage: {
          // Tinh chỉnh Đỏ sang màu "Wine/Crimson" để trông sang trọng hơn
          red: {
            50: '#FFF1F2',
            500: '#E11D48', // Modern Rose-Red
            600: '#BE123C',
            700: '#9F1239',
            900: '#4C0519',
          },
          // Tinh chỉnh Vàng sang màu "Champagne/Burnished Gold"
          gold: {
            400: '#FDE047',
            500: '#EAB308',
            600: '#CA8A04',
            700: '#A16207',
          },
          // Màu Đất hiện đại (tone Taupe/Warm Gray)
          earth: {
            200: '#E2E8F0',
            500: '#64748B',
            800: '#334155',
          },
          cream: {
            50: '#FFFBF5',   // nền cực nhạt, hợp background section
            100: '#FEF3E2',
            200: '#FDE6C7',
            300: '#FBD5A5',
            400: '#F8C27F',
            500: '#F2A65A',
          }
        }
      },
      fontFamily: {
        // Tiêu đề sang trọng kiểu tạp chí du lịch
        sans: ['Be Vietnam Pro', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        // Nội dung cực kỳ dễ đọc, chuẩn modern UI
        body: ['Be Vietnam Pro', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        // Soft ambient shadows (đặc trưng của modern design)
        'modern': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'modern-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.1)',
      },
      borderRadius: {
        // Bo góc lớn tạo cảm giác hiện đại, mobile-friendly
        'heritage': '1rem',
        '2xl': '1.5rem',
      },
      backgroundImage: {
        'modern-gradient': 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.8) 100%)',
        'glass-texture': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
