// 공통 스크립트: 모바일 메뉴 토글, 현재 페이지 메뉴 활성화
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnMenu');
  const nav = document.getElementById('nav');
  const current = document.body.dataset.page;

  // 활성 메뉴 표시
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.dataset.key === current) a.classList.add('active');
  });

  // 모바일 메뉴 토글
  btn?.addEventListener('click', () => {
    if (getComputedStyle(nav).display === 'none') {
      nav.style.display = 'flex';
    } else {
      nav.style.display = 'none';
    }
  });

  // 링크 클릭 시 모바일 메뉴 닫기
  nav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth < 900) nav.style.display = 'none';
    });
  });

  /* ============================
     서비스 탭(is-active) 상태 관리
     ============================ */
  const tabsBar   = document.querySelector('.feature-tabs');
  const tabLinks  = tabsBar ? Array.from(tabsBar.querySelectorAll('.tabs a')) : [];
  const sections  = tabLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (tabLinks.length && sections.length) {
    // 클릭 시 즉시 활성화 표시
    tabLinks.forEach(a => {
      a.addEventListener('click', () => {
        tabLinks.forEach(x => x.classList.remove('is-active'));
        a.classList.add('is-active');
      });
    });

    // 스크롤 위치에 따라 자동 활성화 (IntersectionObserver)
    const header   = document.querySelector('.site-header');
    const headerH  = header ? header.offsetHeight : 0;
    const tabsH    = tabsBar ? tabsBar.offsetHeight : 0;

    const io = ('IntersectionObserver' in window)
      ? new IntersectionObserver((entries) => {
          // 가장 많이 보이는 섹션을 active
          const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;

          const id = '#' + visible.target.id;
          tabLinks.forEach(x => x.classList.toggle('is-active', x.getAttribute('href') === id));
        }, {
          // 헤더+탭 높이만큼 위쪽을 보정
          root: null,
          rootMargin: `-${headerH + tabsH + 8}px 0px -55% 0px`,
          threshold: [0.25, 0.5, 0.75]
        })
      : null;

    if (io) sections.forEach(sec => io.observe(sec));

    // 해시로 진입/변경 시 동기화
    const syncFromHash = () => {
      const hash = location.hash;
      if (!hash) return;
      tabLinks.forEach(x => x.classList.toggle('is-active', x.getAttribute('href') === hash));
    };
    window.addEventListener('hashchange', syncFromHash);
    // 초기 동기화 (없으면 첫 탭 활성화)
    if (location.hash) {
      syncFromHash();
    } else {
      tabLinks[0].classList.add('is-active');
    }
  }
});
