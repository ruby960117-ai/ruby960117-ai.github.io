let currentIndex = 0;

const track = document.querySelector('.slider-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const totalSlides = document.querySelectorAll('.slider-track img').length;

if (track && prevBtn && nextBtn) {
    function updateSlider() {
        // 💡 計算每張圖該往左移動多少像素 (400px 是妳圖的寬度)
        const amountToMove = currentIndex * -400;
        track.style.transform = `translateX(${amountToMove}px)`;
    }

    // 點擊下一張
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });

    // 點擊上一張
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
}
// 2. 導覽列滾動動態高亮 (Scroll Spy)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // 減去導覽列高度(70px)做出更精準的判斷
        if (pageYOffset >= (sectionTop - 80)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const gridItems = document.querySelectorAll('.grid-item');

    // 創建一個觀察者
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 如果格子進入視窗（哪怕只有一部分）
            if (entry.isIntersecting) {
                // 添加 'show' 類，觸發 CSS 動畫
                entry.target.classList.add('show');
                // 一旦觸發，就停止觀察該元素（防止重復動畫）
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,    // 觀察視窗
        rootMargin: '0px',
        threshold: 0.2 // 當格子有 20% 進入視窗時觸發
    });

    // 開始觀察每個格子
    gridItems.forEach(item => {
        observer.observe(item);
    });
});
new p5((p) => {
  p.setup = () => {
    // 建立畫布並直接鎖定父元素
    let canvas = p.createCanvas(60, 60);
    canvas.parent('p5-footer-star');
  };

  p.draw = () => {
  p.clear();
  p.translate(30, 30);
  
  // 偵測滑鼠是否在星星的容器範圍內
  // 我們直接使用 p5.js 的內建屬性來偵測 (相對於畫布左上角)
  let isHovering = p.mouseX > 0 && p.mouseX < 60 && p.mouseY > 0 && p.mouseY < 60;
  
  // 根據是否 hover 決定旋轉速度
  let speed = isHovering ? 0.1 : 0.02; // 移入時變快，平時慢
  p.rotate(p.frameCount * speed);
  
  // 顏色變化：移入時變為白色(255)，平常為淺綠色(180, 255, 200)
  let currentColor = isHovering ? 255 : p.color(180, 255, 200);
  p.stroke(currentColor);
  p.strokeWeight(3);
  p.noFill();
  
  drawStar(p, 0, 0, 10, 25, 5);
};
});

// 必須有的函數
function drawStar(p, x, y, radius1, radius2, npoints) {
  let angle = p.TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  p.beginShape();
  for (let a = 0; a < p.TWO_PI; a += angle) {
    p.vertex(x + p.cos(a) * radius2, y + p.sin(a) * radius2);
    p.vertex(x + p.cos(a + halfAngle) * radius1, y + p.sin(a + halfAngle) * radius1);
  }
  p.endShape(p.CLOSE);
}



// 等待網頁完全載入後再開始，確保能抓到 HTML 裡的星星
document.addEventListener('DOMContentLoaded', () => {
    const trails = document.querySelectorAll('.trail');
    let mouseX = 0, mouseY = 0;

    // 監聽滑鼠位置
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrails() {
        let targetX = mouseX;
        let targetY = mouseY;

        trails.forEach((trail, index) => {
            // 抓取當前位置
            let currentX = parseFloat(trail.style.left) || 0;
            let currentY = parseFloat(trail.style.top) || 0;

            // 調整跟隨速度 (索引越大，速度越慢，拖尾效果越好)
            const speed = 0.3 - (index * 0.015);
            
            // 計算新位置
            let nextX = currentX + (targetX - currentX) * speed;
            let nextY = currentY + (targetY - currentY) * speed;

            // 寫入座標
            trail.style.left = nextX + 'px';
            trail.style.top = nextY + 'px';

            // 寫入變小與變淡的效果
            const size = 20 - (index * 1.5); 
            const opacity = 1 - (index / trails.length);
            
            trail.style.fontSize = Math.max(size, 5) + 'px';
            trail.style.opacity = opacity;

            // 將當前位置給下一顆星星追蹤
            targetX = nextX;
            targetY = nextY;
        });

        requestAnimationFrame(animateTrails);
    }

    animateTrails();
});