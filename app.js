/**
 * PHÒNG KHÁM RĂNG HÀM MẶT BS TRỊNH CÔNG VƯƠNG
 * Main Application Logic & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const isOpen = mainNav.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking a link
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.innerHTML = '☰';
      });
    });
  }

  // 3. Interactive Dental Cost Calculator
  const calcService = document.getElementById('calcService');
  const calcQty = document.getElementById('calcQty');
  const calcQtyVal = document.getElementById('calcQtyVal');
  const calcType = document.getElementById('calcType');
  const calcResult = document.getElementById('calcResult');

  // Pricing matrix
  const PRICING_DATA = {
    han_rang: {
      types: [
        { name: 'Hàn Composite Nano cao cấp', price: 200000 },
        { name: 'Hàn răng mòn cổ chân răng', price: 250000 },
        { name: 'Phục hồi răng mẻ/vỡ thẩm mỹ', price: 350000 },
        { name: 'Hàn răng sâu thông thường', price: 150000 }
      ],
      unit: 'răng'
    },
    nho_rang: {
      types: [
        { name: 'Nhổ răng thường / răng lung lay', price: 150000 },
        { name: 'Nhổ răng sữa trẻ em không đau', price: 80000 },
        { name: 'Nhổ răng khôn (răng số 8) mọc thẳng', price: 600000 },
        { name: 'Nhổ răng khôn mọc lệch / mọc ngầm Piezotome', price: 1200000 }
      ],
      unit: 'răng'
    },
    trong_rang: {
      types: [
        { name: 'Bọc răng sứ Cercon HT chính hãng', price: 2500000 },
        { name: 'Răng toàn sứ Zirconia Đức', price: 1800000 },
        { name: 'Mặt dán sứ Veneer Emax siêu mỏng', price: 3800000 },
        { name: 'Trồng răng Implant Hàn Quốc tiêu chuẩn', price: 11500000 },
        { name: 'Hàm giả tháo lắp bán phần cao cấp', price: 1500000 }
      ],
      unit: 'răng / trụ'
    },
    nieng_rang: {
      types: [
        { name: 'Niềng răng mắc cài kim loại tiêu chuẩn', price: 22000000 },
        { name: 'Niềng răng mắc cài kim loại tự buộc', price: 28000000 },
        { name: 'Niềng răng mắc cài sứ thẩm mỹ cao', price: 35000000 },
        { name: 'Niềng răng trong suốt thẩm mỹ cao', price: 45000000 },
        { name: 'Chỉnh nha tăng trưởng sớm cho trẻ em', price: 8000000 }
      ],
      unit: 'gói trọn gói / liệu trình'
    },
    cao_voi: {
      types: [
        { name: 'Lấy cao răng siêu âm & đánh bóng (Mức độ 1)', price: 120000 },
        { name: 'Lấy cao răng siêu âm chuyên sâu (Mức độ 2)', price: 180000 },
        { name: 'Tẩy trắng răng công nghệ cao Laser Whitening', price: 1200000 }
      ],
      unit: 'lần'
    }
  };

  function updateCalcTypes() {
    if (!calcService || !calcType) return;
    const selectedService = calcService.value;
    const serviceInfo = PRICING_DATA[selectedService];
    if (!serviceInfo) return;

    calcType.innerHTML = '';
    serviceInfo.types.forEach((item, index) => {
      const opt = document.createElement('option');
      opt.value = item.price;
      opt.textContent = `${item.name} (${formatVND(item.price)})`;
      calcType.appendChild(opt);
    });

    // Special case for orthodontic package: limit quantity slider to 1 or 2 jaws
    if (selectedService === 'nieng_rang') {
      calcQty.max = 2;
      if (parseInt(calcQty.value) > 2) calcQty.value = 1;
    } else {
      calcQty.max = 10;
    }
    calcQtyVal.textContent = calcQty.value;
    calculateTotal();
  }

  function calculateTotal() {
    if (!calcType || !calcQty || !calcResult) return;
    const price = parseInt(calcType.value) || 0;
    const qty = parseInt(calcQty.value) || 1;
    const total = price * qty;
    calcResult.textContent = formatVND(total);
  }

  function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  if (calcService && calcType && calcQty) {
    calcService.addEventListener('change', updateCalcTypes);
    calcType.addEventListener('change', calculateTotal);
    calcQty.addEventListener('input', () => {
      calcQtyVal.textContent = calcQty.value;
      calculateTotal();
    });
    // Init calculator
    updateCalcTypes();
  }

  // 4. Interactive Before / After Slider
  const baWrapper = document.getElementById('baWrapper');
  const baAfter = document.getElementById('baAfter');
  const baHandle = document.getElementById('baHandle');

  if (baWrapper && baAfter && baHandle) {
    let isDragging = false;

    function setSliderPosition(x) {
      const rect = baWrapper.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      if (pos < 0) pos = 0;
      if (pos > 1) pos = 1;
      const percentage = pos * 100;
      baAfter.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    }

    // Mouse events
    baWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    // Touch events
    baWrapper.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });
  }

  // 5. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 6. Toast Notification Helper
  function showToast(message, duration = 4000) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <span style="font-size: 1.3rem;">✅</span>
      <div>
        <strong style="display:block; font-size: 0.95rem;">Thông báo từ BS Trịnh Công Vương</strong>
        <span style="font-size: 0.88rem; color: #cbd5e1;">${message}</span>
      </div>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // 7. Booking Form Submission
  const bookingForms = document.querySelectorAll('form[data-booking-form]');
  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="fullname"]')?.value || 'Quý khách';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const service = form.querySelector('[name="service"]')?.value || 'Khám răng tổng quát';
      const date = form.querySelector('[name="date"]')?.value || 'Hôm nay';
      const time = form.querySelector('[name="time"]')?.value || 'Sớm nhất';

      // Save to localStorage as a record
      const bookings = JSON.parse(localStorage.getItem('bsvuong_bookings') || '[]');
      bookings.push({
        name, phone, service, date, time,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('bsvuong_bookings', JSON.stringify(bookings));

      // Reset form
      form.reset();

      // Show confirmation dialog / modal
      showBookingSuccessModal(name, phone, service, date, time);
    });
  });

  function showBookingSuccessModal(name, phone, service, date, time) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal-backdrop';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease-out;
    `;

    modal.innerHTML = `
      <div style="
        background: #ffffff;
        border-radius: 24px;
        max-width: 500px;
        width: 100%;
        padding: 36px 30px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        text-align: center;
        position: relative;
        border: 2px solid #e0f2fe;
      ">
        <div style="
          width: 70px;
          height: 70px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          margin: 0 auto 20px;
          box-shadow: 0 8px 16px rgba(22, 163, 74, 0.2);
        ">✓</div>

        <h3 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
          Đặt Lịch Khám Thành Công!
        </h3>
        
        <p style="color: #64748b; font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px;">
          Dạ, phòng khám đã ghi nhận lịch hẹn của <strong>${name}</strong> (${phone}). Bác sĩ Trịnh Công Vương và trợ lý sẽ chuẩn bị sẵn phòng khám để đón tiếp Quý khách chu đáo nhất!
        </p>

        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 14px; padding: 16px; text-align: left; margin-bottom: 24px; font-size: 0.9rem;">
          <div style="margin-bottom: 6px;"><strong>Dịch vụ:</strong> ${service}</div>
          <div style="margin-bottom: 6px;"><strong>Thời gian hẹn:</strong> ${time} - Ngày: ${date}</div>
          <div style="margin-bottom: 6px;"><strong>Địa chỉ:</strong> 15 Võ Nguyên Giáp, P. Đức Xuân, Bắc Kạn</div>
          <div><strong>Hotline hỗ trợ:</strong> <a href="tel:0912343858" style="color: #dc2626; font-weight: 700;">0912 343858</a></div>
        </div>

        <button id="btnCloseModal" style="
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
        ">Đã Hiểu & Đóng</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btnCloseModal').addEventListener('click', () => {
      modal.remove();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // 8. Quick Booking Trigger on Service Click
  window.selectServiceAndScroll = function(serviceName) {
    const serviceSelect = document.querySelector('#bookingForm [name="service"]');
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
    const bookingSection = document.getElementById('dat-lich');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Set default booking date to today
  const dateInput = document.querySelector('[name="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }
});
