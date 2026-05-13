import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'https://script.google.com/macros/s/AKfycbxD2_aLTsNzftrIaZYFFFgINFR2culsmyVuueHcBKerRHULIKpMCLhGrjnCjh8cvgOXHg/exec';

type Wish = {
  id: string;
  name: string;
  dept: string;
  message: string;
  approved: string;
  hidden: string;
};

export default function App() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}?action=list`);
      const data = await res.json();
      if (data.success) setWishes(data.data);
    } catch {
      setStatus('โหลดข้อมูลไม่สำเร็จ');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveWish = async () => {
    if (!name.trim() || !message.trim()) {
      setStatus('กรุณากรอกชื่อและคำอวยพร');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'add',
          name,
          dept,
          message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setStatus('');
        setName('');
        setDept('');
        setMessage('');
        load();
      } else {
        setStatus(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch {
      setStatus('ส่งคำอวยพรไม่สำเร็จ กรุณาลองใหม่');
    }
  };

  const visibleWishes = wishes.filter(
    (w) => w.approved === 'YES' && w.hidden !== 'YES'
  );

  const displayWishes =
    visibleWishes.length > 0
      ? visibleWishes
      : [
          {
            id: '1',
            name: 'ฝ่าย IT Support',
            dept: '',
            message:
              'สุขสันต์วันเกิดครับ ขอให้สุขภาพแข็งแรง คิดหวังสิ่งใด ขอให้สมปรารถนาทุกประการครับ',
            approved: 'YES',
            hidden: 'NO',
          },
          {
            id: '2',
            name: 'ฝ่ายบัญชี',
            dept: '',
            message:
              'ขอให้มีความสุขมากๆนะคะ สุขภาพแข็งแรง คิดสิ่งใดสมหวัง ร่ำรวยๆ เฮงๆ ปังๆ ค่ะ',
            approved: 'YES',
            hidden: 'NO',
          },
          {
            id: '3',
            name: 'ฝ่ายทรัพยากรบุคคล',
            dept: '',
            message:
              'Happy Birthday ค่ะ ขอให้มีแต่ความสุขในทุกๆวัน เป็นที่รักของทุกคนตลอดไปค่ะ',
            approved: 'YES',
            hidden: 'NO',
          },
        ];

  return (
    <div className="page">
      <header className="header">
        <div className="cake-top">🎂🌿</div>
        <h1 className="title">
          <span>Happy</span> <b>Birthday</b>
        </h1>
        <p className="subtitle">🌿 ร่วมส่งคำอวยพรให้เจ้าของวันเกิด 🌿</p>
      </header>

      <main className="hero">
        <section className="form-card">
          <h2>📝 เขียนคำอวยพร</h2>

          <div className="input-row">
            <input
              placeholder="ชื่อผู้อวยพร"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="แผนก / บริษัท"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            />
          </div>

          <textarea
            placeholder="พิมพ์คำอวยพร"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button onClick={saveWish}>✈️ ส่งคำอวยพร</button>

          <p className="note">🌿 คำอวยพรของคุณจะถูกแสดงในหน้า Birthday Wall</p>

          {submitted && <div className="success">✅ คำอวยพรท่านส่งแล้ว</div>}
          {status && <div className="error">{status}</div>}
        </section>

        <section className="visual-card">
          <div className="balloon left">🎈<br />🎈<br />🎈</div>

          <img
            src="/HBD2026pJOR.png"
            alt="Birthday Card"
            className="birthday-card"
          />

          <div className="balloon right">🎈<br />🎈<br />🎈</div>

          <div className="gift left-gift">🎁</div>
          <div className="gift cake">🎂</div>
          <div className="gift right-gift">🎁</div>
        </section>
      </main>

      <section className="wall">
        <h2>🎁 Birthday Wall</h2>
        <p>คำอวยพรจากเพื่อนร่วมงาน</p>

        <div className="wish-grid">
          {displayWishes.slice(0, 3).map((w) => (
            <article className="wish-card" key={w.id}>
              <span className="quote left-quote">“</span>
              <div>{w.message}</div>
              <span className="quote right-quote">”</span>
              <strong>{w.dept || w.name}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}