'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons';

// Hardcoded article data
const articles = [
  {
    id: 1,
    image: '/images/article.jpg',
    title: 'Power Tools Andal untuk Pekerjaan dan Kebutuhan Sehari-hari – RYU',
    date: '22 October 2025',
    content: `
      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="RYU Power Tools" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">RYU Power Tools adalah solusi andal untuk berbagai kebutuhan pekerjaan konstruksi, renovasi, dan proyek DIY (Do It Yourself). Dengan beragam produk berkualitas tinggi, RYU menawarkan performa maksimal dengan harga terjangkau.</p>

      <p class="mb-6">Produk-produk RYU dirancang dengan teknologi modern dan material berkualitas untuk memastikan daya tahan dan efisiensi dalam setiap penggunaan. Baik untuk profesional maupun pengguna rumahan, RYU Power Tools memberikan solusi yang tepat.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Keunggulan RYU Power Tools</h3>

      <ul class="list-disc list-inside mb-6 space-y-2">
        <li>Harga terjangkau tanpa mengorbankan kualitas</li>
        <li>Tersedia di berbagai toko dan marketplace online</li>
        <li>Garansi resmi dan layanan purna jual yang baik</li>
        <li>Desain ergonomis untuk kenyamanan penggunaan</li>
        <li>Hemat energi dengan performa optimal</li>
      </ul>

      <p class="mb-6">RYU terus berinovasi untuk menghadirkan produk-produk terbaik yang memenuhi kebutuhan pasar Indonesia. Dengan jaringan service center yang luas, kami memastikan pelanggan mendapatkan dukungan penuh dalam menggunakan produk RYU.</p>

      <figure class="wp-block-image size-large mb-8 mt-8">
        <img src="/images/article.jpg" alt="RYU Product Range" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">Dapatkan produk RYU Power Tools di toko-toko terdekat atau marketplace favorit Anda. Untuk informasi lebih lanjut, kunjungi website resmi kami atau hubungi customer service kami.</p>
    `
  },
  {
    id: 2,
    image: '/images/article.jpg',
    title: 'RYU Power Tools: Solusi Andal & Terjangkau untuk Konstruksi, Bengkel, dan DIY',
    date: '25 September 2025',
    content: `
      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="RYU Power Tools Solutions" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">Dalam dunia konstruksi, bengkel, dan proyek DIY, memiliki peralatan yang andal dan berkualitas adalah kunci kesuksesan. RYU Power Tools hadir sebagai solusi terpercaya yang menggabungkan kualitas premium dengan harga yang terjangkau.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Untuk Konstruksi</h3>
      <p class="mb-6">RYU menyediakan berbagai power tools untuk kebutuhan konstruksi profesional, mulai dari bor, gerinda, hingga mesin pemotong. Semua dirancang untuk tahan terhadap kondisi kerja yang berat dan memberikan hasil yang presisi.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Untuk Bengkel</h3>
      <p class="mb-6">Bengkel membutuhkan peralatan yang dapat diandalkan setiap hari. RYU Power Tools menawarkan produk dengan daya tahan tinggi dan performa konsisten untuk mendukung operasional bengkel Anda.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Untuk DIY</h3>
      <p class="mb-6">Bagi penggemar proyek DIY, RYU menyediakan tools yang mudah digunakan namun tetap powerful. Cocok untuk renovasi rumah, pembuatan furniture, dan berbagai proyek kreatif lainnya.</p>

      <figure class="wp-block-image size-large mb-8 mt-8">
        <img src="/images/article.jpg" alt="RYU DIY Projects" class="w-full h-auto rounded-lg shadow-md">
      </figure>
    `
  },
  {
    id: 3,
    image: '/images/article.jpg',
    title: 'Gathering dan Seminar Welding RYU Power Tools',
    date: '4 September 2025',
    content: `
      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="Gathering RYU" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">Hari Sabtu tanggal 30 Agustus, Marketing mengadakan Seminar dan Gathering Welding untuk para Bengkel Las di Bogor dan sekitarnya. Sekitar 48 orang hadir yang berasal dari Komunitas Bengkel Las Indonesia, Asosiasi Pengelasan Indonesia dan Balai Latihan Kerja.</p>

      <p class="mb-6">Tujuan diadakan even ini adalah selain mengenalkan produk-produk welding terbaru juga mengenalkan produk Rexco yang bisa digunakan untuk pengerjaan welding di rumah dan tempat kerjanya.</p>

      <p class="mb-6">Sebagian peserta sudah mengenal produk Ryu dan sudah menggunakannya, selain itu mereka menggunakan merek Lakoni dan Rhino. Alasan memilih produk berdasarkan : Harga Terjangkau, Ketersediaan Barang di toko dan Brand Terpercaya.</p>

      <p class="mb-6">Sekitar 88% sudah mengenal produk Ryu dari Social Media, Toko dan Teman.</p>

      <p class="mb-6">Pada acara tersebut para pengunjung juga bisa mencoba langsung produk-produk Ryu Welding.</p>

      <figure class="wp-block-image size-large mb-8 mt-8">
        <img src="/images/article.jpg" alt="Seminar Welding" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="Product Demo" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="Peserta Seminar" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="Gathering RYU" class="w-full h-auto rounded-lg shadow-md">
      </figure>
    `
  },
  {
    id: 4,
    image: '/images/article.jpg',
    title: 'Hadir di GIIAS 2024, Ryu Powertools Deretan Perkakas Otomotif Terbaiknya',
    date: '23 July 2024',
    content: `
      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="GIIAS 2024" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">RYU Power Tools dengan bangga berpartisipasi dalam ajang Gaikindo Indonesia International Auto Show (GIIAS) 2024. Dalam pameran bergengsi ini, kami memamerkan deretan perkakas otomotif terbaik yang dirancang khusus untuk memenuhi kebutuhan industri otomotif Indonesia.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Produk Unggulan di GIIAS 2024</h3>

      <p class="mb-6">Di booth RYU, pengunjung dapat melihat langsung berbagai produk unggulan seperti impact wrench, air compressor, polisher, dan berbagai tools otomotif lainnya. Semua produk yang dipamerkan telah melalui quality control ketat untuk memastikan performa terbaik.</p>

      <p class="mb-6">Antusiasme pengunjung GIIAS 2024 terhadap produk-produk RYU sangat tinggi. Banyak profesional otomotif dan penggemar mobil yang tertarik dengan kombinasi kualitas premium dan harga kompetitif yang ditawarkan RYU.</p>

      <figure class="wp-block-image size-large mb-8 mt-8">
        <img src="/images/article.jpg" alt="RYU Booth GIIAS" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">Kehadiran RYU di GIIAS 2024 membuktikan komitmen kami untuk terus berinovasi dan memberikan solusi terbaik bagi industri otomotif Indonesia.</p>
    `
  },
  {
    id: 5,
    image: '/images/article.jpg',
    title: 'Tips Memilih Power Tools yang Tepat untuk Proyek Anda',
    date: '15 June 2024',
    content: `
      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="Choosing Power Tools" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">Memilih power tools yang tepat sangat penting untuk kesuksesan proyek Anda. Berikut adalah panduan lengkap untuk membantu Anda membuat keputusan yang tepat.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">1. Tentukan Kebutuhan Proyek</h3>
      <p class="mb-6">Sebelum membeli, tentukan jenis pekerjaan yang akan dilakukan. Apakah untuk konstruksi berat, renovasi rumah, atau proyek DIY? Setiap jenis pekerjaan membutuhkan spesifikasi tools yang berbeda.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">2. Perhatikan Spesifikasi Teknis</h3>
      <p class="mb-6">Cek daya motor, kecepatan rotasi, dan fitur-fitur tambahan. Pastikan spesifikasi sesuai dengan kebutuhan pekerjaan Anda.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">3. Pertimbangkan Budget</h3>
      <p class="mb-6">RYU menawarkan berbagai pilihan dengan range harga yang berbeda. Pilih yang sesuai dengan budget namun tetap memenuhi kebutuhan kualitas.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">4. Cek Garansi dan Layanan Purna Jual</h3>
      <p class="mb-6">Pastikan produk dilengkapi dengan garansi resmi dan tersedia service center terdekat.</p>

      <figure class="wp-block-image size-large mb-8 mt-8">
        <img src="/images/article.jpg" alt="RYU Product Selection" class="w-full h-auto rounded-lg shadow-md">
      </figure>
    `
  },
  {
    id: 6,
    image: '/images/article.jpg',
    title: 'Perawatan Power Tools untuk Performa Maksimal',
    date: '8 May 2024',
    content: `
      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="Power Tools Maintenance" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">Perawatan yang tepat akan memperpanjang usia power tools dan menjaga performanya tetap optimal. Berikut panduan perawatan lengkap untuk tools Anda.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Pembersihan Rutin</h3>
      <p class="mb-6">Bersihkan debu dan kotoran setelah setiap penggunaan. Gunakan kuas lembut atau air compressor untuk membersihkan bagian dalam tools.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Pelumasan</h3>
      <p class="mb-6">Lakukan pelumasan pada bagian yang bergerak secara berkala. Gunakan pelumas yang direkomendasikan oleh produsen.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Penyimpanan yang Tepat</h3>
      <p class="mb-6">Simpan tools di tempat kering dan terhindar dari kelembaban. Gunakan case atau toolbox untuk melindungi dari benturan.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Pengecekan Berkala</h3>
      <p class="mb-6">Periksa kondisi kabel, switch, dan komponen lainnya secara rutin. Segera lakukan perbaikan jika ditemukan kerusakan.</p>

      <figure class="wp-block-image size-large mb-8 mt-8">
        <img src="/images/article.jpg" alt="Tool Maintenance" class="w-full h-auto rounded-lg shadow-md">
      </figure>
    `
  },
  {
    id: 7,
    image: '/images/article.jpg',
    title: 'Inovasi Terbaru dalam Teknologi Power Tools',
    date: '22 April 2024',
    content: `
      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="Power Tools Innovation" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">Industri power tools terus berkembang dengan teknologi yang semakin canggih. RYU selalu mengikuti perkembangan terkini untuk menghadirkan produk-produk inovatif bagi pelanggan.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Motor Brushless</h3>
      <p class="mb-6">Teknologi motor brushless memberikan efisiensi energi lebih baik, daya tahan lebih lama, dan minim perawatan dibanding motor konvensional.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Battery Technology</h3>
      <p class="mb-6">Perkembangan teknologi baterai lithium-ion memberikan daya lebih besar dengan waktu charging lebih cepat dan usia pakai lebih panjang.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Smart Features</h3>
      <p class="mb-6">Beberapa tools terbaru dilengkapi dengan fitur smart seperti LED indicator, auto shut-off, dan speed control untuk kemudahan dan keamanan penggunaan.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Ergonomic Design</h3>
      <p class="mb-6">Desain yang lebih ergonomis mengurangi kelelahan saat penggunaan jangka panjang dan meningkatkan kontrol serta presisi.</p>

      <figure class="wp-block-image size-large mb-8 mt-8">
        <img src="/images/article.jpg" alt="RYU Innovation" class="w-full h-auto rounded-lg shadow-md">
      </figure>
    `
  },
  {
    id: 8,
    image: '/images/article.jpg',
    title: 'RYU Power Tools di Berbagai Industri',
    date: '10 March 2024',
    content: `
      <figure class="wp-block-image size-large mb-8">
        <img src="/images/article.jpg" alt="RYU in Industries" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">RYU Power Tools telah dipercaya oleh berbagai industri di Indonesia. Dari konstruksi hingga manufaktur, produk-produk RYU memberikan solusi yang andal dan efisien.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Industri Konstruksi</h3>
      <p class="mb-6">Kontraktor dan pekerja konstruksi memilih RYU karena ketahanan dan performa tools yang konsisten dalam kondisi kerja berat.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Industri Otomotif</h3>
      <p class="mb-6">Bengkel dan workshop otomotif menggunakan RYU untuk berbagai keperluan maintenance dan reparasi kendaraan.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Industri Furniture</h3>
      <p class="mb-6">Produsen furniture memilih RYU untuk proses cutting, sanding, dan finishing produk-produk kayu mereka.</p>

      <h3 class="text-2xl font-bold text-[#2d5016] mb-4 mt-8">Industri Manufaktur</h3>
      <p class="mb-6">Pabrik-pabrik manufaktur menggunakan RYU untuk berbagai keperluan produksi dan maintenance mesin.</p>

      <figure class="wp-block-image size-large mb-8 mt-8">
        <img src="/images/article.jpg" alt="RYU Applications" class="w-full h-auto rounded-lg shadow-md">
      </figure>

      <p class="mb-6">Kepercayaan berbagai industri terhadap RYU Power Tools membuktikan kualitas dan reliability produk kami.</p>
    `
  }
];

