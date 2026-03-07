/**
 * Post-Reading Quizzes Data
 * Short quizzes that appear after viewing heritage details
 * Tests user comprehension and awards bonus points
 */

export const postReadingQuizzes = {
  // Căn cứ Cái Chanh
  1: {
    heritageId: 1,
    heritageName: 'Căn cứ Cái Chanh',
    questions: [
      {
        id: 'h1_q1',
        type: 'multiple_choice',
        question: 'Căn cứ Cái Chanh được xếp hạng di tích quốc gia đặc biệt năm nào?',
        questionEn: 'In what year was Cai Chanh Base recognized as a special national relic?',
        options: ['2017', '2018', '2020', '2022'],
        optionsEn: ['2017', '2018', '2020', '2022'],
        correct: 2,
        explanation: 'Căn cứ Cái Chanh được xếp hạng di tích quốc gia đặc biệt vào năm 2020.',
        explanationEn: 'Cai Chanh Base was recognized as a special national relic in 2020.',
      },
      {
        id: 'h1_q2',
        type: 'true_false',
        question: 'Căn cứ Cái Chanh tọa lạc tại xã Ninh Thạnh Lợi, tỉnh Cà Mau.',
        questionEn: 'Cai Chanh Base is located in Ninh Thanh Loi commune, Ca Mau province.',
        correct: true,
        explanation: 'Căn cứ Cái Chanh tọa lạc tại ấp Cây Cui, xã Ninh Thạnh Lợi, tỉnh Cà Mau.',
        explanationEn: 'Cai Chanh Base is located in Cay Cui hamlet, Ninh Thanh Loi commune, Ca Mau province.',
      },
    ],
  },

  // Đình Tân Hưng
  2: {
    heritageId: 2,
    heritageName: 'Đình Tân Hưng',
    questions: [
      {
        id: 'h2_q1',
        type: 'multiple_choice',
        question: 'Đình Tân Hưng được xây dựng vào năm nào?',
        questionEn: 'When was Tan Hung Communal House built?',
        options: ['1895', '1900', '1907', '1915'],
        optionsEn: ['1895', '1900', '1907', '1915'],
        correct: 2,
        explanation: 'Đình Tân Hưng được xây dựng vào năm 1907.',
        explanationEn: 'Tan Hung Communal House was built in 1907.',
      },
      {
        id: 'h2_q2',
        type: 'multiple_choice',
        question: 'Đình Tân Hưng thuộc loại xếp hạng di tích nào?',
        questionEn: 'What type of ranking does Tan Hung Communal House have?',
        options: ['Quốc gia đặc biệt', 'Quốc gia', 'Cấp tỉnh', 'Chưa xếp hạng'],
        optionsEn: ['Special National', 'National', 'Provincial', 'Not ranked'],
        correct: 1,
        explanation: 'Đình Tân Hưng được xếp hạng di tích cấp quốc gia.',
        explanationEn: 'Tan Hung Communal House is ranked as a national-level relic.',
      },
    ],
  },

  // Đền thờ Bác Hồ
  3: {
    heritageId: 3,
    heritageName: 'Đền thờ Bác Hồ',
    questions: [
      {
        id: 'h3_q1',
        type: 'true_false',
        question: 'Đền thờ Bác Hồ là nơi thờ phụng Chủ tịch Hồ Chí Minh.',
        questionEn: 'The Temple of Uncle Ho is a place of worship for President Ho Chi Minh.',
        correct: true,
        explanation: 'Đền thờ Bác Hồ được xây dựng để tưởng nhớ và thờ phụng Chủ tịch Hồ Chí Minh.',
        explanationEn: 'The Temple of Uncle Ho was built to commemorate and worship President Ho Chi Minh.',
      },
      {
        id: 'h3_q2',
        type: 'multiple_choice',
        question: 'Đền thờ Bác Hồ nằm ở đâu?',
        questionEn: 'Where is the Temple of Uncle Ho located?',
        options: ['Phường An Xuyên', 'Xã Phú Tân', 'Xã Năm Căn', 'Xã Trí Phải'],
        optionsEn: ['An Xuyen ward', 'Phu Tan commune', 'Nam Can commune', 'Tri Phai commune'],
        correct: 0,
        explanation: 'Đền thờ Bác Hồ nằm tại phường An Xuyên, tỉnh Cà Mau.',
        explanationEn: 'The Temple of Uncle Ho is located in An Xuyen ward, Ca Mau province.',
      },
    ],
  },

  // Chùa Quan Âm
  4: {
    heritageId: 4,
    heritageName: 'Chùa Quan Âm',
    questions: [
      {
        id: 'h4_q1',
        type: 'multiple_choice',
        question: 'Chùa Quan Âm thuộc tôn giáo nào?',
        questionEn: 'What religion does Quan Am Pagoda belong to?',
        options: ['Cao Đài', 'Phật giáo', 'Thiên Chúa giáo', 'Hồi giáo'],
        optionsEn: ['Cao Dai', 'Buddhism', 'Christianity', 'Islam'],
        correct: 1,
        explanation: 'Chùa Quan Âm là một ngôi chùa Phật giáo.',
        explanationEn: 'Quan Am Pagoda is a Buddhist temple.',
      },
      {
        id: 'h4_q2',
        type: 'true_false',
        question: 'Quan Âm là tên gọi của Đức Phật Thích Ca.',
        questionEn: 'Quan Am is another name for Buddha Shakyamuni.',
        correct: false,
        explanation: 'Quan Âm (Quan Thế Âm Bồ Tát) là một vị Bồ Tát trong Phật giáo, không phải Đức Phật Thích Ca.',
        explanationEn: 'Quan Am (Avalokitesvara Bodhisattva) is a Bodhisattva in Buddhism, not Buddha Shakyamuni.',
      },
    ],
  },

  // Di tích lịch sử Hòn Đá Bạc
  5: {
    heritageId: 5,
    heritageName: 'Di tích lịch sử Hòn Đá Bạc',
    questions: [
      {
        id: 'h5_q1',
        type: 'multiple_choice',
        question: 'Hòn Đá Bạc thuộc xã nào của tỉnh Cà Mau?',
        questionEn: 'Which commune of Ca Mau province is Hon Da Bac in?',
        options: ['Xã Đá Bạc', 'Xã Tân Ân', 'Xã Gành Hào', 'Xã Trí Phải'],
        optionsEn: ['Da Bac commune', 'Tan An commune', 'Ganh Hao commune', 'Tri Phai commune'],
        correct: 0,
        explanation: 'Hòn Đá Bạc thuộc xã Đá Bạc, tỉnh Cà Mau.',
        explanationEn: 'Hon Da Bac is located in Da Bac commune, Ca Mau province.',
      },
      {
        id: 'h5_q2',
        type: 'true_false',
        question: 'Hòn Đá Bạc là một hòn đảo nằm ở biển.',
        questionEn: 'Hon Da Bac is an island in the sea.',
        correct: true,
        explanation: 'Hòn Đá Bạc là một đảo nhỏ nằm ở vùng biển Cà Mau.',
        explanationEn: 'Hon Da Bac is a small island located in the Ca Mau sea area.',
      },
    ],
  },

  // Khu di tích Bến Vàm Lũng
  6: {
    heritageId: 6,
    heritageName: 'Khu di tích Bến Vàm Lũng',
    questions: [
      {
        id: 'h6_q1',
        type: 'multiple_choice',
        question: 'Bến Vàm Lũng có vai trò gì trong lịch sử?',
        questionEn: 'What role did Ben Vam Lung play in history?',
        options: [
          'Cảng thương mại',
          'Bến tiếp nhận vũ khí từ miền Bắc',
          'Cảng đánh cá',
          'Bến phà',
        ],
        optionsEn: [
          'Commercial port',
          'Port for receiving weapons from the North',
          'Fishing port',
          'Ferry terminal',
        ],
        correct: 1,
        explanation: 'Bến Vàm Lũng là nơi tiếp nhận vũ khí từ miền Bắc chi viện cho miền Nam trong kháng chiến.',
        explanationEn: 'Ben Vam Lung was a port for receiving weapons from the North to support the South during the resistance war.',
      },
      {
        id: 'h6_q2',
        type: 'true_false',
        question: 'Bến Vàm Lũng thuộc xã Phan Ngọc Hiển, tỉnh Cà Mau.',
        questionEn: 'Ben Vam Lung is located in Phan Ngoc Hien commune, Ca Mau province.',
        correct: true,
        explanation: 'Bến Vàm Lũng thuộc xã Phan Ngọc Hiển, tỉnh Cà Mau.',
        explanationEn: 'Ben Vam Lung is located in Phan Ngoc Hien commune, Ca Mau province.',
      },
    ],
  },

  // Bia chiến thắng Mỹ Trinh
  7: {
    heritageId: 7,
    heritageName: 'Bia chiến thắng Mỹ Trinh',
    questions: [
      {
        id: 'h7_q1',
        type: 'multiple_choice',
        question: 'Trận đánh Mỹ Trinh diễn ra vào ngày nào?',
        questionEn: 'When did the My Trinh battle take place?',
        options: ['28/12/1972', '30/4/1975', '2/9/1945', '19/5/1972'],
        optionsEn: ['28/12/1972', '30/4/1975', '2/9/1945', '19/5/1972'],
        correct: 0,
        explanation: 'Trận phục kích tiêu diệt Đại đội bảo an 915 diễn ra vào ngày 28/12/1972.',
        explanationEn: 'The ambush that destroyed Battalion 915 took place on December 28, 1972.',
      },
      {
        id: 'h7_q2',
        type: 'true_false',
        question: 'Bia Chiến thắng Mỹ Trinh được xây dựng năm 2008.',
        questionEn: 'The My Trinh Victory Monument was built in 2008.',
        correct: true,
        explanation: 'Công trình Bia Chiến thắng Mỹ Trinh được bàn giao và đưa vào sử dụng vào năm 2008.',
        explanationEn: 'The My Trinh Victory Monument was handed over and put into use in 2008.',
      },
    ],
  },

  // Đền thờ Chủ tịch Hồ Chí Minh (Châu Thới)
  8: {
    heritageId: 8,
    heritageName: 'Đền thờ Chủ tịch Hồ Chí Minh',
    questions: [
      {
        id: 'h8_q1',
        type: 'multiple_choice',
        question: 'Đền thờ Chủ tịch Hồ Chí Minh được xếp hạng di tích cấp nào?',
        questionEn: 'What ranking does the President Ho Chi Minh Temple have?',
        options: ['Cấp tỉnh', 'Quốc gia', 'Quốc gia đặc biệt', 'Cấp cơ sở'],
        optionsEn: ['Provincial', 'National', 'Special National', 'Local-level'],
        correct: 1,
        explanation: 'Năm 1998, Đền thờ Chủ tịch Hồ Chí Minh được công nhận là Di tích Lịch sử - Văn hóa cấp Quốc gia.',
        explanationEn: 'In 1998, the President Ho Chi Minh Temple was recognized as a National-level Historical and Cultural Relic.',
      },
      {
        id: 'h8_q2',
        type: 'true_false',
        question: 'Đền thờ được khởi công xây dựng vào ngày 25/4/1972.',
        questionEn: 'The temple construction started on April 25, 1972.',
        correct: true,
        explanation: 'Lễ khởi công xây dựng Đền thờ Bác được tổ chức lúc 10 giờ sáng ngày 25/4/1972.',
        explanationEn: 'The groundbreaking ceremony for the temple was held at 10 am on April 25, 1972.',
      },
    ],
  },

  // Vườn cò xã Phước Long
  9: {
    heritageId: 9,
    heritageName: 'Vườn cò xã Phước Long',
    questions: [
      {
        id: 'h9_q1',
        type: 'multiple_choice',
        question: 'Diện tích vườn cò xã Phước Long là bao nhiêu?',
        questionEn: 'What is the area of Phuoc Long commune stork garden?',
        options: ['2 ha', '3,8 ha', '5 ha', '10 ha'],
        optionsEn: ['2 ha', '3.8 ha', '5 ha', '10 ha'],
        correct: 1,
        explanation: 'Vườn cò có diện tích 3,8 ha theo thông tin từ chính quyền địa phương.',
        explanationEn: 'The stork garden has an area of 3.8 hectares according to local authorities.',
      },
      {
        id: 'h9_q2',
        type: 'true_false',
        question: 'Vườn cò là nơi cư trú của nhiều loài chim như cò trắng, cò ma, diệc mốc.',
        questionEn: 'The stork garden is home to many bird species such as white herons, black-winged stilts, and painted storks.',
        correct: true,
        explanation: 'Vườn cò Phước Long là nơi cư trú của nhiều loài chim quý, bao gồm cò trắng, cò ma, diệc mốc, cồng cọc.',
        explanationEn: 'Phuoc Long stork garden is home to many precious bird species including white herons, black-winged stilts, painted storks, and night herons.',
      },
    ],
  },

  // Di tích Chủ Chọt
  10: {
    heritageId: 10,
    heritageName: 'Di tích Chủ Chọt',
    questions: [
      {
        id: 'h10_q1',
        type: 'multiple_choice',
        question: 'Cuộc nổi dậy của nông dân Ninh Thạnh Lợi do ai lãnh đạo?',
        questionEn: 'Who led the Ninh Thanh Loi peasant uprising?',
        options: ['Trần Quang Diệu', 'Trần Kim Túc', 'Cao Văn Lầu', 'Nguyễn Văn Mến'],
        optionsEn: ['Tran Quang Dieu', 'Tran Kim Tuc', 'Cao Van Lau', 'Nguyen Van Men'],
        correct: 1,
        explanation: 'Ông Trần Kim Túc (Chủ Chọt) là người lãnh đạo cuộc nổi dậy của nông dân Ninh Thạnh Lợi năm 1927.',
        explanationEn: 'Mr. Tran Kim Tuc (Chu Chot) was the leader of the Ninh Thanh Loi peasant uprising in 1927.',
      },
      {
        id: 'h10_q2',
        type: 'true_false',
        question: 'Di tích Chủ Chọt được xếp hạng di tích quốc gia năm 2024.',
        questionEn: 'The Chu Chot relic was ranked as a national relic in 2024.',
        correct: true,
        explanation: 'Tháng 3/2024, Bộ trưởng Bộ VH-TT&DL đã ký Quyết định xếp hạng di tích quốc gia đối với Di tích lịch sử Địa điểm nổi dậy của nông dân Ninh Thạnh Lợi (1927).',
        explanationEn: 'In March 2024, the Minister of Culture, Sports and Tourism signed a Decision to rank the historical relic of the Ninh Thanh Loi peasant uprising site (1927) as a national relic.',
      },
    ],
  },

  // Phủ thờ Bác Hồ
  11: {
    heritageId: 11,
    heritageName: 'Phủ thờ Bác Hồ',
    questions: [
      {
        id: 'h11_q1',
        type: 'true_false',
        question: 'Phủ thờ Bác Hồ nổi tiếng ở Cà Mau nằm tại xã Trí Phải, tỉnh Cà Mau.',
        questionEn: 'The famous Ho Chi Minh Shrine in Ca Mau is located in Tri Phai commune, Ca Mau province.',
        correct: true,
        explanation: 'Phủ thờ Bác Hồ (ấp Phủ Thờ) là địa chỉ tưởng niệm quen thuộc tại xã Trí Phải, tỉnh Cà Mau.',
        explanationEn: 'The Ho Chi Minh Shrine (Phu Tho hamlet area) is a well-known memorial site in Tri Phai commune, Ca Mau province.',
      },
      {
        id: 'h11_q2',
        type: 'multiple_choice',
        question: 'Phủ thờ Bác Hồ là nơi thờ phụng ai?',
        questionEn: 'Who is worshipped at the Ho Chi Minh Shrine?',
        options: ['Chủ tịch Hồ Chí Minh', 'Trần Quang Diệu', 'Cao Văn Lầu', 'Nguyễn Trung Trực'],
        optionsEn: ['President Ho Chi Minh', 'Tran Quang Dieu', 'Cao Van Lau', 'Nguyen Trung Truc'],
        correct: 0,
        explanation: 'Phủ thờ Bác Hồ là nơi thờ phụng Chủ tịch Hồ Chí Minh.',
        explanationEn: 'The Ho Chi Minh Shrine is a place of worship for President Ho Chi Minh.',
      },
    ],
  },

  // Nghĩa trang Liệt sĩ xã Phước Long
  12: {
    heritageId: 12,
    heritageName: 'Nghĩa trang Liệt sĩ xã Phước Long',
    questions: [
      {
        id: 'h12_q1',
        type: 'multiple_choice',
        question: 'Nghĩa trang Liệt sĩ xã Phước Long chủ yếu có ý nghĩa gì?',
        questionEn: 'What is the primary significance of Phuoc Long Martyrs Cemetery?',
        options: ['Điểm vui chơi giải trí', 'Nơi tưởng niệm và tri ân liệt sĩ', 'Khu thương mại', 'Khu sản xuất nông nghiệp'],
        optionsEn: ['Entertainment place', 'Memorial and tribute site for martyrs', 'Commercial area', 'Agricultural production zone'],
        correct: 1,
        explanation: 'Nghĩa trang liệt sĩ là nơi tưởng niệm, tri ân những người đã hy sinh vì độc lập dân tộc.',
        explanationEn: 'A martyrs cemetery is a memorial site to honor those who sacrificed for national independence.',
      },
      {
        id: 'h12_q2',
        type: 'true_false',
        question: 'Nghĩa trang Liệt sĩ xã Phước Long là nơi giáo dục truyền thống yêu nước cho thế hệ trẻ.',
        questionEn: 'Phuoc Long Martyrs Cemetery is a place to educate younger generations about patriotism.',
        correct: true,
        explanation: 'Các nghĩa trang liệt sĩ không chỉ là nơi tưởng niệm mà còn là “địa chỉ đỏ” trong giáo dục truyền thống.',
        explanationEn: 'Martyrs cemeteries are not only memorials but also educational “red addresses” for historical tradition.',
      },
    ],
  },

  // Lễ hội Chol Chnam Thmay
  13: {
    heritageId: 13,
    heritageName: 'Lễ hội Chol Chnam Thmay',
    questions: [
      {
        id: 'h13_q1',
        type: 'multiple_choice',
        question: 'Lễ hội Chol Chnam Thmay được tổ chức vào thời gian nào?',
        questionEn: 'When is the Chol Chnam Thmay festival held?',
        options: ['Tháng 1 âm lịch', 'Tháng 4 dương lịch', 'Tháng 7 âm lịch', 'Tháng 10 dương lịch'],
        optionsEn: ['Lunar January', 'April (solar)', 'Lunar July', 'October (solar)'],
        correct: 1,
        explanation: 'Lễ hội Chol Chnam Thmay thường diễn ra vào giữa tháng 4 dương lịch (tháng 3 âm lịch).',
        explanationEn: 'The Chol Chnam Thmay festival usually takes place in mid-April (solar calendar).',
      },
      {
        id: 'h13_q2',
        type: 'true_false',
        question: 'Chol Chnam Thmay là Tết cổ truyền của người Khmer.',
        questionEn: 'Chol Chnam Thmay is the traditional New Year of the Khmer people.',
        correct: true,
        explanation: 'Chol Chnam Thmay là lễ hội mừng năm mới theo lịch cổ truyền của dân tộc Khmer.',
        explanationEn: 'Chol Chnam Thmay is the New Year festival according to the traditional calendar of the Khmer people.',
      },
    ],
  },

  // Lễ hội Ooc Om Boc
  14: {
    heritageId: 14,
    heritageName: 'Lễ hội Ooc Om Boc',
    questions: [
      {
        id: 'h14_q1',
        type: 'multiple_choice',
        question: 'Lễ hội Ooc Om Boc được tổ chức vào ngày nào?',
        questionEn: 'When is the Ooc Om Boc festival held?',
        options: ['Rằm tháng 8 âm lịch', 'Rằm tháng 10 âm lịch', 'Rằm tháng 4 âm lịch', 'Rằm tháng 12 âm lịch'],
        optionsEn: ['Full moon of 8th lunar month', 'Full moon of 10th lunar month', 'Full moon of 4th lunar month', 'Full moon of 12th lunar month'],
        correct: 1,
        explanation: 'Lễ hội Ooc Om Boc được tổ chức vào rằm tháng 10 âm lịch hàng năm.',
        explanationEn: 'The Ooc Om Boc festival is held on the full moon of the 10th lunar month every year.',
      },
      {
        id: 'h14_q2',
        type: 'true_false',
        question: 'Lễ hội Ooc Om Boc còn được gọi là Lễ Cúng Trăng.',
        questionEn: 'The Ooc Om Boc festival is also called the Moon Worshipping Festival.',
        correct: true,
        explanation: 'Lễ hội Ooc Om Boc còn được biết đến với tên gọi Lễ Cúng Trăng hay Lễ Đút cốm dẹp.',
        explanationEn: 'The Ooc Om Boc festival is also known as the Moon Worshipping Festival or Rice Flake Feeding Ceremony.',
      },
    ],
  },

  // Di tích Đồng Nọc Nạng
  18: {
    heritageId: 18,
    heritageName: 'Di tích Đồng Nọc Nạng',
    questions: [
      {
        id: 'h18_q1',
        type: 'true_false',
        question: 'Di tích Đồng Nọc Nạng được xếp hạng di tích quốc gia.',
        questionEn: 'Dong Noc Nang relic was ranked as a national relic.',
        correct: true,
        explanation: 'Di tích Đồng Nọc Nạng được xếp hạng di tích lịch sử - văn hóa cấp quốc gia.',
        explanationEn: 'Dong Noc Nang relic was ranked as a national-level historical and cultural relic.',
      },
      {
        id: 'h18_q2',
        type: 'multiple_choice',
        question: 'Cuộc nổi dậy Đồng Nọc Nạng diễn ra vào năm nào?',
        questionEn: 'In what year did the Dong Noc Nang uprising take place?',
        options: ['1924', '1927', '1928', '1930'],
        optionsEn: ['1924', '1927', '1928', '1930'],
        correct: 2,
        explanation: 'Cuộc nổi dậy Đồng Nọc Nạng diễn ra vào năm 1928.',
        explanationEn: 'The Dong Noc Nang uprising took place in 1928.',
      },
    ],
  },

  // Chùa Xiêm Cán
  26: {
    heritageId: 26,
    heritageName: 'Chùa Xiêm Cán',
    questions: [
      {
        id: 'h26_q1',
        type: 'multiple_choice',
        question: 'Chùa Xiêm Cán được xây dựng năm nào?',
        questionEn: 'When was Xiem Can Pagoda built?',
        options: ['1875', '1887', '1902', '1920'],
        optionsEn: ['1875', '1887', '1902', '1920'],
        correct: 1,
        explanation: 'Chùa Xiêm Cán được khởi công xây dựng vào tháng 4 năm 1887.',
        explanationEn: 'Xiem Can Pagoda began construction in April 1887.',
      },
      {
        id: 'h26_q2',
        type: 'true_false',
        question: 'Chùa Xiêm Cán được xếp hạng di tích cấp tỉnh năm 2001.',
        questionEn: 'Xiem Can Pagoda was ranked as a provincial-level relic in 2001.',
        correct: true,
        explanation: 'Năm 2001, Chùa Xiêm Cán được UBND tỉnh Bạc Liêu xếp hạng là di tích kiến trúc nghệ thuật cấp tỉnh (nay thuộc tỉnh Cà Mau).',
        explanationEn: 'In 2001, Xiem Can Pagoda was ranked as a provincial-level architectural and artistic relic by Bac Lieu Provincial People\'s Committee (now in Ca Mau province).',
      },
    ],
  },

  // Nhà Công tử Bạc Liêu
  38: {
    heritageId: 38,
    heritageName: 'Nhà Công tử Bạc Liêu',
    questions: [
      {
        id: 'h38_q1',
        type: 'multiple_choice',
        question: 'Nhà Công tử Bạc Liêu được xây dựng vào năm nào?',
        questionEn: 'When was the Bac Lieu Prince\'s House built?',
        options: ['1900-1905', '1910-1915', '1917-1919', '1920-1925'],
        optionsEn: ['1900-1905', '1910-1915', '1917-1919', '1920-1925'],
        correct: 2,
        explanation: 'Nhà Công tử Bạc Liêu được xây dựng trong giai đoạn 1917-1919.',
        explanationEn: 'The Bac Lieu Prince\'s House was built during 1917-1919.',
      },
      {
        id: 'h38_q2',
        type: 'true_false',
        question: 'Công tử Bạc Liêu có tên thật là Trần Trinh Huy.',
        questionEn: 'The real name of Bac Lieu Prince was Tran Trinh Huy.',
        correct: true,
        explanation: 'Công tử Bạc Liêu tên thật là Trần Trinh Huy (1900-1974), con trai thứ ba của Hội đồng Trạch.',
        explanationEn: 'The real name of Bac Lieu Prince was Tran Trinh Huy (1900-1974), the third son of Hoi dong Trach.',
      },
    ],
  },

  // Lễ hội Dạ cổ hoài lang
  44: {
    heritageId: 44,
    heritageName: 'Lễ hội Dạ cổ hoài lang',
    questions: [
      {
        id: 'h44_q1',
        type: 'multiple_choice',
        question: 'Bản nhạc Dạ cổ hoài lang do ai sáng tác?',
        questionEn: 'Who composed the song Da Co Hoai Lang?',
        options: ['Trần Quang Diệu', 'Cao Văn Lầu', 'Trần Trinh Huy', 'Nguyễn Văn Sâm'],
        optionsEn: ['Tran Quang Dieu', 'Cao Van Lau', 'Tran Trinh Huy', 'Nguyen Van Sam'],
        correct: 1,
        explanation: 'Bản Dạ cổ hoài lang do nhạc sĩ Cao Văn Lầu (Sáu Lầu) sáng tác tại Bạc Liêu.',
        explanationEn: 'Da Co Hoai Lang was composed by musician Cao Van Lau (Sau Lau) in Bac Lieu.',
      },
      {
        id: 'h44_q2',
        type: 'true_false',
        question: 'Lễ hội Dạ cổ hoài lang được tổ chức vào tháng 8 âm lịch tại Bạc Liêu.',
        questionEn: 'The Da Co Hoai Lang festival is held in the 8th lunar month in Bac Lieu.',
        correct: true,
        explanation: 'Lễ hội Dạ cổ hoài lang thường tổ chức trong tháng 8 âm lịch, gắn với các hoạt động tưởng niệm cố nhạc sĩ Cao Văn Lầu.',
        explanationEn: 'The Da Co Hoai Lang festival is usually held during the 8th lunar month, associated with commemorative activities for musician Cao Van Lau.',
      },
    ],
  },

  // Hòn Đá Bạc
  63: {
    heritageId: 63,
    heritageName: 'Hòn Đá Bạc',
    questions: [
      {
        id: 'h63_q1',
        type: 'multiple_choice',
        question: 'Hòn Đá Bạc được xếp hạng di tích quốc gia vào năm nào?',
        questionEn: 'In what year was Hon Da Bac ranked as a national relic?',
        options: ['2005', '2007', '2009', '2011'],
        optionsEn: ['2005', '2007', '2009', '2011'],
        correct: 2,
        explanation: 'Ngày 22/6/2009, khu vực Hòn Đá Bạc được xếp hạng di tích lịch sử - văn hóa cấp quốc gia.',
        explanationEn: 'On June 22, 2009, Hon Da Bac area was ranked as a national-level historical and cultural relic.',
      },
      {
        id: 'h63_q2',
        type: 'true_false',
        question: 'Hòn Đá Bạc có liên quan đến kế hoạch phản gián CM12.',
        questionEn: 'Hon Da Bac is related to the CM12 counter-intelligence plan.',
        correct: true,
        explanation: 'Hòn Đá Bạc là nơi đặt Trung tâm chỉ huy Kế hoạch phản gián CM12 (09/9/1981–09/9/1984).',
        explanationEn: 'Hon Da Bac was the location of the CM12 counter-intelligence plan command center (09/9/1981–09/9/1984).',
      },
    ],
  },

  // Bến Vàm Lũng
  66: {
    heritageId: 66,
    heritageName: 'Bến Vàm Lũng',
    questions: [
      {
        id: 'h66_q1',
        type: 'true_false',
        question: 'Bến Vàm Lũng là điểm cuối của tuyến Đường Hồ Chí Minh trên biển.',
        questionEn: 'Ben Vam Lung was the end point of the Ho Chi Minh Trail at sea.',
        correct: true,
        explanation: 'Bến Vàm Lũng là điểm cuối của tuyến Đường Hồ Chí Minh trên biển và là bến tàu "không số" quan trọng ở cực Nam.',
        explanationEn: 'Ben Vam Lung was the end point of the Ho Chi Minh Trail at sea and an important "numberless" port in the far South.',
      },
      {
        id: 'h66_q2',
        type: 'multiple_choice',
        question: 'Tàu Phương Đông 1 cập bến Vàm Lũng lần đầu vào ngày nào?',
        questionEn: 'When did the Phuong Dong 1 ship first dock at Vam Lung?',
        options: ['16/10/1960', '16/10/1962', '16/10/1965', '16/10/1970'],
        optionsEn: ['16/10/1960', '16/10/1962', '16/10/1965', '16/10/1970'],
        correct: 1,
        explanation: 'Ngày 16/10/1962, tàu Phương Đông 1 cập bến Vàm Lũng an toàn, mở đầu tuyến vận tải chiến lược trên biển.',
        explanationEn: 'On October 16, 1962, the Phuong Dong 1 ship safely docked at Vam Lung, opening the strategic maritime transport route.',
      },
    ],
  },

  // Default quiz for heritages without specific questions
  default: {
    heritageId: 0,
    heritageName: 'Di sản văn hóa',
    questions: [
      {
        id: 'default_q1',
        type: 'true_false',
        question: 'Tỉnh Cà Mau nằm ở cực Nam của Việt Nam.',
        questionEn: 'Ca Mau province is located at the southernmost point of Vietnam.',
        correct: true,
        explanation: 'Cà Mau là tỉnh cực Nam của Việt Nam, nơi có Mũi Cà Mau - điểm cực Nam đất nước.',
        explanationEn: 'Ca Mau is the southernmost province of Vietnam, home to Ca Mau Cape - the southernmost point of the country.',
      },
      {
        id: 'default_q2',
        type: 'multiple_choice',
        question: 'Cà Mau hiện có bao nhiêu đơn vị hành chính cấp xã/phường?',
        questionEn: 'How many commune/ward-level administrative units does Ca Mau currently have?',
        options: ['54', '60', '64', '70'],
        optionsEn: ['54', '60', '64', '70'],
        correct: 2,
        explanation: 'Cà Mau hiện có 64 đơn vị hành chính cấp xã/phường.',
        explanationEn: 'Ca Mau currently has 64 commune/ward-level administrative units.',
      },
    ],
  },
};

/**
 * Get quiz for a specific heritage
 * @param {number} heritageId - Heritage ID
 * @returns {Object} Quiz data
 */
export function getQuizForHeritage(heritageId) {
  return postReadingQuizzes[heritageId] || postReadingQuizzes.default;
}

/**
 * Get random question from a heritage quiz
 * @param {number} heritageId - Heritage ID
 * @param {number} count - Number of questions to get
 * @returns {Array} Array of questions
 */
export function getRandomQuestions(heritageId, count = 2) {
  const quiz = getQuizForHeritage(heritageId);
  const questions = [...quiz.questions];

  // Shuffle and take 'count' questions
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions.slice(0, Math.min(count, questions.length));
}

/**
 * Check if a heritage has specific quiz questions
 * @param {number} heritageId - Heritage ID
 * @returns {boolean}
 */
export function hasCustomQuiz(heritageId) {
  return heritageId in postReadingQuizzes && heritageId !== 'default';
}

export default postReadingQuizzes;
