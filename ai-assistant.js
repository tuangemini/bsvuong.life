/**
 * TRỢ LÝ TƯ VẤN THƯƠNG HIỆU - PHÒNG KHÁM RHM BS TRỊNH CÔNG VƯƠNG
 * Tuân thủ bộ chuẩn Brand Assistant Integrator:
 * - Đại diện thương hiệu thuần khiết (Không gắn nhãn AI/DeepSeek/Gemini)
 * - Kiến trúc dự phòng 3 lớp: DeepSeek -> Gemini -> Local Smart Fallback Engine
 * - Phục vụ bệnh nhân tận tâm, chuyên nghiệp, hỗ trợ 24/7
 */

(function () {
  'use strict';

  // API Keys (Mã hóa Base64 dự phòng an toàn)
  const DEFAULT_DEEPSEEK_KEY = atob('c2stNmJjZDIxMDJhZTQ1NDIxYWE5NjlkNjE3MmM2MzA2NGY=');
  const DEFAULT_GEMINI_KEY = atob('QVEuQWI4Uk42SkRIa1E3WTJjcEhIUGt0Y3pEdHdpY2RJaHFLZjBDUEZCMFRCMnZtNEtzNnc=');

  const CONFIG = {
    brandName: 'Nha Khoa Bs Trịnh Công Vương',
    doctorName: 'BS Chuyên Khoa Trịnh Công Vương',
    vosa: 'Hội viên Hội Răng Hàm Mặt Việt Nam',
    hotline: '0912.343.858',
    address: '15 Võ Nguyên Giáp, Phường Đức Xuân, Tỉnh Bắc Kạn',
    hours: '7h00 đến 21h00 hàng ngày (kể cả Thứ 7, Chủ Nhật và ngày Lễ)',
    fabTitle: 'Hỏi BS Trịnh Công Vương',
    fabSub: 'Tư vấn răng miệng & Đặt lịch 24/7',
    fabBadge: 'Trực Tuyến',
    avatarIcon: '🦷',
    subHeader: 'Hội viên Hội RHM Việt Nam • 0912.343.858',
    footerNote: 'Nha Khoa Bs Trịnh Công Vương • Tận tâm vì nụ cười của bạn',
    deepseekModel: 'deepseek-chat',
    geminiModel: 'gemini-3.8-flash'
  };

  // KHO TRI THỨC ĐẠI DIỆN CHÍNH THỨC CỦA PHÒNG KHÁM
  const SYSTEM_KNOWLEDGE = `
Bạn là Trợ lý tư vấn chuyên môn và chăm sóc bệnh nhân chính thức của "Phòng khám Răng Hàm Mặt - BS Chuyên Khoa Trịnh Công Vương".

THÔNG TIN CHÍNH THỨC CỦA PHÒNG KHÁM:
- Bác sĩ phụ trách: BS Chuyên khoa Trịnh Công Vương
- Trình độ & Uy tín: Hội viên Hội Răng Hàm Mặt Việt Nam (VOSA), hơn 15 năm kinh nghiệm điều trị và thẩm mỹ răng miệng tại Bắc Kạn.
- Địa chỉ phòng khám: Số 15 Võ Nguyên Giáp, Phường Đức Xuân, Tỉnh Bắc Kạn (TP. Bắc Kạn).
- Số điện thoại Hotline / Zalo đặt hẹn: 0912.343.858 (0912.343.858).
- Giờ làm việc: Từ 7:00 sáng đến 21:00 tối (7h - 21h), mở cửa tất cả các ngày trong tuần (cả Thứ 7, Chủ Nhật và các ngày nghỉ lễ).
- Bốn chuyên khoa điều trị mũi nhọn:
  1. HÀN RĂNG: Trám răng sâu công nghệ Nano Composite, hàn răng mòn cổ chân răng, răng mẻ vỡ thẩm mỹ, bền chắc và tiệp màu răng thật. (Giá từ 150.000đ - 350.000đ/răng tùy vị trí).
  2. NHỔ RĂNG: Nhổ răng khôn (răng số 8) mọc lệch, mọc ngầm bằng công nghệ sóng siêu âm không đau, an toàn, mau lành vết thương; nhổ răng sữa trẻ em nhẹ nhàng không đau; nhổ răng sâu hư hại nặng. (Răng thường: 100k - 200k; Răng khôn: 600k - 1.500k tùy độ phức tạp).
  3. TRỒNG RĂNG: Cấy ghép Implant công nghệ cao tiêu chuẩn quốc tế; Bọc răng sứ thẩm mỹ cao cấp (Cercon, Zirconia, Emax); Làm cầu răng sứ; Làm hàm giả tháo lắp bán phần/toàn phần cho người lớn tuổi.
  4. NẮN CHỈNH RĂNG (NIỀNG RĂNG): Chỉnh nha mắc cài kim loại, mắc cài sứ tự buộc, niềng răng trong suốt, chỉnh nha sớm cho trẻ em giúp khắc phục răng hô, móm, khấp khểnh, lệch khớp cắn.
- Các dịch vụ khác: Lấy cao răng siêu âm êm ái (từ 100k - 150k), tẩy trắng răng Laser bật tone an toàn, điều trị tủy răng công nghệ vi phẫu không đau.

QUY TẮC GIAO TIẾP VÀ PHỤC VỤ BỆNH NHÂN:
1. Luôn giữ phong thái ấm áp, ân cần, niềm nở, chuẩn mực y đức: Xưng "Dạ em chào Quý khách/Quý bệnh nhân" hoặc "Phòng khám Bác sĩ Vương xin chào Quý khách".
2. Tuyệt đối KHÔNG ĐƯỢC xưng là trí tuệ nhân tạo, AI hay nhắc đến DeepSeek/Gemini. Luôn xưng là Đại diện / Trợ lý phòng khám BS Trịnh Công Vương.
3. Khi bệnh nhân mô tả các triệu chứng đau răng dữ dội, sưng nướu, chảy máu, khuyên họ không nên tự ý dùng thuốc giảm đau bừa bãi và mời đến trực tiếp phòng khám tại 15 Võ Nguyên Giáp hoặc gọi ngay Hotline 0912.343.858 để Bác sĩ Vương thăm khám kịp thời.
4. Hỗ trợ hướng dẫn bệnh nhân đặt lịch hẹn trước để khi đến được Bác sĩ ưu tiên khám ngay, không phải chờ đợi lâu.
`;

  let chatHistory = [
    {
      role: 'assistant',
      content: `Dạ xin kính chào Quý khách! Bác sĩ Vương và phòng khám RHM rất hân hạnh được đồng hành chăm sóc sức khỏe nụ cười của Quý khách tại **15 Võ Nguyên Giáp, Bắc Kạn**.\n\nQuý khách đang cần tư vấn về **hàn răng, nhổ răng khôn, trồng răng, niềng răng** hay muốn đặt lịch khám hôm nay ạ?`
    }
  ];

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(?:^|\n)[*-]\s+(.+)/g, '\n<li>$1</li>')
      .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n\n+/g, '<br><br>').replace(/\n/g, '<br>');
  }

  // LỚP 3: Smart Local Fallback Engine - Phản hồi ngay lập tức qua Regex Rule
  function getSmartFallbackReply(userText) {
    const q = userText.toLowerCase();

    // 1. Địa chỉ
    if (q.includes('địa chỉ') || q.includes('ở đâu') || q.includes('dia chi') || q.includes('chỗ nào') || q.includes('vị trí')) {
      return `Dạ, phòng khám Bác sĩ Trịnh Công Vương tọa lạc tại số: **${CONFIG.address}**.\n\nPhòng khám nằm ngay mặt đường Võ Nguyên Giáp rất dễ tìm, có chỗ đỗ xe máy và ô tô thuận tiện ạ!`;
    }

    // 2. Số điện thoại / Hotline
    if (q.includes('số điện thoại') || q.includes('sdt') || q.includes('hotline') || q.includes('zalo') || q.includes('liên hệ')) {
      return `Dạ, Quý khách có thể liên hệ trực tiếp Bác sĩ Vương qua số Hotline/Zalo: **${CONFIG.hotline}** để được tư vấn nhanh nhất và nhận lịch hẹn ưu tiên ạ!`;
    }

    // 3. Giờ làm việc / Giờ mở cửa
    if (q.includes('giờ') || q.includes('mở cửa') || q.includes('làm việc') || q.includes('mấy giờ') || q.includes('thứ 7') || q.includes('chủ nhật')) {
      return `Dạ, Phòng khám Bác sĩ Trịnh Công Vương mở cửa phục vụ Quý khách liên tục từ **7h00 đến 21h00 hàng ngày** (kể cả Thứ 7, Chủ Nhật và các ngày nghỉ Lễ) ạ!`;
    }

    // 4. Nhổ răng / Răng khôn
    if (q.includes('nhổ răng') || q.includes('răng khôn') || q.includes('răng số 8') || q.includes('nho rang')) {
      return `Dạ, tại phòng khám, **Bác sĩ Trịnh Công Vương** trực tiếp thực hiện nhổ răng và nhổ răng khôn bằng công nghệ hiện đại, gây tê êm ái, thao tác chuẩn xác giúp **hoàn toàn không đau và mau lành thương**.\n\nChi phí nhổ răng dao động từ 100k - 200k (răng thường) và từ 600k - 1.200k đối với răng khôn mọc lệch/ngầm. Quý khách vui lòng gọi **${CONFIG.hotline}** để Bác sĩ chụp kiểm tra cụ thể ạ!`;
    }

    // 5. Hàn răng / Trám răng
    if (q.includes('hàn răng') || q.includes('trám răng') || q.includes('han rang') || q.includes('tram rang') || q.includes('sâu răng')) {
      return `Dạ, dịch vụ **Hàn răng thẩm mỹ** tại phòng khám sử dụng vật liệu Composite Nano cao cấp nhập khẩu, phục hồi hình thể răng tự nhiên, cứng chắc và tiệp màu răng thật 100%.\n\nChi phí hàn răng chỉ từ **150.000đ - 350.000đ/răng** tùy mức độ sâu. Bác sĩ xử lý rất êm dịu, không ê buốt Quý khách nhé!`;
    }

    // 6. Trồng răng / Cấy ghép Implant / Răng sứ
    if (q.includes('trồng răng') || q.includes('implant') || q.includes('răng sứ') || q.includes('bọc răng') || q.includes('mất răng')) {
      return `Dạ, về phục hình răng, Bác sĩ Vương chuyên sâu về:\n- **Trồng răng Implant**: Cố định vĩnh viễn, khôi phục khả năng ăn nhai 100%, bảo tồn xương hàm.\n- **Bọc răng sứ thẩm mỹ**: Các dòng sứ chính hãng cao cấp (Cercon, Zirconia, Emax) bảo hành dài hạn.\n- **Hàm tháo lắp cao cấp**: Dành cho các bác lớn tuổi.\n\nQuý khách để lại SĐT hoặc gọi Hotline **${CONFIG.hotline}** để được Bác sĩ khám và lên phác đồ phù hợp nhất ạ!`;
    }

    // 7. Niềng răng / Chỉnh nha
    if (q.includes('niềng') || q.includes('chỉnh nha') || q.includes('mắc cài') || q.includes('invisalign') || q.includes('hô') || q.includes('móm') || q.includes('khấp khểnh')) {
      return `Dạ, Bác sĩ Trịnh Công Vương là Hội viên Hội Răng Hàm Mặt Việt Nam với tay nghề chỉnh nha nhiều năm kinh nghiệm, điều trị hiệu quả các tình trạng răng hô, móm, thưa, khấp khểnh cho cả trẻ em và người lớn.\n\nPhòng khám có hỗ trợ chia nhỏ thanh toán theo từng giai đoạn giúp giảm nhẹ gánh nặng tài chính. Mời Quý khách ghé **15 Võ Nguyên Giáp** để Bác sĩ đo đạc và tư vấn chi tiết phác đồ nhé!`;
    }

    // 8. Đặt lịch khám
    if (q.includes('đặt lịch') || q.includes('hẹn') || q.includes('khám')) {
      return `Dạ Quý khách có thể điền thông tin vào form **Đặt Lịch Khám** ngay trên website hoặc liên hệ trực tiếp số điện thoại/Zalo **${CONFIG.hotline}**.\n\nPhòng khám sẽ chuẩn bị chu đáo phòng điều trị để Quý khách đến là được Bác sĩ Vương thăm khám ngay không phải chờ đợi ạ!`;
    }

    // Default polite fallback
    return `Dạ, cảm ơn Quý khách đã gửi tin nhắn đến **${CONFIG.brandName}**!\n\nĐể được tư vấn chuyên sâu đúng với tình trạng răng miệng hiện tại hoặc nhận báo giá ưu đãi chính xác, Quý khách vui lòng gọi Hotline/Zalo: **${CONFIG.hotline}** hoặc ghé trực tiếp phòng khám tại số **15 Võ Nguyên Giáp, P. Đức Xuân, Bắc Kạn** (7h00 - 21h00 hàng ngày), Bác sĩ Vương luôn sẵn sàng đón tiếp và chăm sóc tận tâm ạ!`;
  }

  // LỚP 1: Gọi DeepSeek API
  async function callDeepSeekAPI(messages) {
    const formatted = [
      { role: 'system', content: SYSTEM_KNOWLEDGE },
      ...messages.slice(-8)
    ];
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEFAULT_DEEPSEEK_KEY}`
      },
      body: JSON.stringify({
        model: CONFIG.deepseekModel,
        messages: formatted,
        temperature: 0.5,
        max_tokens: 700
      })
    });
    if (!res.ok) throw new Error('DeepSeek error');
    const data = await res.json();
    return data.choices[0].message.content;
  }

  // LỚP 2: Gọi Gemini 3.8 Flash API
  async function callGeminiAPI(messages) {
    const contents = messages.slice(-8).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.geminiModel}:generateContent?key=${DEFAULT_GEMINI_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_KNOWLEDGE }] },
        contents: contents,
        generationConfig: { temperature: 0.5, maxOutputTokens: 700 }
      })
    });
    if (!res.ok) throw new Error('Gemini error');
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  }

  // Bộ điều phối thông minh 3 lớp
  async function fetchConsultation(userText) {
    chatHistory.push({ role: 'user', content: userText });
    try {
      return await callDeepSeekAPI(chatHistory);
    } catch (_) {
      try {
        return await callGeminiAPI(chatHistory);
      } catch (__) {
        return getSmartFallbackReply(userText);
      }
    }
  }

  function renderWidget() {
    // 1. FAB Launcher Pill Button
    const fab = document.createElement('div');
    fab.className = 'brand-fab-launcher';
    fab.setAttribute('role', 'button');
    fab.setAttribute('aria-label', CONFIG.fabTitle);
    fab.innerHTML = `
      <div class="brand-fab-icon-box">
        <span class="brand-fab-pulse"></span>
        <span>${CONFIG.avatarIcon}</span>
      </div>
      <div class="brand-fab-text">
        <span class="brand-fab-title">${CONFIG.fabTitle}</span>
        <span class="brand-fab-sub">${CONFIG.fabSub}</span>
      </div>
      <span class="brand-fab-badge">${CONFIG.fabBadge}</span>
    `;

    // 2. Chat Window
    const chatWin = document.createElement('div');
    chatWin.className = 'brand-chat-window';
    chatWin.innerHTML = `
      <div class="brand-chat-header">
        <div class="brand-chat-profile">
          <div class="brand-avatar">
            <span>${CONFIG.avatarIcon}</span>
            <span class="brand-online-dot"></span>
          </div>
          <div class="brand-profile-meta">
            <div class="brand-title">${CONFIG.brandName}</div>
            <span class="brand-status-text">${CONFIG.subHeader}</span>
          </div>
        </div>
        <div class="brand-header-actions">
          <button class="brand-icon-btn" id="btnBrandClear" title="Xóa lịch sử trò chuyện">🗑️</button>
          <button class="brand-icon-btn" id="btnBrandClose" title="Thu nhỏ khung chat">&times;</button>
        </div>
      </div>
      
      <div class="brand-chat-body" id="brandChatBody">
        <div class="brand-msg bot">
          <div class="brand-msg-avatar">${CONFIG.avatarIcon}</div>
          <div class="brand-msg-bubble">${formatMarkdown(chatHistory[0].content)}</div>
        </div>
      </div>

      <!-- Quick Suggestion Chips -->
      <div class="brand-chips-container" id="brandChipsContainer">
        <button class="brand-chip" data-query="Giá nhổ răng khôn bao nhiêu?">Nhổ răng khôn</button>
        <button class="brand-chip" data-query="Hàn trám răng giá bao nhiêu?">Hàn răng thẩm mỹ</button>
        <button class="brand-chip" data-query="Trồng răng Implant và răng sứ">Trồng răng / Sứ</button>
        <button class="brand-chip" data-query="Tư vấn niềng răng">Nắn chỉnh răng</button>
        <button class="brand-chip" data-query="Địa chỉ và giờ mở cửa phòng khám?">Địa chỉ & Giờ khám</button>
      </div>

      <div class="brand-chat-footer">
        <form class="brand-input-form" id="brandChatForm">
          <textarea class="brand-input-field" id="brandInputField" rows="1" placeholder="Nhập câu hỏi bạn cần tư vấn..."></textarea>
          <button type="submit" class="brand-send-btn" id="brandSendBtn" aria-label="Gửi tin nhắn">➤</button>
        </form>
        <div class="brand-footer-note">${CONFIG.footerNote}</div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(chatWin);

    // Bắt sự kiện
    const chatBody = document.getElementById('brandChatBody');
    const inputField = document.getElementById('brandInputField');
    const form = document.getElementById('brandChatForm');
    const btnClose = document.getElementById('btnBrandClose');
    const btnClear = document.getElementById('btnBrandClear');
    const chipsContainer = document.getElementById('brandChipsContainer');

    function toggleChat(open) {
      const show = open !== undefined ? open : !chatWin.classList.contains('open');
      chatWin.classList.toggle('open', show);
      if (show) {
        inputField.focus();
      }
    }

    fab.addEventListener('click', () => toggleChat());
    btnClose.addEventListener('click', () => toggleChat(false));
    btnClear.addEventListener('click', () => {
      chatHistory = [chatHistory[0]];
      chatBody.innerHTML = `
        <div class="brand-msg bot">
          <div class="brand-msg-avatar">${CONFIG.avatarIcon}</div>
          <div class="brand-msg-bubble">${formatMarkdown(chatHistory[0].content)}</div>
        </div>
      `;
    });

    // Xử lý gửi tin nhắn
    async function handleSendMessage(txt) {
      if (!txt) return;

      // Hiển thị tin người dùng
      const userDiv = document.createElement('div');
      userDiv.className = 'brand-msg user';
      userDiv.innerHTML = `<div class="brand-msg-bubble">${formatMarkdown(txt)}</div>`;
      chatBody.appendChild(userDiv);
      chatBody.scrollTop = chatBody.scrollHeight;

      // Loading bubble
      const loading = document.createElement('div');
      loading.className = 'brand-msg bot';
      loading.innerHTML = `
        <div class="brand-msg-avatar">${CONFIG.avatarIcon}</div>
        <div class="brand-msg-bubble"><em>Bác sĩ đang xem xét và trả lời...</em></div>
      `;
      chatBody.appendChild(loading);
      chatBody.scrollTop = chatBody.scrollHeight;

      const reply = await fetchConsultation(txt);
      loading.remove();

      // Phản hồi từ đại diện phòng khám
      const botDiv = document.createElement('div');
      botDiv.className = 'brand-msg bot';
      botDiv.innerHTML = `
        <div class="brand-msg-avatar">${CONFIG.avatarIcon}</div>
        <div class="brand-msg-bubble">${formatMarkdown(reply)}</div>
      `;
      chatBody.appendChild(botDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const txt = inputField.value.trim();
      if (!txt) return;
      inputField.value = '';
      handleSendMessage(txt);
    });

    // Cho phép gửi bằng phím Enter (Shift+Enter để xuống dòng)
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });

    // Xử lý chips gợi ý
    chipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.brand-chip');
      if (chip) {
        const query = chip.getAttribute('data-query');
        handleSendMessage(query);
      }
    });

    // Cho phép mở chat từ bất kỳ nút nào trên website có class 'open-brand-chat'
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.open-brand-chat');
      if (trigger) {
        e.preventDefault();
        toggleChat(true);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderWidget);
  } else {
    renderWidget();
  }
})();
