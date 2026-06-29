# E-Commerce & Delivery Platform

แพลตฟอร์มซื้อขายสินค้าออนไลน์พร้อมระบบจัดส่งแบบครบวงจร ที่ออกแบบมาให้สวยงามและใช้งานง่ายเทียบเท่าแพลตฟอร์มชั้นนำในไทย (Shopee, Lazada, TikTok) 

โปรเจกต์นี้ถูกสร้างขึ้นตามโจทย์ `internship_ecommerce_delivery.md` โดยใช้เทคโนโลยี:
- **Frontend**: Next.js (App Router), Tailwind CSS, Shadcn UI, Leaflet Maps
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL (ผ่าน Prisma)

## โครงสร้างโปรเจกต์
- `/frontend` - ระบบหน้าบ้าน (Next.js)
- `/backend` - ระบบหลังบ้าน (Express API)

## ฟีเจอร์ที่พัฒนาแล้ว (UI & Mock Data)
- **Home Page**: หน้าแรกสไตล์ Shopee/Lazada พร้อมระบบ Flash Sale, หมวดหมู่ และ สินค้าแนะนำ (Just For You)
- **Cart**: ระบบตะกร้าสินค้า ปรับจำนวน ลบรายการสินค้า และคำนวณราคารวม
- **Checkout & Map**: หน้าสั่งซื้อสินค้า เลือกการชำระเงิน (COD / โอนเงินพร้อมอัปโหลดสลิป) และ **ระบบปักหมุดที่อยู่บนแผนที่จริง** ด้วย Leaflet + OpenStreetMap
- **Admin Dashboard**: แดชบอร์ดสรุปยอดขาย จัดการออเดอร์
- **Admin Map Routing**: แผนที่สำหรับแอดมินดูเส้นทางการจัดส่งสินค้าจากร้านไปยังลูกค้าแต่ละคน
- **Auth Pages**: หน้า Login / Register สวยงามใช้งานง่าย

## การติดตั้งและรันโปรเจกต์

### Frontend (Next.js)
1. เข้าไปที่โฟลเดอร์ `frontend`
   ```bash
   cd frontend
   ```
2. ติดตั้ง Dependencies (หากยังไม่ได้ติดตั้ง)
   ```bash
   npm install
   ```
3. รัน Development Server
   ```bash
   npm run dev
   ```
4. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

### Backend (Express)
1. เข้าไปที่โฟลเดอร์ `backend`
   ```bash
   cd backend
   ```
2. ติดตั้ง Dependencies (หากยังไม่ได้ติดตั้ง)
   ```bash
   npm install
   ```
3. ตั้งค่า Database URL ในไฟล์ `prisma/schema.prisma` หรือ `.env` (ค่าเริ่มต้นคือ PostgreSQL)
4. สร้างฐานข้อมูลและตาราง
   ```bash
   npx prisma db push
   ```
5. รัน Server
   ```bash
   npm run dev
   ```
6. API จะทำงานที่ `http://localhost:5000`

## หมายเหตุ
- ข้อมูลในหน้า Frontend ปัจจุบันส่วนใหญ่เป็น Mock data เพื่อแสดงความสวยงามและ UX/UI 
- สามารถเชื่อมต่อ API ฝั่ง Backend ได้โดยการเขียน Service (fetch) เรียกไปยัง Express API ที่ได้เตรียม Router และ Controller ไว้แล้วอย่างครบถ้วน
