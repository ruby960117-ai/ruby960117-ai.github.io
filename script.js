// 修正範例
let currentIndex = 0; // 只宣告一次
// 如果後面要重新賦值，直接寫：
currentIndex = 5;


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
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    // 強制處理：如果偵測不到任何區塊（current 是空的），不要亂亮燈
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // 關鍵修改：確保 current 不為空字串，且 href 確實包含該 id
        const href = link.getAttribute('href');
        if (current !== '' && href.includes(current)) {
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

window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const progressBar = document.getElementById('progress-fill');
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            
            // --- 這裡加入淡出邏輯 ---
            loader.style.transition = "opacity 0.5s ease"; // 設定過渡效果
            loader.style.opacity = "0"; // 將透明度變為 0
            
            // 等待 CSS 淡出動畫結束後，將元素隱藏
            setTimeout(() => {
                loader.style.display = 'none';
            },90); 
            // -----------------------
            
        } else {
            // 當進度還很小時，讓他跑得比較慢，接近 100 時再加速
            let increment = (width < 50) ? 0.3 : 2; 
            width += increment;
            progressBar.style.width = width + '%';
        }
    }, 20); // 這裡的速度設定為 50ms 配合你的邏輯很剛好
});

// 在 script.js 中
document.addEventListener('DOMContentLoaded', () => {
    // 透過 IntersectionObserver 觸發才初始化
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                new Typed('#typing-about', {
                    strings: ["張妤安，2007年出生於台北，目前就讀國立臺北藝術大學新媒體藝術學系。"],
                    typeSpeed: 55, // 速度調慢一點比較明顯
                    showCursor: true,
                    cursorChar: '█',
                    loop: false
                });
                observer.unobserve(entry.target); // 執行後停止觀察
            }
        });
    }, { threshold: 0.7});

    const target = document.querySelector('#typing-about');
    if (target) {
        observer.observe(target);
    }
});


const musicBtn = document.getElementById('music-btn');
const audio = document.getElementById('main-audio');

musicBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        musicBtn.classList.add('playing'); // 改變按鈕樣式
    } else {
        audio.pause();
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '🎵';
    }
});

const chatBtn = document.getElementById('chatBtn');
const chatModal = document.getElementById('chatModal');

// 點擊按鈕時，切換顯示/隱藏
chatBtn.addEventListener('click', () => {
    if (chatModal.style.display === 'none') {
        chatModal.style.display = 'block';
    } else {
        chatModal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("網頁已載入，開始綁定聊天室按鈕..."); // 這是檢查用的，打開 F12 看 Console 有沒有這行

    const chatBtn = document.getElementById('chatBtn');
    const chatModal = document.getElementById('chatModal');

    if (chatBtn && chatModal) {
        console.log("成功找到按鈕與對話框！");
        chatBtn.addEventListener('click', () => {
            const style = window.getComputedStyle(chatModal);
            chatModal.style.display = (style.display === 'none') ? 'block' : 'none';
        });
    } else {
        console.error("找不到按鈕或對話框，請檢查 HTML 的 ID 是否完全正確！");
        console.error("chatBtn:", chatBtn, "chatModal:", chatModal);
    }
});

// 從 Firebase 即時獲取訊息並顯示
messagesRef.on('value', (snapshot) => {
    const messagesDiv = document.getElementById('messages');
    if (messagesDiv) {
        messagesDiv.innerHTML = ''; // 先清空原本的
        snapshot.forEach((child) => {
            const msg = child.val();
            // 這行負責把資料變成 HTML 顯示在對話框裡
            messagesDiv.innerHTML += `<p>${msg.text}</p>`;
        });
        // 自動捲動到底部
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        console.log("訊息已更新至畫面"); // 看看 F12 是否有這行
    } else {
        console.error("找不到 ID 為 'messages' 的區域！");
    }
});

// 1. 抓取按鈕和輸入框
const sendBtn = document.getElementById('sendBtn');
const msgInput = document.getElementById('msgInput');
const messagesContainer = document.getElementById('messages');

// 2. 設定點擊事件
sendBtn.addEventListener('click', function() {
    const text = msgInput.value; // 抓取輸入的文字
    
    if (text.trim() !== "") { // 如果文字不是空的
        // 3. 建立新的訊息框
        const newMsg = document.createElement('div');
        newMsg.textContent = text;
        
        // 加上我們剛才定義好的 class，確保它有樣式
        newMsg.classList.add('msg-item'); 
        
        // 放到聊天室容器中
        messagesContainer.appendChild(newMsg);
        
        // 清空輸入框
        msgInput.value = ""; 
        
        // 自動捲動到最下面
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});