const relatedArticles = [
  { id: 5, title: 'Tips Memilih Power Tools yang Tepat untuk Proyek Anda', date: '15 June 2024' },
  { id: 6, title: 'Perawatan Power Tools untuk Performa Maksimal', date: '8 May 2024' },
  { id: 7, title: 'Inovasi Terbaru dalam Teknologi Power Tools', date: '22 April 2024' }
];

export default function BlogDetailPage() {
  const params = useParams();
  const articleId = parseInt(params.id as string);
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="bg-white py-20">
        <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <Link href="/blog" className="text-[#2d5016] hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-4xl px-8 sm:px-12 lg:px-16">

        {/* Article */}
        <article className="bg-white">
          {/* Cover Image */}
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2d5016] mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <ClockCircleOutlined />
              <time>{article.date}</time>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none
              [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:text-base
              [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-[#2d5016] [&_h3]:mb-4 [&_h3]:mt-8
              [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-6 [&_ul]:space-y-2
              [&_li]:text-gray-700
              [&_figure]:mb-8 [&_figure]:mt-8
              [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-md"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Related Posts */}
        <section className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-[#2d5016] mb-6">
            You Might Also Like
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((related) => {
              const relatedArticle = articles.find(a => a.id === related.id);
              return (
                <Link href={`/blog/${related.id}`} key={related.id}>
                  <div className="flex flex-col h-full group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="overflow-hidden">
                      <img 
                        src={relatedArticle?.image || '/images/article.jpg'} 
                        alt={related.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="text-sm font-semibold text-gray-800 mb-4 line-clamp-3 leading-tight group-hover:text-[#2d5016] transition-colors text-center">
                        {related.title}
                      </h4>
                      <div className="border-t border-gray-300 -mx-6 mt-auto pt-4 px-6">
                        <p className="text-xs text-gray-400 text-center">
                          {related.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
