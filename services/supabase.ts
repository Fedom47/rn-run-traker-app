// ไฟล์ที่ใช้ตั้งค่าการเชื่อมต่อไปยัง Supabase ซึ่งต้องใช้ URL และ KEY ของ Supabase

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uyirekazilgmaijrupvz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5aXJla2F6aWxnbWFpanJ1cHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTA2MjUsImV4cCI6MjA5NDU4NjYyNX0.oU9tq8TSVOu13AducS-lElP5RqPpx2TxAI85HAhdRxk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
