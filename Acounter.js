const ROWS = 4;
        const COLS = 24;
        const TOTAL_BOXES = ROWS * COLS;
        const STORAGE_KEY = 'counter_96_data'; // ชื่อคีย์สำหรับบันทึกลงเครื่อง

        const gridContainer = document.getElementById('counter-grid');
        const grandTotalSpan = document.getElementById('grand-total');
        const resetBtn = document.getElementById('reset-btn');

        // โหลดข้อมูลเก่าจาก LocalStorage ถ้าไม่มีให้สร้าง Array 0 ใหม่
        let countsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || new Array(TOTAL_BOXES).fill(0);
        let grandTotal = countsData.reduce((a, b) => a + b, 0); // คำนวณยอดรวมเริ่มต้น
        
        // อัปเดตยอดรวมเริ่มต้นบนหน้าจอ
        grandTotalSpan.innerText = grandTotal.toLocaleString();

        // ฟังก์ชันบันทึกข้อมูล
        function saveData() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(countsData));
        }

        // ฟังก์ชันคำนวณสีแดง
        function getRedColor(count) {
            const baseHue = 0;
            const baseSat = 90;
            let lightness = 98 - (count * 5); 
            if (lightness < 40) lightness = 40;

            const textColor = lightness < 65 ? '#ffffff' : '#5a0000';
            const numOpacity = lightness < 65 ? 0.8 : 0.5;

            return {
                bg: `hsl(${baseHue}, ${baseSat}%, ${lightness}%)`,
                text: textColor,
                numOpacity: numOpacity,
                border: `hsl(${baseHue}, ${baseSat}%, ${lightness - 10}%)`
            };
        }

        // เก็บ References ของ Element กล่องไว้เพื่ออัปเดตภายหลัง
        const boxElements = [];

        // ลูปสร้างช่อง
        for (let i = 0; i < TOTAL_BOXES; i++) {
            const box = document.createElement('div');
            box.classList.add('counter-box');
            
            const boxID = i + 1;
            
            // สร้าง Element ภายใน
            const numberSpan = document.createElement('span');
            numberSpan.classList.add('box-number');
            numberSpan.innerText = boxID;

            const countSpan = document.createElement('span');
            countSpan.classList.add('count-value');
            
            box.appendChild(numberSpan);
            box.appendChild(countSpan);
            
            // เก็บ Element ไว้ใน Array เพื่อให้เรียกใช้ง่ายตอนรีเซ็ต
            boxElements.push({ box, countSpan, numberSpan });

            // ฟังก์ชันสำหรับอัปเดตหน้าตาของกล่องนี้ตามค่า count
            const updateBoxDisplay = (val) => {
                countSpan.innerText = val;
                const colors = getRedColor(val);
                box.style.backgroundColor = colors.bg;
                box.style.color = colors.text;
                box.style.borderColor = colors.border;
                numberSpan.style.opacity = colors.numOpacity;
            };

            // อัปเดตค่าเริ่มต้น (เผื่อโหลดมาแล้วมีค่า)
            updateBoxDisplay(countsData[i]);

            // Event เมื่อคลิก
            box.addEventListener('click', () => {
                countsData[i]++; // เพิ่มค่าใน data
                updateBoxDisplay(countsData[i]); // อัปเดตหน้าจอช่องนั้น
                
                grandTotal++; // เพิ่มยอดรวม
                grandTotalSpan.innerText = grandTotal.toLocaleString();
                
                saveData(); // บันทึกลงเครื่องทันที
            });

            gridContainer.appendChild(box);
        }

        // ฟังก์ชันปุ่มรีเซ็ต
        resetBtn.addEventListener('click', () => {
            if (confirm('คุณแน่ใจหรือไม่ว่าจะล้างค่าการนับทั้งหมด? ข้อมูลจะหายไปถาวร')) {
                // รีเซ็ตข้อมูล data
                countsData = new Array(TOTAL_BOXES).fill(0);
                grandTotal = 0;
                
                // อัปเดตหน้าจอทุกช่อง
                boxElements.forEach((el, index) => {
                    el.countSpan.innerText = 0;
                    // รีเซ็ตสีกลับเป็นค่าเริ่มต้น (count = 0)
                    const colors = getRedColor(0);
                    el.box.style.backgroundColor = colors.bg;
                    el.box.style.color = colors.text;
                    el.box.style.borderColor = colors.border;
                    el.numberSpan.style.opacity = colors.numOpacity;
                });

                // อัปเดตยอดรวม
                grandTotalSpan.innerText = "0";
                
                // บันทึกค่าว่างเปล่าลงเครื่อง
                saveData();
            }
        });
